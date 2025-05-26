import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const formatDateTime = (date) => {
  const isoString = date.toISOString();
  return isoString.slice(0, isoString.lastIndexOf(":"));
};

const parseStepToMilliseconds = (step) => {
  const unit = step.slice(-1);
  const value = parseInt(step.slice(0, -1), 10);
  if (unit === "s") return value * 1000;
  if (unit === "m") return value * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  return 2000;
};

export default function PrometheusDashboardPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(formatDateTime(new Date()));
  const [endTime, setEndTime] = useState(formatDateTime(new Date()));
  const [step, setStep] = useState("30s");
  const [streaming, setStreaming] = useState(false);
  const lastEndTime = useRef(Math.floor(new Date().getTime() / 1000));

  const fetchPrometheusQueries = async () => {
    try {
      const dashboardId = id;
      console.log("Dashboard ID:", dashboardId);
    
      const response = await fetch(`${BASE_URL}/datasource/prometheus/get-queries/${dashboardId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Prometheus queries.");
      }

      const result = await response.json();
      setQueries(result.data || []);
    } catch (err) {
      console.error("Error fetching Prometheus queries:", err);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const fetchPrometheusData = async () => {
    if (!selectedQuery) {
      setError("Please select a query.");
      return;
    }

    try {
      const now = Math.floor(Date.now() / 1000);

      const startTimestamp = streaming
        ? lastEndTime.current
        : Math.floor(new Date(startTime).getTime() / 1000);

      const endTimestamp = streaming ? now : Math.floor(new Date(endTime).getTime() / 1000);

      // Transform the query if it's node_cpu_seconds_total
      let queryToUse = selectedQuery;
      if (selectedQuery === 'node_cpu_seconds_total') {
        queryToUse = '100 * (1 - sum by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance) (rate(node_cpu_seconds_total[5m])))';
      }
      
      const url = new URL(`${BASE_URL}/dashboard/${id}`);
      url.searchParams.append("query", queryToUse);
      url.searchParams.append("start", startTimestamp);
      url.searchParams.append("end", endTimestamp);
      url.searchParams.append("step", step);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch dashboard data.");
      }

      const result = await response.json();
      console.log("Raw Prometheus Response:", result);

      const timeSeriesData = result.data.map((entry) => ({
        time: entry.time,
        value: parseFloat(entry.value),
        anomaly: entry.anomaly
      }));

      console.log("Processed Time Series Data:", timeSeriesData);
      setData((prevData) => [...prevData, ...timeSeriesData]);
      if (streaming) lastEndTime.current = endTimestamp;
      setError("");
    } catch (err) {
      console.error("Error fetching Prometheus data:", err);
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchPrometheusQueries();
  }, [user?.token]);

  useEffect(() => {
    let interval;
    const intervalDuration = parseStepToMilliseconds(step);
    if (streaming) {
      interval = setInterval(fetchPrometheusData, intervalDuration);
    }
    return () => clearInterval(interval);
  }, [streaming, selectedQuery, step]);

  useEffect(() => {
    setData([]);
  }, [selectedQuery, streaming]);

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: `Query: ${selectedQuery}`,
        data: data.map((d) => d.value),
        backgroundColor: chartType === 'bar' 
          ? data.map((d) => d.anomaly === 1 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(54, 162, 235, 0.7)')
          : (context) => {
              const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
              gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");
              return gradient;
            },
        borderColor: chartType === 'bar' 
          ? data.map((d) => d.anomaly === 1 ? 'rgba(255, 0, 0, 1)' : 'rgba(54, 162, 235, 1)')
          : 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: chartType === "line",
        pointStyle: 'circle',
        pointBackgroundColor: data.map((d) => d.anomaly === 1 ? 'rgba(255, 0, 0, 1)' : 'rgba(54, 162, 235, 1)'),
        pointBorderColor: data.map((d) => d.anomaly === 1 ? 'rgba(255, 0, 0, 1)' : 'rgba(54, 162, 235, 1)'),
        pointRadius: data.map((d) => d.anomaly === 1 ? 6 : 3),
        pointHoverRadius: data.map((d) => d.anomaly === 1 ? 8 : 5),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            family: "Poppins, Arial, sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const point = data[index];
            return [
              `Value: ${point.value.toFixed(2)}`,
              `Anomaly: ${point.anomaly === 1 ? 'Yes' : 'No'}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Poppins, Arial, sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          font: {
            size: 12,
            family: "Poppins, Arial, sans-serif",
          },
        },
      },
    },
  };

  const resetTimeRange = () => {
    const now = formatDateTime(new Date());
    setStartTime(now);
    setEndTime(now);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
            backgroundColor: (theme) =>
              theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : theme.palette.background.default,
          }}
        >
          <AppNavbar />
          <Stack spacing={2} sx={{ alignItems: "center", pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <Box sx={{ width: "100%", maxWidth: 1200, mt: 3 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
                Prometheus Dashboard
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Select
                    value={selectedQuery}
                    onChange={(e) => setSelectedQuery(e.target.value)}
                    displayEmpty
                    fullWidth
                    inputProps={{ "aria-label": "Select Prometheus Query" }}
                  >
                    <MenuItem value="" disabled>
                      Select a Prometheus Query
                    </MenuItem>
                    {queries.map((query, index) => (
                      <MenuItem key={index} value={query}>
                        {query}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    displayEmpty
                    fullWidth
                    inputProps={{ "aria-label": "Chart Type Selector" }}
                  >
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={streaming}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={streaming}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Step"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    fullWidth
                    disabled={streaming}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={fetchPrometheusData}
                    fullWidth
                    disabled={streaming}
                  >
                    Fetch Data
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetTimeRange}
                    fullWidth
                  >
                    Reset Time
                  </Button>
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={streaming}
                    onChange={(e) => setStreaming(e.target.checked)}
                  />
                }
                label="Enable Streaming"
              />

              {chartType === "line" ? (
                <Line data={chartData} options={options} />
              ) : (
                <Bar data={chartData} options={options} />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
