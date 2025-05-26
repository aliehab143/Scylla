import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import StorageIcon from '@mui/icons-material/Storage';
import TimelineIcon from '@mui/icons-material/Timeline';
import CorrelationNameField from '../components/CorrelationComponents/CorrelationNameField';
import DataSourceSelectionCard from '../components/CorrelationComponents/DataSourceSelectionCard';
import SuccessMessage from '../components/CorrelationComponents/SuccessMessage';

export default function CorrelateDataSourcesPage() {
  const [correlationName, setCorrelationName] = useState("");
  const [allDataSources, setAllDataSources] = useState([]);
  const [selectedLokiSource, setSelectedLokiSource] = useState(null);
  const [selectedPrometheusSource, setSelectedPrometheusSource] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setSuccess("Correlation created successfully!");
    } catch (error) {
      console.error("Error creating correlation:", error);
      setError(error.message);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : theme.palette.background.default,
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
            }}
          >
            <Header />
            <Box sx={{ width: "100%", maxWidth: 1200 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Correlate Data Sources
              </Typography>

              {success && (
                <SuccessMessage 
                  message={success} 
                  onClose={handleCloseSuccess}
                />
              )}

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <CorrelationNameField 
                correlationName={correlationName}
                setCorrelationName={setCorrelationName}
              />

              <Grid container spacing={3}>
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

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCorrelate}
                  disabled={!selectedLokiSource || !selectedPrometheusSource || !correlationName.trim() || loading}
                  sx={{
                    minWidth: 200,
                    height: 48,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                    '&:disabled': {
                      backgroundColor: 'action.disabledBackground',
                      color: 'text.primary',
                      opacity: 0.7,
                      cursor: 'not-allowed',
                      boxShadow: 'none',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Correlation'}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 