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
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import AddIcon from "@mui/icons-material/Add";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TableChartIcon from "@mui/icons-material/TableChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SideMenu from "../components/DashboardsPageComponents/SideMenu"; // Adjust path as needed
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar"; // Adjust path as needed
import Header from "../components/DashboardsPageComponents/Header"; // Adjust path as needed
import { AuthContext } from "../context/Auth/AuthContext"; // Adjust path as needed
import { BASE_URL } from "../constants/constants";
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

export default function DashboardSelectPage() {
  const [dashboards, setDashboards] = useState([]); // State to store dashboards
  const [dataSources, setDataSources] = useState([]); // State to store datasources
  const [error, setError] = useState(""); // State to handle errors
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get user info from AuthContext
  const navigate = useNavigate(); // Navigation hook

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Pass JWT token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data.");
      }

      const data = await response.json();
      console.log(data);

      setDashboards(data.data[0]?.dashboards || []); // Assuming dashboards structure
      setDataSources(data.data[0]?.datasources || []); // Assuming datasources structure
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.token]);

  const handleDashboardSelect = (id, type) => {
    navigate(`/dashboard/${type}/${id}`);
  };

  const handleDeleteClick = async (event, dashboardId) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/dashboard/${dashboardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete dashboard');
      }

      fetchData(); // Refresh the dashboards list
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the dashboard');
    }
  };

  const getTypeForDashboard = (dashboard) => {
    const dataSource = dataSources.find(
      (source) => source._id === dashboard.datasource
    );
    return dataSource?.type || "Unknown";
  };

  const getIconForType = (type) => {
    switch (type.toLowerCase()) {
      case "prometheus":
        return <TimelineIcon sx={{ fontSize: 20 }} />;
      case "csv":
        return <TableChartIcon sx={{ fontSize: 20 }} />;
      case "loki":
        return <AnalyticsIcon sx={{ fontSize: 20 }} />;
      default:
        return <DashboardIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getColorForType = (type) => {
    switch (type.toLowerCase()) {
      case "prometheus":
        return "#667eea";
      case "csv":
        return "#f093fb";
      case "loki":
        return "#43e97b";
      default:
        return "#764ba2";
    }
  };

  const getGradientForType = (type) => {
    switch (type.toLowerCase()) {
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
                        <DashboardIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <GradientText
                        colors={["#667eea", "#764ba2", "#f093fb"]}
                        animationSpeed={4}
                        showBorder={false}
                        className="text-2xl font-bold"
                      >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", margin: 0 }}>
                          Your Dashboards
                        </Typography>
                      </GradientText>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                      Manage and monitor your data visualizations. Create powerful dashboards to gain insights from your connected data sources.
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
                          {dashboards.length} Active Dashboard{dashboards.length !== 1 ? 's' : ''}
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
                          {dataSources.length} Connected Source{dataSources.length !== 1 ? 's' : ''}
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
                      onClick={() => navigate("/dashboards/add")}
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
                      Create New Dashboard
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

              {/* Dashboard Cards */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading dashboards...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {dashboards.map((dashboard, index) => {
                    const type = getTypeForDashboard(dashboard);
                    return (
                      <Grid item xs={12} sm={6} lg={4} key={dashboard._id}>
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
                              spotlightColor={`${getColorForType(type)}40`}
                              className="dashboard-card"
                            >
                              <ClickSpark
                                sparkColor={getColorForType(type)}
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
                                    border: `1px solid ${getColorForType(type)}30`,
                                    borderRadius: 3,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden",
                                    "&:hover": {
                                      transform: "translateY(-8px)",
                                      boxShadow: `0 20px 60px ${getColorForType(type)}30`,
                                      borderColor: `${getColorForType(type)}60`,
                                      "& .dashboard-icon": {
                                        transform: "scale(1.1) rotate(5deg)",
                                      },
                                      "& .dashboard-glow": {
                                        opacity: 1,
                                      }
                                    },
                                  }}
                                  onClick={() => handleDashboardSelect(dashboard._id, type)}
                                >
                                  {/* Hover glow effect */}
                                  <Box
                                    className="dashboard-glow"
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: "50%",
                                      background: getGradientForType(type),
                                      opacity: 0,
                                      transition: "opacity 0.3s ease",
                                      pointerEvents: "none",
                                    }}
                                  />
                                  
                                  <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                      <Box
                                        className="dashboard-icon"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: 48,
                                          height: 48,
                                          borderRadius: 2,
                                          background: getGradientForType(type),
                                          color: "white",
                                          mr: 2,
                                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                          boxShadow: `0 4px 20px ${getColorForType(type)}40`,
                                        }}
                                      >
                                        {getIconForType(type)}
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
                                          {dashboard.name}
                                        </Typography>
                                        <Chip
                                          label={type.toUpperCase()}
                                          size="small"
                                          sx={{
                                            background: `${getColorForType(type)}20`,
                                            color: getColorForType(type),
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            height: 20,
                                            border: `1px solid ${getColorForType(type)}40`,
                                          }}
                                        />
                                      </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                      <TrendingUpIcon 
                                        sx={{ 
                                          fontSize: 16, 
                                          color: "text.secondary", 
                                          mr: 1 
                                        }} 
                                      />
                                      <Typography variant="body2" color="text.secondary">
                                        Last updated: {new Date().toLocaleDateString()}
                                      </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Click to view details
                                      </Typography>
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
                                            handleDeleteClick(e, dashboard._id);
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
                                  </CardContent>
                                </Card>
                              </ClickSpark>
                            </SpotlightCard>
                          </Box>
                        </Fade>
                      </Grid>
                    );
                  })}
                </Grid>
              )}

              {/* Empty State */}
              {!loading && dashboards.length === 0 && (
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
                      <DashboardIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                    </Box>
                    <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Dashboards Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                      Create your first dashboard to start visualizing your data. Connect your data sources and build powerful analytics dashboards.
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
                        onClick={() => navigate("/dashboards/add")}
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
                        Create Your First Dashboard
                      </Button>
                    </ClickSpark>
                  </Paper>
                </Fade>
              )}
            </Container>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
