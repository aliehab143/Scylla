import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext"; // Adjust path as needed
import { BASE_URL } from "../constants/constants";
import Header from "../components/DashboardsPageComponents/Header";

export default function AddDashboardPage() {
  const [dataSources, setDataSources] = useState([]); // State to store data sources
  const [error, setError] = useState(""); // State to handle errors
  const [dashboardName, setDashboardName] = useState(""); // Dashboard name
  const [widgetType, setWidgetType] = useState(""); // Widget type
  const [selectedDataSource, setSelectedDataSource] = useState(""); // Selected data source ID
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user info from AuthContext

  // Fetch data sources on page load
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data sources.");
        }

        const data = await response.json();
        setDataSources(data.data[0]?.datasources || []); // Assuming the data structure
      } catch (err) {
        console.error("Error fetching data sources:", err);
        setError(err.message || "An error occurred while fetching data sources.");
      }
    };

    fetchDataSources();
  }, [user?.token]);

  // Handle creating a dashboard for a selected data source
  const handleCreateDashboard = async () => {
    if (!dashboardName || !widgetType || !selectedDataSource) {
      setError("Please fill in all the fields.");
      return;
    }

    const payload = {
      name: dashboardName,
      widgets: [
        {
          widget_type: widgetType,
        },
      ],
    };

    try {
      const response = await fetch(`${BASE_URL}/dashboard/${selectedDataSource}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create dashboard.");
      }

      navigate("/dashboards"); // Navigate to dashboards page
    } catch (err) {
      console.error("Error creating dashboard:", err);
      setError(err.message || "An error occurred while creating the dashboard.");
    }
  };

  return (
    <div>
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
            <Header />

            {/* Page Content */}
            <Card
              elevation={3}
              sx={{
                maxWidth: 600,
                width: "100%",
                p: 3,
                borderRadius: 2,
                mt: 4,
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                >
                  Create a New Dashboard
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, textAlign: "center" }}
                >
                  Fill in the details below to create a new dashboard for your data visualization.
                </Typography>

                {/* Error Message */}
                {error && (
                  <Typography color="error" sx={{ mb: 3, textAlign: "center" }}>
                    {error}
                  </Typography>
                )}

                {/* Form */}
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Select Data Source</InputLabel>
                    <Select
                      value={selectedDataSource}
                      onChange={(e) => setSelectedDataSource(e.target.value)}
                      label="Select Data Source"
                      required
                    >
                      {dataSources.map((dataSource) => (
                        <MenuItem key={dataSource._id} value={dataSource._id}>
                          {dataSource.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Dashboard Name"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.secondary">📊</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Widget Type</InputLabel>
                    <Select
                      value={widgetType}
                      onChange={(e) => setWidgetType(e.target.value)}
                      label="Widget Type"
                      required
                    >
                      <MenuItem value="chart">Chart</MenuItem>
                      <MenuItem value="table">Table</MenuItem>
                      <MenuItem value="graph">Graph</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCreateDashboard}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontSize: "1.1rem",
                      textTransform: "none",
                    }}
                  >
                    Create Dashboard
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
