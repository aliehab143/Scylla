import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import TimelineIcon from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

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
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

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

const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const parseStepToMilliseconds = (step) => {
  const stepMatch = step.match(/(\d+)([smhd])/);
  if (!stepMatch) return 60000;
  const [, value, unit] = stepMatch;
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return parseInt(value) * (multipliers[unit] || 60000);
};

export default function PrometheusDashboardPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [startTime, setStartTime] = useState(formatDateTime(new Date(Date.now() - 3600000)));
  const [endTime, setEndTime] = useState(formatDateTime(new Date()));
  const [step, setStep] = useState("1m");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const lastEndTime = useRef(Math.floor(new Date().getTime() / 1000));



  const fetchPrometheusQueries = async () => {
    try {
      const dashboardId = id;
      console.log("🚀 Starting fetchPrometheusQueries...");
      console.log("📍 Dashboard ID:", dashboardId);
      console.log("👤 User token exists:", !!user?.token);
      
      const response = await fetch(`${BASE_URL}/datasource/prometheus/get-queries/${dashboardId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("📡 Queries Response status:", response.status);
      console.log("📡 Queries Response ok:", response.ok);
      console.log("📡 Queries Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("📡 Queries Response content-type:", response.headers.get('content-type'));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        console.error("❌ Queries response not ok, status:", response.status);
        
        // Try to get response text first
        const responseText = await response.text();
        console.error("❌ Queries error response text:", responseText);
        
        if (isJson && responseText) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || "Failed to fetch Prometheus queries.");
          } catch (parseError) {
            console.error("❌ Failed to parse queries error response as JSON:", parseError);
            throw new Error(`Server error (${response.status}): ${responseText.substring(0, 200)}`);
          }
        } else {
          throw new Error(`Server error (${response.status}): ${responseText || 'Unknown error'}`);
        }
      }

      // Get response text first
      const responseText = await response.text();
      console.log("✅ Queries response text (first 1000 chars):", responseText.substring(0, 1000));
      
      if (!isJson) {
        console.error("❌ Queries response is not JSON. Content-Type:", contentType);
        console.error("❌ Full queries response text:", responseText);
        throw new Error(`Server returned non-JSON response. Expected JSON but got: ${contentType || 'unknown'}`);
      }

      // Parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("✅ Parsed queries data:", result);
        console.log("📊 Queries data structure:", {
          hasData: !!result.data,
          dataType: typeof result.data,
          isArray: Array.isArray(result.data),
          dataLength: result.data?.length,
          firstItem: result.data?.[0]
        });
      } catch (parseError) {
        console.error("❌ Failed to parse queries response as JSON:", parseError);
        console.error("❌ Queries response text that failed to parse:", responseText);
        throw new Error("Server returned invalid JSON response for queries");
      }

      setQueries(result.data || []);
      console.log("✨ Successfully set", (result.data || []).length, "queries");
    } catch (err) {
      console.error("💥 Error fetching Prometheus queries:", err);
      console.error("💥 Queries error message:", err.message);
      console.error("💥 Queries error stack:", err.stack);
      setError("Failed to fetch data. Please try again.");
    } finally {
      console.log("🏁 fetchPrometheusQueries completed");
    }
  };

  const fetchPrometheusData = async () => {
    if (!selectedQuery) {
      setError("Please select a query.");
      return;
    }

    try {
      const now = new Date();
      
      console.log("🚀 Starting fetchPrometheusData...");
      console.log("📊 Selected query:", selectedQuery);
      console.log("⏰ Streaming mode:", streaming);
      if (streaming) {
        console.log("📅 Streaming window: Last 15 seconds until now");
        console.log("📅 From:", new Date(now.getTime() - 15000).toISOString());
        console.log("📅 To:", now.toISOString());
      } else {
        console.log("📅 Start time:", startTime);
        console.log("📅 End time:", endTime);
      }
      console.log("⚡ Step:", step);

      // Format timestamps as Unix timestamp in seconds
      const formatTimestamp = (date) => {
        return Math.floor(date.getTime() / 1000).toString();
      };

      const startTimestamp = streaming
        ? formatTimestamp(new Date(now.getTime() - 15000)) // Last 15 seconds
        : formatTimestamp(new Date(startTime));

      const endTimestamp = streaming 
        ? formatTimestamp(now) 
        : formatTimestamp(new Date(endTime));

      let queryToUse = selectedQuery;
     
      
      console.log("🔄 Transformed query:", queryToUse);
      console.log("⏰ Start timestamp:", startTimestamp);
      console.log("⏰ End timestamp:", endTimestamp);
      
      const url = new URL(`${BASE_URL}/dashboard/${id}`);
      url.searchParams.append("query", queryToUse);
      url.searchParams.append("start", startTimestamp);
      url.searchParams.append("end", endTimestamp);

      console.log("🌐 Full URL:", url.toString());

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("📡 Data Response status:", response.status);
      console.log("📡 Data Response ok:", response.ok);
      console.log("📡 Data Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("📡 Data Response content-type:", response.headers.get('content-type'));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        console.error("❌ Data response not ok, status:", response.status);
        
        // Try to get response text first
        const responseText = await response.text();
        console.error("❌ Data error response text:", responseText);
        
        if (isJson && responseText) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || "Failed to fetch dashboard data.");
          } catch (parseError) {
            console.error("❌ Failed to parse data error response as JSON:", parseError);
            throw new Error(`Server error (${response.status}): ${responseText.substring(0, 200)}`);
          }
        } else {
          throw new Error(`Server error (${response.status}): ${responseText || 'Unknown error'}`);
        }
      }

      // Get response text first
      const responseText = await response.text();
      console.log("✅ Data response text (first 1000 chars):", responseText.substring(0, 1000));
      console.log("🔍 RAW FETCH RESPONSE DATA:", responseText);
      
      if (!isJson) {
        console.error("❌ Data response is not JSON. Content-Type:", contentType);
        console.error("❌ Full data response text:", responseText);
        throw new Error(`Server returned non-JSON response. Expected JSON but got: ${contentType || 'unknown'}`);
      }

      // Parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("✅ Parsed data result:", result);
        console.log("📊 Data structure:", {
          hasData: !!result.data,
          dataType: typeof result.data,
          isArray: Array.isArray(result.data),
          dataLength: result.data?.length,
          firstItem: result.data?.[0],
          sampleItems: result.data?.slice(0, 3)
        });
      } catch (parseError) {
        console.error("❌ Failed to parse data response as JSON:", parseError);
        console.error("❌ Data response text that failed to parse:", responseText);
        throw new Error("Server returned invalid JSON response for data");
      }

      console.log("Raw Prometheus Response:", result);

      const timeSeriesData = result.data.map((entry, index) => {
        console.log(`📋 Processing entry ${index}:`, entry);
        
        // Check if it's an anomaly based on modelPrediction
        const isAnomaly = result.modelPrediction?.is_anomaly ? 1 : 0;
        
        return {
          time: entry.timestamp,
          value: parseFloat(entry.value),
          anomaly: isAnomaly
        };
      });

      console.log("Processed Time Series Data:", timeSeriesData);
      console.log("✨ Processed", timeSeriesData.length, "data points");
      console.log("🔍 Model Prediction:", result.modelPrediction);
      
      // Handle data differently for streaming vs non-streaming
      if (streaming) {
        // In streaming mode, filter out duplicates based on timestamp
        setData((prevData) => {
          const existingTimestamps = new Set(prevData.map(item => item.time));
          const newUniqueData = timeSeriesData.filter(item => !existingTimestamps.has(item.time));
          const anomaliesInNew = newUniqueData.filter(item => item.anomaly === 1).length;
          console.log(`🔄 Streaming (last 15sec): ${prevData.length} existing points, ${timeSeriesData.length} new points, ${newUniqueData.length} unique new points`);
          if (anomaliesInNew > 0) {
            console.log(`🚨 ANOMALY DETECTED: ${anomaliesInNew} anomalous points in new data!`);
          }
          return [...prevData, ...newUniqueData];
        });
      } else {
        // Replace data for non-streaming mode to prevent duplication
        console.log(`📊 Non-streaming: Replacing ${timeSeriesData.length} data points`);
        setData(timeSeriesData);
      }
      setError("");
    } catch (err) {
      console.error("💥 Error fetching Prometheus data:", err);
      console.error("💥 Data error message:", err.message);
      console.error("💥 Data error stack:", err.stack);
      setError("Failed to fetch data. Please try again.");
    } finally {
      console.log("🏁 fetchPrometheusData completed");
    }
  };

  useEffect(() => {
    fetchPrometheusQueries();
  }, [user?.token]);

  useEffect(() => {
    let interval;
    if (streaming) {
      // Fetch every 15 seconds for streaming mode
      interval = setInterval(fetchPrometheusData, 15000);
    }
    return () => clearInterval(interval);
  }, [streaming, selectedQuery]);

  useEffect(() => {
    setData([]);
  }, [selectedQuery, streaming]);

  // Enhanced chart configuration - check for anomalies in recent data
  const isAnomalous = data.length > 0 && (
    streaming 
      ? data.slice(-5).some(point => point.anomaly === 1) // Check last 5 points in streaming
      : data.some(point => point.anomaly === 1) // Check any point in non-streaming
  );
  
  const chartData = {
    labels: data.map((d) => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: selectedQuery || "Prometheus Metric",
        data: data.map((d) => d.value),
        backgroundColor: chartType === 'bar' 
          ? data.map(point => point.anomaly === 1 ? 'rgba(244, 67, 54, 0.8)' : 'rgba(102, 126, 234, 0.8)')
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
          ? data.map(point => point.anomaly === 1 ? '#f44336' : '#667eea')
          : (isAnomalous ? '#f44336' : '#667eea'),
        borderWidth: chartType === 'bar' 
          ? data.map(point => point.anomaly === 1 ? 3 : 2)
          : 3,
        tension: 0.4,
        fill: chartType === "line",
        pointStyle: 'circle',
        pointBackgroundColor: data.map(point => point.anomaly === 1 ? '#f44336' : '#667eea'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: data.map(point => point.anomaly === 1 ? 6 : 4), // Larger points for anomalies
        pointHoverRadius: 8,
        pointHoverBackgroundColor: data.map(point => point.anomaly === 1 ? '#f44336' : '#667eea'),
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
    ],
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
            const point = data[index];
            return new Date(point.time).toLocaleString();
          },
          label: (context) => {
            const value = context.parsed.y;
            const isAnomaly = data[context.dataIndex]?.anomaly === 1;
            return [
              `Value: ${value.toFixed(2)}`,
              `Status: ${isAnomaly ? '🚨 Anomaly Detected' : '✅ Normal'}`
            ];
          },
        },
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
      },
    },
  };

  const resetTimeRange = () => {
    const now = formatDateTime(new Date());
    const hourAgo = formatDateTime(new Date(Date.now() - 3600000));
    setStartTime(hourAgo);
    setEndTime(now);
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const toggleStreaming = () => {
    setStreaming(!streaming);
    if (!streaming) {
      setData([]);
    }
  };

  // Calculate statistics
  const totalDataPoints = data.length;
  const anomalyStatus = isAnomalous ? "Anomaly Detected" : "Normal Operation";

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
            background: "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
            minHeight: "100vh",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, #4facfe15 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00f2fe15 0%, transparent 50%)',
              opacity: 0.7,
              zIndex: 0,
            }}
          />

          <AppNavbar />
          <Box sx={{ p: 3, pt: { xs: 11, md: 3 }, position: "relative", zIndex: 1 }}>
            <Header />
            
            {/* Dashboard Header */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: "bold",
                  }}
                >
                  Prometheus Dashboard
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label={`${totalDataPoints} Data Points`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                  <Chip 
                    icon={isAnomalous ? <BugReportIcon /> : <CheckCircleIcon />}
                    label={anomalyStatus}
                    color={isAnomalous ? "error" : "success"}
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                </Stack>
              </Stack>

              {/* Controls Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  {/* Query Selection */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Prometheus Query</InputLabel>
                      <Select
                        value={selectedQuery}
                        onChange={(e) => setSelectedQuery(e.target.value)}
                        label="Prometheus Query"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {queries.map((query, index) => (
                          <MenuItem key={index} value={query}>
                            {query}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Chart Type Selection */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                  </Grid>

                  {/* Time Controls */}
                  <Grid item xs={12} md={3}>
                    <Stack spacing={2}>
                      <TextField
                        label="Start Time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        disabled={streaming}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      <TextField
                        label="End Time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={streaming}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Stack>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} md={2}>
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        onClick={toggleStreaming}
                        startIcon={streaming ? <PauseIcon /> : <PlayArrowIcon />}
                        color={streaming ? "error" : "success"}
                        sx={{ borderRadius: 2 }}
                      >
                        {streaming ? "Stop" : "Stream"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={fetchPrometheusData}
                        startIcon={<RefreshIcon />}
                        disabled={!selectedQuery}
                        sx={{ borderRadius: 2 }}
                      >
                        Fetch Data
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setData([])}
                        startIcon={<DeleteSweepIcon />}
                        disabled={data.length === 0}
                        sx={{ borderRadius: 2 }}
                        color="warning"
                      >
                        Clear Data
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                  }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
            </Box>

            {/* Enhanced Chart Container */}
            <Paper 
              elevation={0}
              sx={{ 
                height: '70vh',
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                mb: 3,
              }}
            >
              {data.length > 0 ? (
                <Box sx={{ height: '100%', position: 'relative' }}>
                  {chartType === "line" ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center'
                  }}
                >
                  <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select a query and fetch data to see your Prometheus metrics
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
