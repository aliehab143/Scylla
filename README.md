# Scylla - AI-Powered AIOps Platform

<div align="center">
  <img src="Frontend/public/siteLogo.png" alt="Scylla Logo" width="120" height="120"><br>
  <h1>Scylla</h1>
  <em>AI-Powered AIOps Platform for Intelligent Monitoring & Anomaly Detection</em>
  <br><br>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-4.x-black?logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Prometheus-integrated-E6522C?logo=prometheus&logoColor=white" alt="Prometheus">
    <img src="https://img.shields.io/badge/Loki-integrated-0A1A2F?logo=grafana&logoColor=white" alt="Loki">
  </p>
</div>

Scylla is an advanced AI-powered AIOps (Artificial Intelligence for IT Operations) platform designed to provide intelligent monitoring, anomaly detection, and operational insights for modern IT infrastructure. Built with cutting-edge machine learning models and real-time data processing capabilities, Scylla helps organizations proactively identify and resolve operational issues before they impact business operations.

## 🎥 Demo

<div align="center">
  <a href="https://youtu.be/DoqCr0kBt-s">
    <img src="https://img.shields.io/badge/📺_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo">
  </a>
  <br>
  <em>🎬 Click above to watch the complete Scylla platform demonstration</em>
</div>

---

## 📋 Table of Contents

- [🚀 Features](#-features)
  - [🤖 Real-time Anomaly Detection](#-real-time-anomaly-detection)
  - [📊 Interactive Dashboards](#-interactive-dashboards)
  - [🔔 Automated Response with n8n Workflows](#-automated-response-with-n8n-workflows)
  - [🔗 Time-based Data Correlation](#-time-based-data-correlation)
  - [🧠 Model Training](#-model-training)
- [🏗️ Architecture](#️-architecture)
- [🐳 Docker Deployment](#-docker-deployment)
- [🛠️ Development Setup](#️-development-setup)

## 🚀 Features

### 🤖 **Real-time Anomaly Detection**

#### **📊 Metrics Anomaly Detection with Prometheus**
- **VAE-CNN Models**: Convolutional neural networks for real-time metric analysis
  - CPU utilization pattern recognition
  - Memory usage anomaly detection
  - Network traffic pattern analysis
  - Disk I/O anomaly identification
- **Prometheus Integration**: Direct integration for real-time metrics collection
  - Custom metric queries and aggregations
  - Sub-minute detection latency
  - Historical data analysis and trending
- **Real-time Processing**: Continuous monitoring with instant anomaly alerts

#### **📝 Logs Anomaly Detection with Loki**
- **VAE-LSTM Models**: Deep learning-based log sequence analysis for security monitoring
  - Natural language processing for log message understanding
  - Sequence pattern recognition for log flows
  - Security incident detection in audit logs
  - Suspicious user behavior identification
- **Loki Integration**: Centralized log aggregation and real-time analysis
  - Application logs, system logs, and security logs
  - Log parsing and structured data extraction
  - Real-time stream processing with immediate alerting

### 📊 **Interactive Dashboards**
- **Real-time Visualizations**: Live data streaming with automatic refresh
  - Line charts for time-series data trends
  - Heat maps for correlation analysis
  - Anomaly highlighting and visualization
- **Multi-source Views**: Unified dashboard for Prometheus metrics and Loki logs
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: User preference-based theme switching

### 🔔 **Automated Response with n8n Workflows**
- **n8n Agentic Workflow Integration**: Advanced workflow automation for security responses
  - Automated suspicious user account suspension
  - Real-time threat response workflows
  - Security incident containment procedures
  - Adaptive response based on anomaly severity
- **Intelligent Decision Making**: AI-powered workflow triggers
  - Behavioral pattern analysis for user suspension decisions
  - Risk assessment and automated response escalation
  - Complete audit trail of automated security actions

### 🔗 **Time-based Data Correlation**
- **Cross-source Time Correlation**: Advanced time-series correlation between data sources
  - Prometheus metrics to Loki logs correlation
  - Time-window based event correlation
  - Anomaly pattern correlation across different time ranges
  - Performance impact analysis across service dependencies
- **Temporal Pattern Recognition**: Time-based pattern identification
  - Seasonal pattern detection in metrics and logs
  - Time-shifted correlation analysis
  - Predictive correlation for proactive monitoring

### 🧠 **Model Training**
- **Custom Model Training**: Train your own anomaly detection models
  - VAE-LSTM training for custom log patterns
  - VAE-CNN training for specific metric patterns
  - Automated model retraining on new data patterns
- **Model Management**: Complete model lifecycle management
  - Model versioning and deployment
  - Performance monitoring and evaluation
  - Hyperparameter optimization
  - Transfer learning capabilities

## 🏗️ Architecture

### **Frontend (React + Vite)**
- Modern React application with Material-UI components
- Real-time data visualization with Chart.js
- Responsive design for desktop and mobile
- Progressive Web App capabilities

### **Backend (Node.js + Express)**
- RESTful API with Express.js framework
- MongoDB for data persistence
- Real-time data processing with background workers


### **AI/ML Models**
- **VAE-LSTM**: Variational Autoencoder with LSTM for sequential log data
- **VAE-CNN**: Variational Autoencoder with CNN for metric time series

- **Model Serving**: FastAPI/Flask microservices for model inference

### **Automation & Workflows**
- **n8n Integration**: Agentic workflow automation platform
- **Security Response Automation**: Automated user suspension workflows
- **Real-time Decision Making**: AI-powered workflow triggers

### **Data Sources**
- **Prometheus**: Real-time metrics collection and querying
- **Loki**: Centralized log aggregation and search
- **CSV Upload**: Custom data source support

## 🐳 Docker Deployment

Scylla is fully containerized for easy deployment and scaling.

### **Quick Start with Docker**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Scylla
   ```

2. **Build and run the Backend**
   ```bash
   cd Backend
   docker build -t scylla-backend .
   docker run -p 8001:8001 --env-file .env scylla-backend
   ```

3. **Build and run the Frontend**
   ```bash
   cd Frontend
   docker build -t scylla-frontend .
   docker run -p 3000:80 scylla-frontend
   ```

### **Docker Compose (Recommended)**

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'
services:
  backend:
    build: ./Backend
    ports:
      - "8001:8001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/scylla
    depends_on:
      - mongo
    volumes:
      - ./Backend/uploads:/app/uploads
      - ./Backend/logs:/app/logs

  frontend:
    build: ./Frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up -d
```

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ 
- MongoDB
- Python 3.8+ (for ML models)
- Docker & Docker Compose

### **Backend Setup**
```bash
cd Backend
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

### **Frontend Setup**
```bash
cd Frontend
npm install
npm run dev
```

### **Environment Variables**
Create a `.env` file in the Backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/scylla
JWT_SECRET=your-jwt-secret
PROMETHEUS_URL=http://localhost:9090
LOKI_URL=http://localhost:3100
INFLUXDB_URL=http://localhost:8086
EMAIL_SERVICE_API_KEY=your-email-api-key
GPT_API_KEY=your-openai-api-key
N8N_WEBHOOK_URL=your-n8n-webhook-url
```

---

**Scylla** - AI-Powered Security & Anomaly Detection with Intelligent Automation 🚀

*Empowering IT Operations with Real-time Anomaly Detection, Automated Response, and Intelligent Data Correlation*

