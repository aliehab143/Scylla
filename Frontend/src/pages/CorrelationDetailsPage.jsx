import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TimelineIcon from "@mui/icons-material/Timeline";
import ViewListIcon from "@mui/icons-material/ViewList";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { DataGrid } from "@mui/x-data-grid";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Styled DataGrid
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-main': {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(51, 65, 85, 0.6)'
      : 'rgba(248, 250, 252, 0.8)',
    borderBottom: `2px solid ${theme.palette.divider}`,
    fontSize: '0.95rem',
    fontWeight: 600,
    minHeight: '56px !important',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  '& .MuiDataGrid-row': {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(102, 126, 234, 0.08)'
        : 'rgba(102, 126, 234, 0.04)',
    },
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(51, 65, 85, 0.4)'
      : 'rgba(248, 250, 252, 0.6)',
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};



export default function CorrelationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  // State for correlation details
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Query and chart state
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState("http_requests_total");
  const [prometheusData, setPrometheusData] = useState([]);
  const [lokiLogs, setLokiLogs] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [modelPrediction, setModelPrediction] = useState(null);

  // Time controls - Set to specific date and time range
  const [startTime, setStartTime] = useState("2025-06-18 20:30:00");
  const [endTime, setEndTime] = useState("2025-06-18 20:35:00");
  const [streaming, setStreaming] = useState(false);
  const [dataError, setDataError] = useState("");
  
  const lastEndTime = useRef(Math.floor(new Date().getTime() / 1000));

  // Fetch correlation details on load
  useEffect(() => {
    const fetchCorrelationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/datacorrelation/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.correlation) {
          setCorrelation(result.correlation);
          
          // Fetch Prometheus queries if there's a Prometheus data source
          const prometheusSource = result.correlation.datasources.find(ds => ds.type === 'prometheus');
          if (prometheusSource) {
            await fetchPrometheusQueries();
            // Auto-fetch data after queries are loaded
            setTimeout(() => {
              console.log("🚀 Auto-fetching correlation data with http_requests_total query...");
              fetchCorrelationData();
            }, 1000); // Small delay to ensure query is set
          }
        }
      } catch (err) {
        console.error("Error fetching correlation details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) {
      fetchCorrelationDetails();
    }
  }, [id, user?.token]);

  // Fetch Prometheus queries
  const fetchPrometheusQueries = async () => {
    try {
      const queryEndpoint = `${BASE_URL}/datasource/prometheus/queries/correlation/${id}`;
      console.log("🔍 Fetching Prometheus queries from:", queryEndpoint);
      
      const response = await fetch(queryEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("📡 Prometheus queries response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Prometheus queries error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
      }

      // Get response text first for logging
      const responseText = await response.text();
      console.log("📄 Raw Prometheus queries response text:");
      console.log("=====================================");
      console.log(responseText);
      console.log("=====================================");

      // Parse the JSON
      const result = JSON.parse(responseText);
      console.log("✅ FULL PROMETHEUS QUERIES RESPONSE:");
      console.log("=====================================");
      console.log(JSON.stringify(result, null, 2));
      console.log("=====================================");
      
      console.log("📊 Prometheus Queries Response Analysis:");
      console.log("- Response type:", typeof result);
      console.log("- Is array:", Array.isArray(result));
      console.log("- Has data property:", !!result.data);
      console.log("- Data is array:", Array.isArray(result.data));
      console.log("- Response keys:", Object.keys(result || {}));
      
      if (result.data) {
        console.log("- Data length:", result.data.length);
        console.log("- First 3 queries:", result.data.slice(0, 3));
      } else if (Array.isArray(result)) {
        console.log("- Direct array length:", result.length);
        console.log("- First 3 queries:", result.slice(0, 3));
      }
      
      if (result.data && Array.isArray(result.data)) {
        console.log("📋 Setting queries:", result.data.length, "queries found");
        setQueries(result.data);
        // Look for http_requests_total query first, then fallback to first query
        const httpRequestsQuery = result.data.find(query => query.includes("http_requests_total"));
        if (httpRequestsQuery) {
          setSelectedQuery(httpRequestsQuery);
          console.log("🎯 Selected http_requests_total query:", httpRequestsQuery);
        } else if (result.data.length > 0) {
          setSelectedQuery(result.data[0]);
          console.log("🎯 Selected default query:", result.data[0]);
        }
      } else if (Array.isArray(result)) {
        // In case the response is directly an array
        console.log("📋 Setting queries (direct array):", result.length, "queries found");
        setQueries(result);
        // Look for http_requests_total query first, then fallback to first query
        const httpRequestsQuery = result.find(query => query.includes("http_requests_total"));
        if (httpRequestsQuery) {
          setSelectedQuery(httpRequestsQuery);
          console.log("🎯 Selected http_requests_total query:", httpRequestsQuery);
        } else if (result.length > 0) {
          setSelectedQuery(result[0]);
          console.log("🎯 Selected default query:", result[0]);
        }
      } else {
        console.warn("⚠️ Unexpected queries response format:", result);
        // Fallback to default queries
        const defaultQueries = [
          "http_requests_total",
          "prometheus_http_requests_total",
          "up",
          "prometheus_build_info",
          "prometheus_config_last_reload_successful"
        ];
        setQueries(defaultQueries);
        setSelectedQuery("http_requests_total");
        console.log("🔄 Using fallback default queries with http_requests_total");
      }
    } catch (err) {
      console.error("💥 Error fetching Prometheus queries:", err);
      // Fallback to default queries on error
      const defaultQueries = [
        "http_requests_total",
        "prometheus_http_requests_total",
        "up",
        "prometheus_build_info",
        "prometheus_config_last_reload_successful"
      ];
      setQueries(defaultQueries);
      setSelectedQuery("http_requests_total");
      console.log("🔄 Using fallback default queries with http_requests_total due to error");
    }
  };

  // Fetch correlation data with query
  const fetchCorrelationData = async () => {
    if (!selectedQuery || !correlation) {
      setDataError("Please select a query.");
      return;
    }

    try {
      console.log("🚀 Starting fetchCorrelationData...");
      console.log("📊 Selected query:", selectedQuery);
      console.log("📅 Start time:", startTime);
      console.log("📅 End time:", endTime);
      
      const now = new Date();
      let actualStartTime, actualEndTime;

      if (streaming) {
        actualEndTime = Math.floor(now.getTime() / 1000);
        actualStartTime = actualEndTime - 15; // Last 15 seconds for streaming
        lastEndTime.current = actualEndTime;
        console.log("📅 Streaming window: Last 15 seconds until now");
        console.log("📅 From:", new Date(actualStartTime * 1000).toISOString());
        console.log("📅 To:", new Date(actualEndTime * 1000).toISOString());
      } else {
        console.log("📅 Raw startTime string:", startTime);
        console.log("📅 Raw endTime string:", endTime);
        console.log("📅 Parsed startTime date:", new Date(startTime));
        console.log("📅 Parsed endTime date:", new Date(endTime));
        
        actualStartTime = Math.floor(new Date(startTime).getTime() / 1000);
        actualEndTime = Math.floor(new Date(endTime).getTime() / 1000);
      }

      // Log Unix timestamps before sending
      console.log("⏰ UNIX TIMESTAMPS BEFORE SEND:");
      console.log("Start Unix Time:", actualStartTime);
      console.log("End Unix Time:", actualEndTime);
      console.log("Time Range:", `${actualEndTime - actualStartTime} seconds (${(actualEndTime - actualStartTime) / 60} minutes)`);

      const queryParams = new URLSearchParams({
        start: actualStartTime.toString(),
        end: actualEndTime.toString(),
        query: selectedQuery
      });

      const url = `${BASE_URL}/datacorrelation/${id}?${queryParams}`;
      console.log("📡 Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ FULL CORRELATION RESPONSE:");
      console.log("=====================================");
      console.log(JSON.stringify(result, null, 2));
      console.log("=====================================");
      
      console.log("📊 Response Structure Analysis:");
      console.log("- Has correlation:", !!result.correlation);
      console.log("- Has results array:", !!result.results && Array.isArray(result.results));
      console.log("- Results length:", result.results?.length || 0);
      
      if (result.results) {
        result.results.forEach((item, index) => {
          console.log(`- Result ${index}:`, {
            hasLogs: item.logs !== undefined,
            logsCount: item.logs?.length || 0,
            hasData: !!item.data,
            hasDataData: !!(item.data && item.data.data),
            dataLength: item.data?.data?.length || 0,
            hasModelPrediction: !!(item.data && item.data.modelPrediction),
            modelPrediction: item.data?.modelPrediction
          });
        });
      }

      // Parse results array
      if (result.results && Array.isArray(result.results)) {
        // Find logs (first item with logs property)
        const logsResult = result.results.find(item => item.logs !== undefined);
        if (logsResult) {
          console.log("📋 Setting Loki logs:", logsResult.logs?.length || 0, "entries");
          setLokiLogs(logsResult.logs || []);
        } else {
          console.log("❌ No logs result found in response");
        }

        // Find prometheus data (item with data.data property)
        const prometheusResult = result.results.find(item => item.data && item.data.data);
        if (prometheusResult) {
          console.log("📈 Setting Prometheus data:", prometheusResult.data.data?.length || 0, "data points");
          console.log("📈 Prometheus data sample:", prometheusResult.data.data?.slice(0, 3));
          
          // Process data with anomaly detection for each point
          const newPrometheusData = (prometheusResult.data.data || []).map(item => ({
            ...item,
            anomaly: prometheusResult.data.modelPrediction?.is_anomaly ? 1 : 0
          }));
          
          // Handle data differently for streaming vs non-streaming
          if (streaming) {
            // In streaming mode, filter out duplicates based on timestamp
            setPrometheusData((prevData) => {
              const existingTimestamps = new Set(prevData.map(item => item.timestamp));
              const newUniqueData = newPrometheusData.filter(item => !existingTimestamps.has(item.timestamp));
              const anomaliesInNew = newUniqueData.filter(item => item.anomaly === 1).length;
              console.log(`🔄 Streaming (last 15sec): ${prevData.length} existing points, ${newPrometheusData.length} new points, ${newUniqueData.length} unique new points`);
              if (anomaliesInNew > 0) {
                console.log(`🚨 ANOMALY DETECTED: ${anomaliesInNew} anomalous points in new data!`);
              }
              return [...prevData, ...newUniqueData];
            });
          } else {
            // Replace data for non-streaming mode to prevent duplication
            console.log(`📊 Non-streaming: Replacing ${newPrometheusData.length} data points`);
            setPrometheusData(newPrometheusData);
          }
          
          // Check for model prediction
          if (prometheusResult.data.modelPrediction) {
            console.log("🤖 Model prediction found:", prometheusResult.data.modelPrediction);
            setModelPrediction(prometheusResult.data.modelPrediction);
          } else {
            console.log("❌ No model prediction in Prometheus result");
          }
        } else {
          console.log("❌ No Prometheus result found in response");
        }
      } else {
        console.log("❌ No results array found in response");
      }

      setDataError("");
    } catch (err) {
      console.error("💥 Error fetching correlation data:", err);
      setDataError(err.message);
    }
  };

  // Auto-refresh for streaming - every 15 seconds
  useEffect(() => {
    let interval;
    if (streaming) {
      interval = setInterval(() => {
        fetchCorrelationData();
      }, 15000); // Refresh every 15 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streaming, selectedQuery]);

  // Manual data fetch when query or time changes
  useEffect(() => {
    if (selectedQuery && correlation) {
      fetchCorrelationData();
    }
  }, [selectedQuery]);

  const resetTimeRange = () => {
    // Reset to the specific time range for demo purposes
    setStartTime("2025-06-18 20:30:00");
    setEndTime("2025-06-18 20:35:00");
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const toggleStreaming = () => {
    setStreaming(prev => !prev);
    if (!streaming) {
      resetTimeRange();
      // Clear data when starting streaming mode
      setPrometheusData([]);
      setLokiLogs([]);
    }
  };

  // Get datasource info
  const prometheusSource = correlation?.datasources?.find(ds => ds.type === 'prometheus');
  const lokiSource = correlation?.datasources?.find(ds => ds.type === 'loki');

  // Enhanced anomaly detection - check for anomalies in recent data
  const isAnomalous = prometheusData.length > 0 && (
    streaming 
      ? prometheusData.slice(-5).some(point => point.anomaly === 1) // Check last 5 points in streaming
      : prometheusData.some(point => point.anomaly === 1) // Check any point in non-streaming
  );

  // Prepare chart data with individual point/bar coloring
  const chartData = {
    labels: prometheusData.map(item => 
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [{
      label: selectedQuery,
      data: prometheusData.map(item => parseFloat(item.value)),
      backgroundColor: chartType === 'bar' 
        ? prometheusData.map(point => point.anomaly === 1 ? 'rgba(244, 67, 54, 0.8)' : 'rgba(102, 126, 234, 0.8)')
        : (context) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) return null;
            
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            if (isAnomalous) {
              gradient.addColorStop(0, "rgba(244, 67, 54, 0.3)");
              gradient.addColorStop(1, "rgba(244, 67, 54, 0.05)");
            } else {
              gradient.addColorStop(0, "rgba(102, 126, 234, 0.3)");
              gradient.addColorStop(1, "rgba(102, 126, 234, 0.05)");
            }
            return gradient;
          },
      borderColor: chartType === 'bar' 
        ? prometheusData.map(point => point.anomaly === 1 ? '#f44336' : '#667eea')
        : (isAnomalous ? '#f44336' : '#667eea'),
      borderWidth: chartType === 'bar' 
        ? prometheusData.map(point => point.anomaly === 1 ? 3 : 2)
        : 3,
      fill: chartType === "line",
      tension: 0.3,
      pointBackgroundColor: prometheusData.map(point => point.anomaly === 1 ? '#f44336' : '#667eea'),
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: prometheusData.map(point => point.anomaly === 1 ? 6 : 4), // Larger points for anomalies
      pointHoverRadius: 8,
      pointHoverBackgroundColor: prometheusData.map(point => point.anomaly === 1 ? '#f44336' : '#667eea'),
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 14,
            family: "Inter, Arial, sans-serif",
            weight: '600',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            const point = prometheusData[index];
            return new Date(point.timestamp).toLocaleString();
          },
          label: (context) => {
            const value = context.parsed.y;
            const isAnomaly = prometheusData[context.dataIndex]?.anomaly === 1;
            return [
              `Value: ${value.toFixed(2)}`,
              `Status: ${isAnomaly ? '🚨 Anomaly Detected' : '✅ Normal'}`
            ];
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            family: "Inter, Arial, sans-serif",
          },
          maxTicksLimit: 8,
        },
        title: {
          display: true,
          text: 'Time',
          color: '#374151',
          font: {
            size: 14,
            weight: '600',
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            family: "Inter, Arial, sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Value',
          color: '#374151',
          font: {
            size: 14,
            weight: '600',
          },
        },
        beginAtZero: true,
      },
    },
  };

  // Prepare logs data
  const logColumns = [
    { 
      field: 'count', 
      headerName: 'Count', 
      width: 80,
      align: 'center',
      headerAlign: 'center',
      resizable: false
    },
    { 
      field: 'uid', 
      headerName: 'UID', 
      width: 350,
      align: 'left',
      resizable: false
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 180,
      align: 'left',
      resizable: false
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      align: 'left',
      resizable: false
    },
    { 
      field: 'time', 
      headerName: 'Time', 
      width: 140,
      align: 'left',
      resizable: false
    },
  ];

  const logRows = lokiLogs.map((log, index) => {
    // Split timestamp into date and time
    const timestampStr = log.timestamp || '';
    let date = '', time = '';
    
    if (timestampStr.includes(' ') && timestampStr.includes(',')) {
      // Format: "2025-06-18 22:35:04,189"
      const [datePart, timePart] = timestampStr.split(' ');
      date = datePart || '';
      // Remove milliseconds (,189) from time
      time = timePart ? timePart.split(',')[0] : '';
    } else {
      // Fallback if format is different
      date = timestampStr;
      time = '';
    }

    return {
      id: index + 1,
      count: index + 1,
      uid: log.uid || '',
      type: log.type || '',
      date: date,
      time: time,
    };
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography variant="h6" color="text.secondary">
          Loading correlation details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideMenu />
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
          <AppNavbar />
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
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: 4,
                borderRadius: 3,
                background: (theme) => theme.palette.mode === 'dark'
                  ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
                  : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                border: (theme) => theme.palette.mode === 'dark'
                  ? "1px solid rgba(102, 126, 234, 0.2)"
                  : "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                  : "0 20px 40px rgba(0, 0, 0, 0.1)",
                width: "100%",
                maxWidth: "1200px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton
                    onClick={() => navigate("/datasources/correlations")}
                    sx={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Box>
                    <GradientText
                      colors={["#667eea", "#764ba2", "#f093fb"]}
                      animationSpeed={4}
                      showBorder={false}
                    >
                      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", margin: 0 }}>
                        {correlation?.name || 'Correlation Details'}
                      </Typography>
                    </GradientText>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Created {new Date(correlation?.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {modelPrediction && (
                    <Chip
                      icon={modelPrediction.is_anomaly ? <BugReportIcon /> : <CheckCircleIcon />}
                      label={modelPrediction.is_anomaly ? "Anomaly Detected" : "Normal"}
                      color={modelPrediction.is_anomaly ? "error" : "success"}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <Chip
                    icon={<LinkIcon />}
                    label={`${correlation?.datasources?.length || 0} Data Sources`}
                    sx={{
                      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                      border: "1px solid rgba(102, 126, 234, 0.3)",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Controls */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Query</InputLabel>
                    <Select
                      value={selectedQuery}
                      onChange={(e) => setSelectedQuery(e.target.value)}
                      label="Select Query"
                    >
                      {queries.map((query, index) => (
                        <MenuItem key={index} value={query}>
                          {query}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={streaming}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={streaming}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, height: "100%" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={fetchCorrelationData}
                        startIcon={<RefreshIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          flex: 1,
                          "&:hover": {
                            background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                          },
                        }}
                      >
                        Query
                      </Button>
                      <IconButton
                        onClick={toggleStreaming}
                        sx={{
                          background: streaming ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #10b981, #059669)",
                          color: "white",
                          "&:hover": {
                            background: streaming ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "linear-gradient(135deg, #059669, #047857)",
                          },
                        }}
                      >
                        {streaming ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setPrometheusData([]);
                        setLokiLogs([]);
                      }}
                      startIcon={<DeleteSweepIcon />}
                      disabled={prometheusData.length === 0 && lokiLogs.length === 0}
                      sx={{ 
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        py: 0.5,
                        minHeight: "32px"
                      }}
                      color="warning"
                      size="small"
                    >
                      Clear Data
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Chart Type Toggle */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <ToggleButtonGroup
                  value={chartType}
                  exclusive
                  onChange={handleChartTypeChange}
                  sx={{
                    "& .MuiToggleButton-root": {
                      border: "1px solid rgba(102, 126, 234, 0.3)",
                      "&.Mui-selected": {
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        color: "white",
                      },
                    },
                  }}
                >
                  <ToggleButton value="line">
                    <ShowChartIcon sx={{ mr: 1 }} />
                    Line Chart
                  </ToggleButton>
                  <ToggleButton value="bar">
                    <BarChartIcon sx={{ mr: 1 }} />
                    Bar Chart
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>

            {/* Error Display */}
            {dataError && (
              <Alert severity="error" sx={{ width: "100%", maxWidth: "1200px", mb: 3 }}>
                {dataError}
              </Alert>
            )}

            {/* Prometheus Chart */}
            {prometheusSource && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
                  width: "100%",
                  maxWidth: "1200px",
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <TimelineIcon sx={{ color: modelPrediction?.is_anomaly ? "error.main" : "primary.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Prometheus Metrics - {prometheusSource.name}
                  </Typography>
                </Box>

                <Box sx={{ height: 400 }}>
                  {chartType === "line" ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </Box>
              </Paper>
            )}

            {/* Loki Logs */}
            {lokiSource && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
                  width: "100%",
                  maxWidth: "1200px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <ViewListIcon sx={{ color: "primary.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Loki Logs - {lokiSource.name}
                  </Typography>
                  <Chip 
                    label={`${lokiLogs.length} logs`} 
                    size="small"
                    sx={{ ml: "auto" }}
                  />
                </Box>

                <Box sx={{ height: 400, width: '100%' }}>
                  <StyledDataGrid
                    rows={logRows}
                    columns={logColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    autoHeight={false}
                  />
                </Box>
              </Paper>
            )}

            {/* No Data Sources Message */}
            {!prometheusSource && !lokiSource && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  width: "100%",
                  maxWidth: "1200px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No Prometheus or Loki data sources found in this correlation.
                </Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 