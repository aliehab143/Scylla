from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow import keras
import tensorflow_probability as tfp
from tensorflow.keras import layers
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from werkzeug.utils import secure_filename
import json

# Initialize Flask app
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Hyperparameters
time_step = 8
x_dim = 1
lstm_h_dim = 128
z_dim = 64
batch_size = 32
threshold = 14.433690071105957

# Custom Layers
class Sampling(layers.Layer):
    def __init__(self, name='sampling_z'):
        super(Sampling, self).__init__(name=name)

    def call(self, inputs):
        mu, logvar = inputs
        sigma = tf.keras.backend.exp(logvar * 0.5)
        batch_size = tf.shape(mu)[0]
        z_dim_inferred = tf.shape(mu)[1]
        epsilon = tf.keras.backend.random_normal(shape=(batch_size, z_dim_inferred), mean=0.0, stddev=1.0)
        return mu + epsilon * sigma

class Encoder(layers.Layer):
    def __init__(self, time_step=8, x_dim=1, lstm_h_dim=32, z_dim=8, name='encoder', **kwargs):
        super(Encoder, self).__init__(name=name, **kwargs)
        self.encoder_lstm = layers.LSTM(lstm_h_dim, activation='softplus', name='encoder_lstm', stateful=False)
        self.z_mean = layers.Dense(z_dim, name='z_mean')
        self.z_logvar = layers.Dense(z_dim, name='z_log_var')
        self.z_sample = Sampling()

    def call(self, inputs):
        hidden = self.encoder_lstm(inputs)
        mu_z = self.z_mean(hidden)
        logvar_z = self.z_logvar(hidden)
        z = self.z_sample((mu_z, logvar_z))
        return mu_z, logvar_z, z

class Decoder(layers.Layer):
    def __init__(self, time_step=8, x_dim=1, lstm_h_dim=32, z_dim=8, name='decoder', **kwargs):
        super(Decoder, self).__init__(name=name, **kwargs)
        self.z_inputs = layers.RepeatVector(time_step, name='repeat_vector')
        self.decoder_lstm_hidden = layers.LSTM(lstm_h_dim, activation='softplus', return_sequences=True, name='decoder_lstm')
        self.x_mean = layers.Dense(x_dim, name='x_mean')
        self.x_sigma = layers.Dense(x_dim, name='x_sigma', activation='tanh')

    def call(self, inputs):
        z = self.z_inputs(inputs)
        hidden = self.decoder_lstm_hidden(z)
        mu_x = self.x_mean(hidden)
        sigma_x = self.x_sigma(hidden)
        return mu_x, sigma_x

class LSTM_VAE(keras.Model):
    def __init__(self, time_step=8, x_dim=1, lstm_h_dim=32, z_dim=8, name='lstm_vae', **kwargs):
        super(LSTM_VAE, self).__init__(name=name, **kwargs)
        self.encoder = Encoder(time_step, x_dim, lstm_h_dim, z_dim, **kwargs)
        self.decoder = Decoder(time_step, x_dim, lstm_h_dim, z_dim, **kwargs)

    def call(self, inputs):
        mu_z, logvar_z, z = self.encoder(inputs)
        mu_x, sigma_x = self.decoder(z)
        kl_loss = -0.5 * tf.reduce_mean(tf.reduce_sum(1 + logvar_z - tf.square(mu_z) - tf.exp(logvar_z), axis=1))
        self.add_loss(kl_loss)
        dist = tfp.distributions.Normal(loc=mu_x, scale=tf.abs(sigma_x) + 1e-6)
        log_px = -dist.log_prob(inputs)
        recon_loss = tf.reduce_mean(tf.reduce_sum(log_px, axis=[1, 2]))
        self.add_loss(recon_loss)
        return mu_x, sigma_x, log_px

# Load model
custom_objects = {
    "Sampling": Sampling,
    "Encoder": Encoder,
    "Decoder": Decoder,
    "LSTM_VAE": LSTM_VAE
}
model = keras.models.load_model("lstm_vae_model.keras", custom_objects=custom_objects)

# Load label encoder
loaded_encoder = joblib.load("train_label_encoder.pkl")

# Helper Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_time_features(data):
    data['timestamp'] = pd.to_datetime(data['timestamp'])
    data['year'] = data['timestamp'].dt.year
    data['month'] = data['timestamp'].dt.month
    data['day'] = data['timestamp'].dt.day
    data['hour'] = data['timestamp'].dt.hour

    user_features = data.groupby(['uid', 'year', 'month', 'day', 'hour']) \
        .agg({'type': lambda x: ','.join(map(str, x))}) \
        .reset_index()

    user_features['prev_hour'] = user_features.groupby(['uid', 'year', 'month', 'day'])['hour'].shift(1)
    user_features['is_consecutive'] = (user_features['hour'] - user_features['prev_hour']) == 1
    user_features['group'] = (~user_features['is_consecutive']).cumsum()

    merged_features = user_features.groupby(['uid', 'year', 'month', 'day', 'group']).agg({
        'hour': 'first',
        'type': lambda x: ','.join(x)
    }).reset_index()

    event_sequences = [seq.split(',') for seq in merged_features['type'].tolist()]
    # Store original string sequences
    merged_features['original_sequences'] = event_sequences
    return merged_features, event_sequences

def encode_events(merged_features, event_sequences, encoder):
    encoded_sequences = [encoder.transform(seq).tolist() for seq in event_sequences]
    merged_features['encoded_data'] = encoded_sequences
    return merged_features

def create_windows_per_sequence(data, column="encoded_data", window_size=8, stride=1, pad_value=-1):
    all_windows = []
    for seq in data[column]:
        seq = list(seq)
        if len(seq) < window_size:
            padded_seq = seq + [pad_value] * (window_size - len(seq))
            all_windows.append(padded_seq)
        else:
            for i in range(0, len(seq) - window_size + 1, stride):
                all_windows.append(seq[i:i + window_size])
    return np.array(all_windows, dtype=int)

def preprocess_data(data):
    sequences = np.array(data.iloc[:, 0].tolist(), dtype=np.float32)
    if sequences.shape[1] != 8:
        raise ValueError(f"Expected 8 events per sequence, got {sequences.shape[1]}")
    return sequences.reshape(-1, 8, 1)

def prepare_test_dataset(test_data):
    test_sequences = preprocess_data(test_data)
    test_sequences = test_sequences.astype(np.float32)
    if np.any(np.isnan(test_sequences)) or np.any(np.isinf(test_sequences)):
        raise ValueError("Test data contains NaN or Inf")
    return tf.data.Dataset.from_tensor_slices(test_sequences).batch(batch_size), test_sequences

def detect_test_anomalies(model, threshold, test_sequences_scaled):
    _, _, test_log_px = model.predict(test_sequences_scaled, batch_size=32)
    test_log_px_per_sequence = np.sum(test_log_px, axis=1)
    df_test_log_px = pd.DataFrame({'log_px': test_log_px_per_sequence.flatten()})
    df_test_log_px['anomaly'] = df_test_log_px['log_px'] > threshold
    anomaly_indices = df_test_log_px[df_test_log_px['anomaly']].index.tolist()
    anomalies = test_sequences_scaled[anomaly_indices]
    return anomalies, df_test_log_px

@app.route('/detect_anomalies', methods=['POST'])
def detect_anomalies_api():
    # Check if file is uploaded (CSV case)
    if 'file' in request.files:
        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only CSV files are allowed'}), 400
        
        try:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            data = pd.read_csv(filepath)
            source_type = 'csv'
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Error processing CSV: {str(e)}'}), 400
    
    # Check if JSON data is in request body
    elif request.is_json:
        try:
            json_data = request.get_json()
            # Convert JSON to DataFrame
            data = pd.DataFrame(json_data)
            source_type = 'json'
        except Exception as e:
            return jsonify({'error': f'Error processing JSON: {str(e)}'}), 400
    
    else:
        return jsonify({'error': 'No file uploaded or JSON data provided'}), 400

    # Validate required columns
    required_columns = {'uid', 'timestamp', 'type'}
    if not required_columns.issubset(data.columns):
        if source_type == 'csv' and 'filepath' in locals():
            os.remove(filepath)
        return jsonify({'error': f'Input must contain columns: {required_columns}'}), 400

    try:
        # Extract time features and event sequences
        merged_features, event_sequences = extract_time_features(data)
        
        # Encode the events
        merged_features = encode_events(merged_features, event_sequences, loaded_encoder)
        
        # Create windows of sequences
        expanded_sequences = create_windows_per_sequence(merged_features)
        
        # Prepare the test dataset and scale sequences
        _, sequences_scaled = prepare_test_dataset(pd.DataFrame({'sequences': expanded_sequences.tolist()}))
        
        # Detect anomalies
        anomalies, anomaly_df = detect_test_anomalies(model, threshold, sequences_scaled)
        
        # Create a list to store all sequences with their uids, anomaly status, and scores
        all_sequences = []
        anomalies_detected = 0
        
        # Map sequences back to their uids
        sequence_idx = 0
        for idx, row in merged_features.iterrows():
            uid = row['uid']
            encoded_seq = row['encoded_data']
            original_seq = row['original_sequences']
            seq_length = len(encoded_seq)
            window_size = 8
            stride = 1
            
            if seq_length < window_size:
                num_windows = 1
            else:
                num_windows = (seq_length - window_size) // stride + 1
            
            for i in range(num_windows):
                if sequence_idx >= len(anomaly_df):
                    break
                anomaly_row = anomaly_df.iloc[sequence_idx]
                
                if seq_length < window_size:
                    window_seq = original_seq + ['PAD'] * (window_size - seq_length)
                else:
                    start_idx = i * stride
                    window_seq = original_seq[start_idx:start_idx + window_size]
                
                all_sequences.append({
                    'uid': uid,
                    'sequence': window_seq,
                    'anomaly': bool(anomaly_row['anomaly']),
                    'anomaly,enomaly_score': float(anomaly_row['log_px'])
                })
                if anomaly_row['anomaly']:
                    anomalies_detected += 1
                sequence_idx += 1
        
        # Clean up uploaded file if it was CSV
        if source_type == 'csv' and 'filepath' in locals():
            os.remove(filepath)
        
        response = {
            'total_sequences_processed': len(expanded_sequences),
            'anomalies_detected': anomalies_detected,
            'sequences': all_sequences,
            'source_type': source_type,
            'message': 'Anomaly detection completed successfully'
        }
        return jsonify(response), 200
    
    except Exception as e:
        if source_type == 'csv' and 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5007)