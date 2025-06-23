
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json
from flask import Flask, request, jsonify
import threading
import time
from pyngrok import ngrok, conf
import os

# Initialize Flask app
app = Flask(__name__)

# Define sampling function
def sampling(args):
    z_mean, z_log_var = args
    epsilon = tf.keras.backend.random_normal(shape=tf.shape(z_mean))
    return z_mean + tf.exp(0.5 * z_log_var) * epsilon

# Define encoder architecture
def build_encoder(input_shape, latent_dim=128):
    encoder_inputs = keras.Input(shape=input_shape)
    x = layers.Conv1D(32, 7, padding='same', activation='relu')(encoder_inputs)
    x = layers.MaxPooling1D(2)(x)
    x = layers.Conv1D(16, 7, padding='same', activation='relu')(x)
    x = layers.MaxPooling1D(2)(x)
    x = layers.Flatten()(x)
    z_mean = layers.Dense(latent_dim, name='z_mean')(x)
    z_log_var = layers.Dense(latent_dim, name='z_log_var')(x)
    return keras.Model(encoder_inputs, [z_mean, z_log_var], name='encoder')

# Define decoder architecture
def build_decoder(output_shape, latent_dim=128):
    latent_inputs = keras.Input(shape=(latent_dim,))
    x = layers.Dense((output_shape[0] // 4) * 16, activation='relu')(latent_inputs)
    x = layers.Reshape(((output_shape[0] // 4), 16))(x)
    x = layers.Conv1DTranspose(16, 7, padding='same', activation='relu')(x)
    x = layers.UpSampling1D(2)(x)
    x = layers.Conv1DTranspose(32, 7, padding='same', activation='relu')(x)
    x = layers.UpSampling1D(2)(x)
    outputs = layers.Conv1D(1, 7, padding='same', activation='linear')(x)
    return keras.Model(latent_inputs, outputs, name='decoder')

# Define custom VAE class
class VAE(keras.Model):
    def __init__(self, encoder, decoder, **kwargs):
        super(VAE, self).__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder
        self.total_loss_tracker = keras.metrics.Mean(name="total_loss")
        self.reconstruction_loss_tracker = keras.metrics.Mean(name="reconstruction_loss")
        self.kl_loss_tracker = keras.metrics.Mean(name="kl_loss")

    def call(self, inputs, training=False):
        z_mean, z_log_var = self.encoder(inputs)
        z = sampling([z_mean, z_log_var])
        reconstruction = self.decoder(z)
        return reconstruction

    def train_step(self, data):
        if isinstance(data, tuple):
            data = data[0]
        with tf.GradientTape() as tape:
            z_mean, z_log_var = self.encoder(data)
            z = sampling([z_mean, z_log_var])
            reconstruction = self.decoder(z)
            reconstruction_loss = tf.reduce_mean(
                tf.reduce_sum(tf.square(data - reconstruction), axis=[1, 2])
            )
            kl_loss = -0.5 * tf.reduce_mean(
                tf.reduce_sum(1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var), axis=1)
            )
            total_loss = reconstruction_loss + kl_loss
        grads = tape.gradient(total_loss, self.trainable_weights)
        self.optimizer.apply_gradients(zip(grads, self.trainable_weights))
        self.total_loss_tracker.update_state(total_loss)
        self.reconstruction_loss_tracker.update_state(reconstruction_loss)
        self.kl_loss_tracker.update_state(kl_loss)
        return {
            "loss": self.total_loss_tracker.result(),
            "reconstruction_loss": self.reconstruction_loss_tracker.result(),
            "kl_loss": self.kl_loss_tracker.result(),
        }

    def test_step(self, data):
        if isinstance(data, tuple):
            data = data[0]
        z_mean, z_log_var = self.encoder(data)
        z = sampling([z_mean, z_log_var])
        reconstruction = self.decoder(z)
        reconstruction_loss = tf.reduce_mean(
            tf.reduce_sum(tf.square(data - reconstruction), axis=[1, 2])
        )
        kl_loss = -0.5 * tf.reduce_mean(
            tf.reduce_sum(1 + z_log_var - tf.square(z_mean) - tf.exp(z_log_var), axis=1)
        )
        total_loss = reconstruction_loss + kl_loss
        self.total_loss_tracker.update_state(total_loss)
        self.reconstruction_loss_tracker.update_state(reconstruction_loss)
        self.kl_loss_tracker.update_state(kl_loss)
        return {
            "loss": self.total_loss_tracker.result(),
            "reconstruction_loss": self.reconstruction_loss_tracker.result(),
            "kl_loss": self.kl_loss_tracker.result(),
        }

    def get_config(self):
        config = super(VAE, self).get_config()
        config.update({
            'encoder_config': self.encoder.get_config(),
            'decoder_config': self.decoder.get_config()
        })
        return config

    @classmethod
    def from_config(cls, config, custom_objects=None):
        encoder = keras.models.Model.from_config(config['encoder_config'], custom_objects)
        decoder = keras.models.Model.from_config(config['decoder_config'], custom_objects)
        return cls(encoder=encoder, decoder=decoder)

# Load settings and model
save_dir = "vae_anomaly_detection"
settings_path = os.path.join(save_dir, "settings.json")
model_path = os.path.join(save_dir, "vae_model.keras")

# Load settings
with open(settings_path, 'r') as f:
    settings = json.load(f)

threshold = settings['threshold']
seq_length = settings['seq_length']
mean = settings['mean']
std = settings['std']

# Load the VAE model
vae = keras.models.load_model(model_path, custom_objects={'VAE': VAE, 'sampling': sampling})
print(f"Model loaded successfully from: {model_path}")

# Health check route
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "API is running", "model_loaded": True})

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'values' not in data:
            return jsonify({"error": "No 'values' key in request body"}), 400

        input_data = np.array(data['values'], dtype=np.float32)

        # Validate input length
        if len(input_data) < seq_length:
            return jsonify({"error": f"Input length must be at least {seq_length}"}), 400

        # Normalize input data
        input_data = (input_data - mean) / std

        # Create sequence
        sequence = input_data[-seq_length:].reshape(1, seq_length, 1)

        # Predict reconstruction
        reconstructed = vae.predict(sequence, verbose=0)
        mae = np.mean(np.abs(reconstructed - sequence), axis=(1, 2))[0]

        # Determine if anomaly
        is_anomaly = bool(mae > threshold)

        return jsonify({
            "reconstruction_error": float(mae),
            "is_anomaly": is_anomaly,
            "threshold": threshold
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Set your ngrok authtoken
    # NGROK_AUTH_TOKEN = os.environ.get('NGROK_AUTH_TOKEN')
    # conf.get_default().auth_token = NGROK_AUTH_TOKEN

    def run_flask():
        app.run(host='0.0.0.0', port=5100)

    # Start ngrok tunnel
    # public_url = ngrok.connect(5100)
    # print(f"Public URL: {public_url}")

    # Run Flask in a separate thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Keep the main thread alive
    while True:
        time.sleep(1)

