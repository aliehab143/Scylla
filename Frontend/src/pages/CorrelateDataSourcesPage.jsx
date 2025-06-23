import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import StorageIcon from '@mui/icons-material/Storage';
import TimelineIcon from '@mui/icons-material/Timeline';
import LinkIcon from '@mui/icons-material/Link';
import CorrelationNameField from '../components/CorrelationComponents/CorrelationNameField';
import DataSourceSelectionCard from '../components/CorrelationComponents/DataSourceSelectionCard';
import SuccessMessage from '../components/CorrelationComponents/SuccessMessage';
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

export default function CorrelateDataSourcesPage() {
  const [correlationName, setCorrelationName] = useState("");
  const [allDataSources, setAllDataSources] = useState([]);
  const [selectedLokiSource, setSelectedLokiSource] = useState(null);
  const [selectedPrometheusSource, setSelectedPrometheusSource] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/user/all`, {
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

        const responseData = await response.json();
        
        if (responseData.data && responseData.data[0]?.datasources) {
          setAllDataSources(responseData.data[0].datasources);
        } else {
          console.error('Unexpected response structure:', responseData);
          setAllDataSources([]);
        }
      } catch (error) {
        console.error("Error fetching data sources:", error);
        setError(error.message);
        setAllDataSources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, [user?.token]);

  // Filter data sources by type
  const lokiDataSources = allDataSources.filter(source => source?.type === 'loki');
  const prometheusDataSources = allDataSources.filter(source => source?.type === 'prometheus');

  const handleLokiSourceSelect = (source) => {
    setSelectedLokiSource(source);
  };

  const handlePrometheusSourceSelect = (source) => {
    setSelectedPrometheusSource(source);
  };

  const handleCorrelate = async () => {
    if (!selectedLokiSource || !selectedPrometheusSource) {
      setError("Please select both a Loki and Prometheus data source");
      return;
    }

    if (!correlationName.trim()) {
      setError("Please enter a correlation name");
      return;
    }

    setCreating(true);
    setError(null);

    const correlationData = {
      name: correlationName,
      datasourceIds: [selectedLokiSource._id, selectedPrometheusSource._id]
    };
    
    console.log("Sending correlation data:", correlationData);

    try {
      const response = await fetch(`${BASE_URL}/datacorrelation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(correlationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and show success message
      setCorrelationName("");
      setSelectedLokiSource(null);
      setSelectedPrometheusSource(null);
      setError(null);
      setSuccess("Dashboard created successfully!");
    } catch (error) {
      console.error("Error creating correlation:", error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.5)'
        }}
        open={creating}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Creating Correlation...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we set up your correlation
          </Typography>
        </Box>
      </Backdrop>

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

            {/* Page Content */}
            <Container maxWidth="lg">
              {/* Enhanced Header Section */}
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: 4,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LinkIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <GradientText
                        colors={["#667eea", "#764ba2", "#f093fb"]}
                        animationSpeed={4}
                        showBorder={false}
                        className="text-2xl font-bold"
                      >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", margin: 0 }}>
                          Correlate Data Sources
                        </Typography>
                      </GradientText>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                      Create powerful correlations between Loki logs and Prometheus metrics to gain deeper insights into your observability data.
                    </Typography>
                    
                    {/* Stats */}
                    <Box sx={{ display: "flex", gap: 4, mt: 3, flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {lokiDataSources.length} Loki Source{lokiDataSources.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {prometheusDataSources.length} Prometheus Source{prometheusDataSources.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Success Message */}
              {success && (
                <Fade in={!!success}>
                  <Paper
                    sx={{
                      mb: 3,
                      p: 2,
                      background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))",
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="success.main" sx={{ fontWeight: 500 }}>
                      {success}
                    </Typography>
                    <ClickSpark
                      sparkColor="#4caf50"
                      sparkCount={4}
                      sparkSize={6}
                      sparkRadius={15}
                      duration={400}
                    >
                      <Button
                        size="small"
                        onClick={handleCloseSuccess}
                        sx={{ mt: 1, color: "success.main" }}
                      >
                        Dismiss
                      </Button>
                    </ClickSpark>
                  </Paper>
                </Fade>
              )}

              {/* Error Display */}
              {error && (
                <Fade in={!!error}>
                  <Paper
                    sx={{
                      mb: 3,
                      p: 2,
                      background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))",
                      border: "1px solid rgba(244, 67, 54, 0.2)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="error.main" sx={{ fontWeight: 500 }}>
                      {error}
                    </Typography>
                  </Paper>
                </Fade>
              )}

              {/* Correlation Form */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.1)"
                    : "1px solid rgba(226, 232, 240, 0.6)",
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? "0 12px 32px rgba(0, 0, 0, 0.3)"
                    : "0 12px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CorrelationNameField 
                  correlationName={correlationName}
                  setCorrelationName={setCorrelationName}
                />

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <DataSourceSelectionCard
                      title="Loki Data Sources"
                      icon={<StorageIcon color="primary" sx={{ mr: 1 }} />}
                      tooltip="Select a Loki data source to correlate with Prometheus metrics"
                      dataSources={lokiDataSources}
                      selectedSource={selectedLokiSource}
                      onSourceSelect={handleLokiSourceSelect}
                      onSourceDeselect={() => setSelectedLokiSource(null)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DataSourceSelectionCard
                      title="Prometheus Data Sources"
                      icon={<TimelineIcon color="primary" sx={{ mr: 1 }} />}
                      tooltip="Select a Prometheus data source to correlate with Loki logs"
                      dataSources={prometheusDataSources}
                      selectedSource={selectedPrometheusSource}
                      onSourceSelect={handlePrometheusSourceSelect}
                      onSourceDeselect={() => setSelectedPrometheusSource(null)}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <ClickSpark
                    sparkColor="#667eea"
                    sparkCount={8}
                    sparkSize={10}
                    sparkRadius={25}
                    duration={600}
                  >
                                         <Button
                       variant="contained"
                       onClick={handleCorrelate}
                       disabled={!selectedLokiSource || !selectedPrometheusSource || !correlationName.trim() || creating}
                       sx={{
                         minWidth: 200,
                         height: 48,
                         fontSize: '1.1rem',
                         fontWeight: 600,
                         textTransform: 'none',
                         background: "linear-gradient(135deg, #667eea, #764ba2)",
                         borderRadius: 2,
                         boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                         "&:hover": {
                           background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                           boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                           transform: "translateY(-2px)",
                         },
                         "&:disabled": {
                           background: (theme) => theme.palette.mode === 'dark' 
                             ? "linear-gradient(135deg, #424242, #616161)"
                             : "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
                           color: (theme) => theme.palette.mode === 'dark' 
                             ? "rgba(255, 255, 255, 0.4)"
                             : "rgba(0, 0, 0, 0.4)",
                           boxShadow: "none",
                           cursor: "not-allowed",
                           "&:hover": {
                             transform: "none",
                             boxShadow: "none",
                             background: (theme) => theme.palette.mode === 'dark' 
                               ? "linear-gradient(135deg, #424242, #616161)"
                               : "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
                           },
                         },
                         transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                       }}
                     >
                      {creating ? 'Creating dashboard...' : 'Create Correlation'}
                    </Button>
                  </ClickSpark>
                </Box>
              </Paper>
            </Container>
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 