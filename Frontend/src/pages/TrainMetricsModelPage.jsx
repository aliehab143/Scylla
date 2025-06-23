import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Snackbar,
  Alert,
  CssBaseline
} from '@mui/material';
import SideMenu from '../components/DashboardsPageComponents/SideMenu';
import AppNavbar from '../components/DashboardsPageComponents/AppNavbar';
import Header from '../components/DashboardsPageComponents/Header';
import FileUploadSection from '../components/TrainModelComponents/FileUploadSection';
import HyperparametersSection from '../components/TrainModelComponents/HyperparametersSection';
import TrainingControlSection from '../components/TrainModelComponents/TrainingControlSection';
import TrainingResultsSection from '../components/TrainModelComponents/TrainingResultsSection';
import ModelManagementSection from '../components/TrainModelComponents/ModelManagementSection';

// API Base URL for metrics model training
const METRICS_MODEL_TRAIN_API = 'https://0359-35-237-96-188.ngrok-free.app';

export default function TrainMetricsModelPage() {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedModels, setTrainedModels] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('');
  const [trainingResults, setTrainingResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelDetailsDialog, setShowModelDetailsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // VAE Hyperparameters state (based on the backend DEFAULT_HYPERPARAMS)
  const [hyperparams, setHyperparams] = useState({
    seq_length: 100,
    latent_dim: 128,
    conv_filters_1: 32,
    conv_filters_2: 16,
    kernel_size: 7,
    batch_size: 128,
    epochs: 50,
    learning_rate: 0.001,
    validation_split: 0.1,
    threshold_multiplier: 2.0
  });

  // Load trained models on component mount
  useEffect(() => {
    loadTrainedModels();
  }, []);

  const loadTrainedModels = async () => {
    try {
      const response = await fetch(`${METRICS_MODEL_TRAIN_API}/list_models`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrainedModels(data.models || []);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      showSnackbar('CSV file selected successfully', 'success');
    } else {
      showSnackbar('Please select a valid CSV file', 'error');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      showSnackbar('CSV file dropped successfully', 'success');
    } else {
      showSnackbar('Please drop a valid CSV file', 'error');
    }
  };

  const handleHyperparamChange = (param, value) => {
    setHyperparams(prev => ({
      ...prev,
      [param]: parseFloat(value) || value
    }));
  };

  const startTraining = async () => {
    if (!selectedFile) {
      showSnackbar('Please select a training file first', 'error');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStatus('Preparing time series data...');

    try {
      const formData = new FormData();
      formData.append('training_file', selectedFile);
      formData.append('hyperparams', JSON.stringify(hyperparams));

      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      const response = await fetch(`${METRICS_MODEL_TRAIN_API}/train_model`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      clearInterval(progressInterval);
      setTrainingProgress(100);

      if (response.ok) {
        const results = await response.json();
        setTrainingResults(results);
        setShowResults(true);
        setTrainingStatus('VAE model trained successfully!');
        showSnackbar('VAE model trained successfully!', 'success');
        loadTrainedModels(); // Refresh model list
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Training failed');
      }
    } catch (error) {
      setTrainingStatus(`Training failed: ${error.message}`);
      showSnackbar(error.message, 'error');
    } finally {
      setIsTraining(false);
      setTimeout(() => {
        setTrainingProgress(0);
        setTrainingStatus('');
      }, 3000);
    }
  };

  const downloadModel = async (modelId) => {
    try {
      const response = await fetch(`${METRICS_MODEL_TRAIN_API}/download_model/${modelId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vae_model_${modelId}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSnackbar('Model downloaded successfully', 'success');
      }
    } catch (error) {
      showSnackbar('Error downloading model', 'error');
    }
  };

  const deleteModel = async (modelId) => {
    try {
      const response = await fetch(`${METRICS_MODEL_TRAIN_API}/delete_model/${modelId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.ok) {
        setTrainedModels(prev => prev.filter(model => model.model_id !== modelId));
        showSnackbar('Model deleted successfully', 'success');
      }
    } catch (error) {
      showSnackbar('Error deleting model', 'error');
    }
  };

  const handleShowModelDetails = (model) => {
    setSelectedModel(model);
    setShowModelDetailsDialog(true);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            position: "relative",
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 25% 25%, #667eea20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f093fb20 0%, transparent 50%)'
                : 'radial-gradient(circle at 25% 25%, #667eea10 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f093fb10 0%, transparent 50%)',
              opacity: 0.7,
              zIndex: 0,
            })}
          />

          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Header />

            {/* Page Header */}
            <Box sx={{ mb: 4, width: "100%", maxWidth: "1200px" }}>
              <Typography variant="h4" gutterBottom sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}>
                Train Metrics Model
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Train VAE models for anomaly detection in time series metrics data
              </Typography>
            </Box>

            <Box sx={{ width: "100%", maxWidth: "1200px" }}>
              <Grid container spacing={3}>
                {/* File Upload Section */}
                <Grid item xs={12} md={6}>
                  <FileUploadSection
                    selectedFile={selectedFile}
                    isDragActive={isDragActive}
                    onFileSelect={handleFileSelect}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    title="Upload Time Series Data"
                    description="CSV file with columns: timestamp, value (or similar)"
                    acceptedFileTypes=".csv"
                  />
                </Grid>

                {/* Hyperparameters Section */}
                <Grid item xs={12} md={6}>
                  <HyperparametersSection
                    hyperparams={hyperparams}
                    onHyperparamChange={handleHyperparamChange}
                    parameterConfig={[
                      { key: 'seq_length', label: 'Sequence Length', type: 'number' },
                      { key: 'latent_dim', label: 'Latent Dimension', type: 'number' },
                      { key: 'conv_filters_1', label: 'Conv Filters 1', type: 'number' },
                      { key: 'conv_filters_2', label: 'Conv Filters 2', type: 'number' },
                      { key: 'kernel_size', label: 'Kernel Size', type: 'number' },
                      { key: 'batch_size', label: 'Batch Size', type: 'number' },
                      { key: 'epochs', label: 'Epochs', type: 'number' },
                      { key: 'learning_rate', label: 'Learning Rate', type: 'number', step: '0.0001' },
                      { key: 'validation_split', label: 'Validation Split', type: 'number', step: '0.01' },
                      { key: 'threshold_multiplier', label: 'Threshold Multiplier', type: 'number', step: '0.1' }
                    ]}
                  />
                </Grid>

                {/* Training Control */}
                <Grid item xs={12}>
                  <TrainingControlSection
                    isTraining={isTraining}
                    onStartTraining={startTraining}
                    selectedFile={selectedFile}
                    trainingProgress={trainingProgress}
                    trainingStatus={trainingStatus}
                    buttonText="Start VAE Training"
                    trainingButtonText="Training VAE..."
                  />
                </Grid>

                {/* Training Results */}
                <Grid item xs={12}>
                  <TrainingResultsSection
                    trainingResults={trainingResults}
                    showResults={showResults}
                    metricsConfig={[
                      { key: 'threshold', label: 'Anomaly Threshold', formatter: (val) => val?.toFixed(6) },
                      { key: 'training_sequences', label: 'Training Sequences', formatter: (val) => val },
                      { key: 'sequence_length', label: 'Sequence Length', formatter: (val) => val },
                      { key: 'training_data_rows', label: 'Data Rows', formatter: (val) => val }
                    ]}
                  />
                </Grid>

                {/* Trained Models List */}
                <Grid item xs={12}>
                  <ModelManagementSection
                    trainedModels={trainedModels}
                    onDownloadModel={downloadModel}
                    onDeleteModel={deleteModel}
                    onShowModelDetails={handleShowModelDetails}
                    selectedModel={selectedModel}
                    showModelDetails={showModelDetailsDialog}
                    onCloseModelDetails={() => setShowModelDetailsDialog(false)}
                    title="Trained VAE Models"
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
} 