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
import AddIcon from "@mui/icons-material/Add";
import StorageIcon from "@mui/icons-material/Storage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideMenu from "../components/DashboardsPageComponents/SideMenu"; // Adjust path as needed
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar"; // Adjust path as needed
import Header from "../components/DashboardsPageComponents/Header"; // Adjust path as needed
import EditDataSourceDialog from "../components/EditDataSourceDialog";
import { AuthContext } from "../context/Auth/AuthContext"; // Adjust path as needed
import { BASE_URL } from "../constants/constants";

export default function UserDataSources() {
  const [dataSources, setDataSources] = useState([]); // State to store data sources
  const [error, setError] = useState(""); // State to handle errors
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { user } = useContext(AuthContext); // Get user info from AuthContext
  const navigate = useNavigate(); // Navigation hook

  const fetchDataSources = async () => {
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
        throw new Error(errorData.message || "Failed to fetch data sources.");
      }

      const data = await response.json();
      console.log(data);
      setDataSources(data.data[0]?.datasources || []); // Assuming data structure
    } catch (err) {
      console.error("Error fetching data sources:", err);
      setError(err.message || "An error occurred while fetching data sources.");
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
      const response = await fetch(`${BASE_URL}/datasource/${dataSource._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete data source');
      }

      fetchDataSources();
    } catch (err) {
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

  const getColorForType = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus":
        return "primary";
      case "csv":
        return "secondary";
      case "loki":
        return "success";
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
                    Your Data Sources
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Manage and configure your data sources for analytics.
                  </Typography>
                </Box>
                <Tooltip title="Add New Data Source">
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/datasources/add")}
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
                {dataSources.map((dataSource) => (
                  <Grid item xs={12} sm={6} md={4} key={dataSource._id}>
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
                              backgroundColor: `${getColorForType(dataSource.type)}.light`,
                              color: `${getColorForType(dataSource.type)}.contrastText`,
                              mr: 2,
                            }}
                          >
                            <StorageIcon />
                          </Box>
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {dataSource.name}
                          </Typography>
                          <Chip
                            label={dataSource.type}
                            size="small"
                            color={getColorForType(dataSource.type)}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Host: {dataSource.hostURL || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Last updated: {new Date().toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        {dataSource.type?.toLowerCase() !== "csv" && (
                          <Tooltip title="Edit Data Source">
                            <IconButton
                              size="small"
                              onClick={(e) => handleEditClick(e, dataSource)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: "primary.light",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Data Source">
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteClick(e, dataSource)}
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
                ))}
              </Grid>

              {dataSources.length === 0 && (
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
                  <StorageIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Data Sources Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add your first data source to start collecting and analyzing data.
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => navigate("/datasources/add")}
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

      <EditDataSourceDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        dataSource={selectedDataSource}
        onUpdate={handleDataSourceUpdate}
      />
    </div>
  );
}
