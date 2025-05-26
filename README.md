# Scylla - AI-Powered AIOps Platform

<div align="center">
  <img src="Frontend/public/siteLogo.png" alt="Scylla Logo" width="300" height="300">
</div>

Scylla is an advanced AI-powered AIOps (Artificial Intelligence for IT Operations) platform designed to provide intelligent monitoring, anomaly detection, and operational insights for modern IT infrastructure. Built with cutting-edge machine learning models and real-time data processing capabilities, Scylla helps organizations proactively identify and resolve operational issues before they impact business operations.

## 🚀 Features

### 🔍 **Multi-Source Data Integration**
- **Prometheus Integration**: Real-time metrics collection and monitoring
- **Loki Integration**: Centralized log aggregation and analysis
- **CSV Data Sources**: Custom data upload and analysis capabilities
- **Unified Dashboard**: Single pane of glass for all data sources

### 🤖 **Advanced Anomaly Detection**
- **VAE-LSTM Models**: Deep learning-based log anomaly detection
- **VAE-CNN Models**: Convolutional neural networks for metric anomaly detection
- **Real-time Processing**: Continuous monitoring with instant anomaly alerts

### 📊 **Intelligent Dashboards**
- **Interactive Visualizations**: Line charts, bar charts, and data tables
- **Real-time Updates**: Live data streaming and visualization
- **Custom Views**: Tailored dashboards for different data sources
- **Data Correlation**: Cross-source analysis and pattern identification

### 🔔 **Smart Alerting & Notifications**
- **Email Notifications**: Automated alerts for detected anomalies
- **Real-time Monitoring**: Continuous background processing
- **GPT-Powered Insights**: AI-generated best practices and recommendations
- **Workflow Management**: Structured response workflows for incidents



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

### **Data Sources**
- **Prometheus**: Metrics collection and querying
- **Loki**: Log aggregation and search
- **InfluxDB**: Time-series data storage
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
```

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /user/login` - User authentication
- `POST /user/signup` - User registration
- `GET /user/profile` - Get user profile

### **Data Source Endpoints**
- `GET /datasource` - List all data sources
- `POST /datasource` - Create new data source
- `PUT /datasource/:id` - Update data source
- `DELETE /datasource/:id` - Delete data source

### **Dashboard Endpoints**
- `GET /dashboard` - Get dashboard data
- `POST /render-panel` - Render dashboard panels

### **Anomaly Detection Endpoints**
- `POST /model/detect-logs` - Log anomaly detection
- `POST /model/detect-metrics` - Metric anomaly detection
- `POST /model/detect-csv` - CSV data anomaly detection

### **Workflow & Correlation**
- `GET /workflow` - Get user workflows
- `POST /datacorrelation` - Correlate data sources

## 🔧 Configuration

### **Model Configuration**
- VAE-LSTM: Configured for log sequence analysis
- VAE-CNN: Optimized for time-series metric data
- Hyperparameters: Tuned for optimal performance

### **Monitoring Configuration**
- Real-time processing: 30-second intervals
- Alert thresholds: Configurable per data source
- Email notifications: SMTP configuration required

---

**Scylla** - Empowering IT Operations with Artificial Intelligence 🚀