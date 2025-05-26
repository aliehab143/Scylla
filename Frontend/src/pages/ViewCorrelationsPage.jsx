import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import Container from "@mui/material/Container";
import CorrelationCard from "../components/CorrelationComponents/CorrelationCard";

export default function ViewCorrelationsPage() {
  const [correlations, setCorrelations] = useState([]);
  const [allDataSources, setAllDataSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        
        if (responseData.data && responseData.data[0]) {
          const userData = responseData.data[0];
          setAllDataSources(userData.datasources || []);
          setCorrelations(userData.datacorrelations || []);
        } else {
          setCorrelations([]);
          setAllDataSources([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setCorrelations([]);
        setAllDataSources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

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
            spacing={3}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Container maxWidth="lg">
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: "bold",
                    mb: 1,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  View Correlations
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ maxWidth: 800 }}
                >
                  View and manage your data source correlations. Each correlation represents a connection between different data sources, allowing you to analyze related data together.
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading correlations...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'error.light', 
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : correlations.length === 0 ? (
                <Box sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  <Typography variant="h6" color="text.secondary">
                    No correlations found. Create your first correlation to get started!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {correlations.map((correlation) => (
                    <Grid item xs={12} md={6} key={correlation._id}>
                      <CorrelationCard 
                        correlation={correlation}
                        dataSources={allDataSources}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Container>
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 