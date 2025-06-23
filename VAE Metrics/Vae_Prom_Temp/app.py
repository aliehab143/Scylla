import flask
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import pytorch_lightning as pl
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
from datetime import datetime
import numpy as np
from argparse import Namespace
import numpy as np
import pandas as pd
from pathlib import Path
from collections import OrderedDict
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as pl


# Initialize Flask app
app = Flask(__name__)

# Load the trained VAE model
hparams = {
    'run': 'embsz16_latsz16_bsz128_lay64-128-256-128-64_ep100_cosineWR_v1',
    'cont_vars': ['value', 'hour_min', 'gap_holiday', 't'],
    'cat_vars': ['day_of_week', 'holiday'],
    'embedding_sizes': [(7, 16), (2, 16)],  # 7 for day_of_week (0-6), 2 for holiday (0 or 1)
    'latent_dim': 16,
    'layer_sizes': '64,128,256,128,64',
    'batch_norm': True,
    'stdev': 0.1,
    'kld_beta': 0.05,
    'lr': 0.001,
    'weight_decay': 1e-5,
    'batch_size': 128,
    'epochs': 60,
}

# Define the VAE class (same as in your code)
class Layer(nn.Module):
    def __init__(self, in_dim, out_dim, bn=True):
        super().__init__()
        layers = [nn.Linear(in_dim, out_dim)]
        if bn:
            layers.append(nn.BatchNorm1d(out_dim))
        layers.append(nn.LeakyReLU(0.1, inplace=True))
        self.block = nn.Sequential(*layers)

    def forward(self, x):
        return self.block(x)

class Encoder(nn.Module):
    def __init__(self, **hparams):
        super().__init__()
        self.hparams = Namespace(**hparams)
        self.embeds = nn.ModuleList([
            nn.Embedding(n_cats, emb_size) for (n_cats, emb_size) in self.hparams.embedding_sizes
        ])
        in_dim = sum(emb.embedding_dim for emb in self.embeds) + len(self.hparams.cont_vars)
        layer_dims = [in_dim] + [int(s) for s in self.hparams.layer_sizes.split(',')]
        bn = self.hparams.batch_norm
        self.layers = nn.Sequential(
            *[Layer(layer_dims[i], layer_dims[i + 1], bn) for i in range(len(layer_dims) - 1)],
        )
        self.mu = nn.Linear(layer_dims[-1], self.hparams.latent_dim)
        self.logvar = nn.Linear(layer_dims[-1], self.hparams.latent_dim)

    def forward(self, x_cont, x_cat):
        x_embed = [e(x_cat[:, i]) for i, e in enumerate(self.embeds)]
        x_embed = torch.cat(x_embed, dim=1)
        x = torch.cat((x_embed, x_cont), dim=1)
        h = self.layers(x)
        mu_ = self.mu(h)
        logvar_ = self.logvar(h)
        return mu_, logvar_, x

class Decoder(nn.Module):
    def __init__(self, **hparams):
        super().__init__()
        self.hparams = Namespace(**hparams)
        hidden_dims = [self.hparams.latent_dim] + [int(s) for s in reversed(self.hparams.layer_sizes.split(','))]
        out_dim = sum(emb_size for _, emb_size in self.hparams.embedding_sizes) + len(self.hparams.cont_vars)
        bn = self.hparams.batch_norm
        self.layers = nn.Sequential(
            *[Layer(hidden_dims[i], hidden_dims[i + 1], bn) for i in range(len(hidden_dims) - 1)],
        )
        self.reconstructed = nn.Linear(hidden_dims[-1], out_dim)

    def forward(self, z):
        h = self.layers(z)
        recon = self.reconstructed(h)
        return recon

class VAE(pl.LightningModule):
    def __init__(self, **hparams):
        super().__init__()
        self.save_hyperparameters()
        self.encoder = Encoder(**hparams)
        self.decoder = Decoder(**hparams)

    def reparameterize(self, mu, logvar):
        if self.training:
            std = torch.exp(0.5 * logvar)
            eps = torch.randn_like(std) * self.hparams.stdev
            return eps * std + mu
        else:
            return mu

    def forward(self, batch):
        x_cont, x_cat = batch
        assert x_cat.dtype == torch.int64
        mu, logvar, x = self.encoder(x_cont, x_cat)
        z = self.reparameterize(mu, logvar)
        recon = self.decoder(z)
        return recon, mu, logvar, x

    def loss_function(self, obs, recon, mu, logvar):
        recon_loss = F.smooth_l1_loss(recon, obs, reduction='mean')
        kld = -0.5 * torch.mean(1 + logvar - mu ** 2 - logvar.exp())
        return recon_loss, kld

# Load the trained model
model = VAE(**hparams)
model = VAE.load_from_checkpoint('vae_weights.ckpt')
model.eval()
model.freeze()

# Load the scaler and label encoders
scaler = joblib.load('scaler.pkl')
label_encoders = {
    'day_of_week': joblib.load('label_encoder_day_of_week.pkl'),
    'holiday': joblib.load('label_encoder_holiday.pkl')
}

# Define the API endpoint
@app.route('/detect_anomalies', methods=['POST'])
def detect_anomalies():
    try:
        # Get the JSON input
        input_data = request.get_json()
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert input JSON to DataFrame
        df = pd.DataFrame(input_data)
        df['timestamp'] = pd.to_datetime(df['time'])

        # Feature engineering (same as in your code)
        df['day'] = df['timestamp'].dt.day
        df['month'] = df['timestamp'].dt.month
        df['hour_min'] = df['timestamp'].dt.hour + df['timestamp'].dt.minute / 60
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['holiday'] = 0
        df.loc[(df['day'] == 25) & (df['month'] == 12), 'holiday'] = 1  # Christmas
        df.loc[(df['day'] == 1) & (df['month'] == 1), 'holiday'] = 1   # New Year's Day

        # Compute gap_holiday
        holidays = df.loc[df['holiday'] == 1, 'timestamp'].dt.date.unique()
        if len(holidays) == 0:
            # If no holidays, set gap_holiday to a large value (e.g., 365 days)
            df['gap_holiday'] = 365
        else:
            for i, hd in enumerate(holidays):
                df[f'hol_{i}'] = (df['timestamp'].dt.date - hd).apply(lambda x: x.days)
            if len(holidays) == 1:
                df['gap_holiday'] = df['hol_0']
                df.drop(['hol_0'], axis=1, inplace=True)
            else:
                df['gap_holiday'] = df[['hol_0', 'hol_1']].abs().min(axis=1)
                df.drop(['hol_0', 'hol_1'], axis=1, inplace=True)

        # Compute t
        df['t'] = (df['timestamp'].astype(np.int64) / 1e11).astype(np.int64)

        # Drop timestamp
        df_processed = df.drop('timestamp', axis=1)

        # Encode categorical variables
        cat_vars = ['day_of_week', 'holiday']
        for col in cat_vars:
            df_processed[col] = label_encoders[col].transform(df_processed[col])

        # Scale continuous variables
        cont_vars = ['value', 'hour_min', 'gap_holiday', 't']
        df_scaled = df_processed.copy()
        df_scaled[cont_vars] = scaler.transform(df_processed[cont_vars])

        # Prepare data for the model
        cont_data = df_scaled[cont_vars].to_numpy(dtype=np.float32)
        cat_data = df_scaled[cat_vars].to_numpy(dtype=np.int64)

        # Compute losses using the VAE model
        losses = []
        for i in range(len(cont_data)):
            x_cont = torch.tensor(cont_data[i], dtype=torch.float32).unsqueeze(0)
            x_cat = torch.tensor(cat_data[i], dtype=torch.int64).unsqueeze(0)
            recon, mu, logvar, x = model((x_cont, x_cat))
            recon_loss, kld = model.loss_function(x, recon, mu, logvar)
            loss = recon_loss + model.hparams.kld_beta * kld
            losses.append(loss.item())

        # Add losses to the DataFrame
        df['loss'] = losses

        # Determine anomalies using the 99.9th percentile threshold
        thresh = np.quantile(losses, 0.999)
        df['anomaly'] = (df['loss'] > thresh).astype(int)

        # Prepare the output
        output = df[['anomaly', 'time', 'value']].to_dict(orient='records')

        return jsonify(output), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5005,debug=True)