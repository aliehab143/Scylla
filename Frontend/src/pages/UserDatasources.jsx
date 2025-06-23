import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { alpha, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimelineIcon from "@mui/icons-material/Timeline";
import FeedIcon from "@mui/icons-material/Feed";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SideMenu from "../components/DashboardsPageComponents/SideMenu"; // Adjust path as needed
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar"; // Adjust path as needed
import Header from "../components/DashboardsPageComponents/Header"; // Adjust path as needed
import EditDataSourceDialog from "../components/EditDataSourceDialog";
import { AuthContext } from "../context/Auth/AuthContext"; // Adjust path as needed
import { BASE_URL } from "../constants/constants";
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";



export default function UserDataSources() {
  const [dataSources, setDataSources] = useState([]); // State to store data sources
  const [error, setError] = useState(""); // State to handle errors
  const [loading, setLoading] = useState(true);
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { user } = useContext(AuthContext); // Get user info from AuthContext
  const navigate = useNavigate(); // Navigation hook

  const fetchDataSources = async () => {
    setLoading(true);
    try {
      console.log('🚀 Fetching data sources from:', `${BASE_URL}/user/all`);
      console.log('👤 User token exists:', !!user?.token);
      
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
          Authorization: `Bearer ${user?.token}`, // Pass JWT token
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('📡 Response content-type:', response.headers.get('content-type'));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        console.error('❌ Response not ok, status:', response.status);
        
        // Try to get response text first
        const responseText = await response.text();
        console.error('❌ Error response text:', responseText);
        
        if (isJson && responseText) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || "Failed to fetch data sources.");
          } catch (parseError) {
            console.error('❌ Failed to parse error response as JSON:', parseError);
            throw new Error(`Server error (${response.status}): ${responseText.substring(0, 200)}`);
          }
        } else {
          throw new Error(`Server error (${response.status}): ${responseText || 'Unknown error'}`);
        }
      }

      // Get response text first
      const responseText = await response.text();
      console.log('✅ Response text (first 500 chars):', responseText.substring(0, 500));
      
      if (!isJson) {
        console.error('❌ Response is not JSON. Content-Type:', contentType);
        console.error('❌ Full response text:', responseText);
        throw new Error(`Server returned non-JSON response. Expected JSON but got: ${contentType || 'unknown'}`);
      }

      // Parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        console.error('❌ Response text that failed to parse:', responseText);
        throw new Error('Server returned invalid JSON response');
      }

      setDataSources(data.data?.[0]?.datasources || []); // Assuming data structure
      setError("");
      console.log('✨ Successfully set', data.data?.[0]?.datasources?.length || 0, 'data sources');
      
    } catch (err) {
      console.error("💥 Error fetching data sources:", err);
      console.error("💥 Error message:", err.message);
      console.error("💥 Error stack:", err.stack);
      setError(err.message || "An error occurred while fetching data sources.");
    } finally {
      setLoading(false);
      console.log('🏁 fetchDataSources completed');
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, [user?.token]);

  const handleEditClick = (event, dataSource) => {
    event.stopPropagation();
    setSelectedDataSource(dataSource);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (event, dataSource) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this data source?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting data source:', dataSource._id);
      
      const response = await fetch(`${BASE_URL}/datasource/${dataSource._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);
      console.log('📡 Delete response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        console.error('❌ Delete response not ok, status:', response.status);
        
        const responseText = await response.text();
        console.error('❌ Delete error response text:', responseText);
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (isJson && responseText) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || 'Failed to delete data source');
          } catch (parseError) {
            console.error('❌ Failed to parse delete error response as JSON:', parseError);
            throw new Error(`Delete failed (${response.status}): ${responseText.substring(0, 200)}`);
          }
        } else {
          throw new Error(`Delete failed (${response.status}): ${responseText || 'Unknown error'}`);
        }
      }

      console.log('✅ Data source deleted successfully');
      fetchDataSources();
    } catch (err) {
      console.error('💥 Error deleting data source:', err);
      setError(err.message || 'An error occurred while deleting the data source');
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedDataSource(null);
  };

  const handleDataSourceUpdate = () => {
    fetchDataSources();
  };

  const getDataSourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus":
        return <TimelineIcon sx={{ fontSize: 20 }} />;
      case "csv":
        return <DescriptionIcon sx={{ fontSize: 20 }} />;
      case "loki":
        return <FeedIcon sx={{ fontSize: 20 }} />;
      default:
        return <StorageIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getDataSourceColor = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus":
        return "#667eea";
      case "csv":
        return "#f093fb";
      case "loki":
        return "#43e97b";
      default:
        return "#94a3b8";
    }
  };

  const getGradientForType = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus":
        return "linear-gradient(135deg, #667eea, #764ba2)";
      case "csv":
        return "linear-gradient(135deg, #f093fb, #f5576c)";
      case "loki":
        return "linear-gradient(135deg, #43e97b, #52ffb8)";
      default:
        return "linear-gradient(135deg, #764ba2, #667eea)";
    }
  };

  const getDataSourceStats = () => {
    const prometheus = dataSources.filter(ds => ds.type?.toLowerCase() === 'prometheus').length;
    const csv = dataSources.filter(ds => ds.type?.toLowerCase() === 'csv').length;
    const loki = dataSources.filter(ds => ds.type?.toLowerCase() === 'loki').length;
    const total = dataSources.length;

    return { prometheus, csv, loki, total };
  };

  const stats = getDataSourceStats();

  return (
    <div>
      {/* Apply baseline styles */}
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Side Menu */}
        <SideMenu />

        {/* Main Content */}
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
          {/* App Navbar */}
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
            {/* Header */}
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
                    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
                    : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                    : "0 20px 40px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Background decoration */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                    opacity: 0.7,
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, position: "relative", zIndex: 1 }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, overflow: "visible" }}>
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
                        <StorageIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Box sx={{ overflow: "visible" }}>
                        <GradientText
                          colors={["#667eea", "#764ba2", "#f093fb"]}
                          animationSpeed={4}
                          showBorder={false}
                          className="text-2xl font-bold"
                        >
                          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", margin: 0, lineHeight: 1.2, overflow: "visible" }}>
                            Data Sources
                          </Typography>
                        </GradientText>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                      Manage and configure your data sources. Connect Prometheus, Loki, or upload CSV files to start building powerful analytics dashboards.
                    </Typography>
                    
                    {/* Stats */}
                    <Box sx={{ display: "flex", gap: 4, mt: 3, flexWrap: "wrap" }}>
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
                          {stats.total} Connected Source{stats.total !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #f093fb, #43e97b)",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {stats.prometheus + stats.loki} Active Monitor{(stats.prometheus + stats.loki) !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <ClickSpark
                    sparkColor="#667eea"
                    sparkCount={8}
                    sparkSize={10}
                    sparkRadius={25}
                    duration={600}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/datasources/add")}
                      sx={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      Add Data Source
                    </Button>
                  </ClickSpark>
                </Box>
              </Paper>

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

              {/* Data Source Cards */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading data sources...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {dataSources.map((dataSource, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={dataSource._id}>
                      <Fade in={true} timeout={300 + index * 100}>
                        <Box
                          sx={{
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                            "@keyframes fadeInUp": {
                              from: { opacity: 0, transform: "translateY(20px)" },
                              to: { opacity: 1, transform: "translateY(0)" }
                            }
                          }}
                        >
                          <SpotlightCard
                            spotlightColor={`${getDataSourceColor(dataSource.type)}40`}
                            className="datasource-card"
                          >
                            <ClickSpark
                              sparkColor={getDataSourceColor(dataSource.type)}
                              sparkCount={6}
                              sparkSize={8}
                              sparkRadius={20}
                              duration={500}
                            >
                              <Card
                                sx={{
                                  height: "100%",
                                  background: (theme) => theme.palette.mode === 'dark'
                                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%)"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
                                  backdropFilter: "blur(20px)",
                                  border: `1px solid ${getDataSourceColor(dataSource.type)}30`,
                                  borderRadius: 3,
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  cursor: "pointer",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: `0 20px 60px ${getDataSourceColor(dataSource.type)}30`,
                                    borderColor: `${getDataSourceColor(dataSource.type)}60`,
                                    "& .datasource-icon": {
                                      transform: "scale(1.1) rotate(5deg)",
                                    },
                                    "& .datasource-glow": {
                                      opacity: 1,
                                    }
                                  },
                                }}
                              >
                                {/* Hover glow effect */}
                                <Box
                                  className="datasource-glow"
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "50%",
                                    background: getGradientForType(dataSource.type),
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                    pointerEvents: "none",
                                  }}
                                />
                                
                                <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Box
                                      className="datasource-icon"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: getGradientForType(dataSource.type),
                                        color: "white",
                                        mr: 2,
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: `0 4px 20px ${getDataSourceColor(dataSource.type)}40`,
                                      }}
                                    >
                                      {getDataSourceIcon(dataSource.type)}
                                    </Box>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                      <Typography 
                                        variant="h6" 
                                        component="div" 
                                        sx={{ 
                                          fontWeight: 600,
                                          color: "text.primary",
                                          fontSize: "1.1rem",
                                          mb: 0.5,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap"
                                        }}
                                      >
                                        {dataSource.name}
                                      </Typography>
                                      <Chip
                                        label={dataSource.type?.toUpperCase() || "UNKNOWN"}
                                        size="small"
                                        sx={{
                                          background: `${getDataSourceColor(dataSource.type)}20`,
                                          color: getDataSourceColor(dataSource.type),
                                          fontWeight: 600,
                                          fontSize: "0.75rem",
                                          height: 20,
                                          border: `1px solid ${getDataSourceColor(dataSource.type)}40`,
                                        }}
                                      />
                                    </Box>
                                  </Box>

                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      <strong>Host:</strong> {dataSource.hostURL || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Created:</strong> {new Date(dataSource.createdAt || Date.now()).toLocaleDateString()}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Click to manage
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      {dataSource.type?.toLowerCase() !== "csv" && (
                                        <ClickSpark
                                          sparkColor={getDataSourceColor(dataSource.type)}
                                          sparkCount={4}
                                          sparkSize={6}
                                          sparkRadius={15}
                                          duration={400}
                                        >
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditClick(e, dataSource);
                                            }}
                                            sx={{
                                              color: getDataSourceColor(dataSource.type),
                                              transition: "all 0.3s ease",
                                              "&:hover": {
                                                backgroundColor: getDataSourceColor(dataSource.type),
                                                color: "white",
                                                transform: "scale(1.1)",
                                              },
                                            }}
                                          >
                                            <EditIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                        </ClickSpark>
                                      )}
                                      <ClickSpark
                                        sparkColor="#f44336"
                                        sparkCount={4}
                                        sparkSize={6}
                                        sparkRadius={15}
                                        duration={400}
                                      >
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(e, dataSource);
                                          }}
                                          sx={{
                                            color: "error.main",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                              backgroundColor: "error.main",
                                              color: "white",
                                              transform: "scale(1.1)",
                                            },
                                          }}
                                        >
                                          <DeleteIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                      </ClickSpark>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </ClickSpark>
                          </SpotlightCard>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Empty State */}
              {!loading && dataSources.length === 0 && (
                <Fade in={true}>
                  <Paper
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 8,
                      px: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                      backdropFilter: "blur(20px)",
                      border: (theme) => theme.palette.mode === 'dark'
                        ? "1px solid rgba(102, 126, 234, 0.2)"
                        : "1px solid rgba(226, 232, 240, 0.6)",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea20, #f093fb20)",
                        mb: 3,
                      }}
                    >
                      <StorageIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                    </Box>
                    <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Data Sources Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                      Get started by connecting your first data source. Choose from Prometheus, Loki, or upload CSV files to begin building analytics dashboards.
                    </Typography>
                    <ClickSpark
                      sparkColor="#667eea"
                      sparkCount={8}
                      sparkSize={10}
                      sparkRadius={25}
                      duration={600}
                    >
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/datasources/add")}
                        size="large"
                        sx={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          borderRadius: 2,
                          px: 4,
                          py: 2,
                          fontSize: "1rem",
                          fontWeight: 600,
                          textTransform: "none",
                          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                            boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        Add Your First Data Source
                      </Button>
                    </ClickSpark>
                  </Paper>
                </Fade>
              )}
            </Container>
          </Stack>
        </Box>
      </Box>

      <EditDataSourceDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        dataSource={selectedDataSource}
        onUpdate={handleDataSourceUpdate}
      />
    </div>
  );
}
