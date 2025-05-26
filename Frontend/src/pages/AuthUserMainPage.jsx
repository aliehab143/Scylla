import { useEffect, useState, useContext } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { Line } from "react-chartjs-2";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

export default function AuthUserMainPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboards, setDashboards] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [datacorrelations, setdatacorrelations] = useState([]);
  const [error, setError] = useState("");

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Anomalies Detected",
        data: [5, 10, 7, 15, 12],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data.");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        setDashboards(data.data[0]?.dashboards || []);
        setDataSources(data.data[0]?.datasources || []);
        setdatacorrelations(data.data[0]?.datacorrelations || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [user?.token]);

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
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
            <Grid container spacing={2}>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <>
                  {/* Summary Widgets */}
                  <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Total Dashboards</Typography>
                      <Typography variant="h4" color="primary">
                        {dashboards.length}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Total Data Sources</Typography>
                      <Typography variant="h4" color="primary">
                        {dataSources.length}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Total Data Correlations</Typography>
                      <Typography variant="h4" color="primary">
                        {datacorrelations.length}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Chart Section */}
                  <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">Anomalies Over Time</Typography>
                      <Box sx={{ height: 300 }}>
                        <Line data={chartData} options={chartOptions} />
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Quick Actions */}
                  <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6">Quick Actions</Typography>
                      <Stack spacing={2} mt={2}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => navigate("/dashboards")}
                        >
                          Go to Dashboards
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate("/datasources/add")}
                        >
                          Add New Data Source
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate("/reports")}
                        >
                          View Reports
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
