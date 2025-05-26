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
import AddIcon from "@mui/icons-material/Add";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TableChartIcon from "@mui/icons-material/TableChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import SideMenu from "../components/DashboardsPageComponents/SideMenu"; // Adjust path as needed
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar"; // Adjust path as needed
import Header from "../components/DashboardsPageComponents/Header"; // Adjust path as needed
import { AuthContext } from "../context/Auth/AuthContext"; // Adjust path as needed
import { BASE_URL } from "../constants/constants";

export default function DashboardSelectPage() {
  const [dashboards, setDashboards] = useState([]); // State to store dashboards
  const [dataSources, setDataSources] = useState([]); // State to store datasources
  const [error, setError] = useState(""); // State to handle errors
  const { user } = useContext(AuthContext); // Get user info from AuthContext
  const navigate = useNavigate(); // Navigation hook

  const fetchData = async () => {
    try {
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
        return <TimelineIcon />;
      case "csv":
        return <TableChartIcon />;
      default:
        return <AnalyticsIcon />;
    }
  };

  const getColorForType = (type) => {
    switch (type.toLowerCase()) {
      case "prometheus":
        return "primary";
      case "csv":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div>
      {/* Apply baseline styles */}
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        {/* Side Menu */}
        <SideMenu />

        {/* Main Content */}
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
          {/* App Navbar */}
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
            {/* Header */}
            <Header />

            {/* Page Content */}
            <Container maxWidth="lg">
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                    Your Dashboards
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Select a dashboard to view detailed analytics and metrics.
                  </Typography>
                </Box>
                <Tooltip title="Add New Dashboard">
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/dashboards/add")}
                    sx={{
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Handle errors */}
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Grid container spacing={3}>
                {dashboards.map((dashboard) => {
                  const type = getTypeForDashboard(dashboard);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={dashboard._id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleDashboardSelect(dashboard._id, type)}
                          sx={{ flexGrow: 1 }}
                        >
                          <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  backgroundColor: `${getColorForType(type)}.light`,
                                  color: `${getColorForType(type)}.contrastText`,
                                  mr: 2,
                                }}
                              >
                                {getIconForType(type)}
                              </Box>
                              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {dashboard.name}
                              </Typography>
                              <Chip
                                label={type}
                                size="small"
                                color={getColorForType(type)}
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Last updated: {new Date().toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                          <Tooltip title="Delete Dashboard">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDeleteClick(e, dashboard._id)}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "error.light",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {dashboards.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <AnalyticsIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Dashboards Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first dashboard to start visualizing your data.
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/dashboards/add")}
                    sx={{
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
            </Container>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
