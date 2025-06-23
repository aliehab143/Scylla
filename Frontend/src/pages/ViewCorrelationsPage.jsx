import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import CorrelationCard from "../components/CorrelationComponents/CorrelationCard";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import LinkIcon from "@mui/icons-material/Link";
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

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
            "ngrok-skip-browser-warning": "true",
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
                        <ViewListIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Box sx={{ overflow: "visible" }}>
                        <GradientText
                          colors={["#667eea", "#764ba2", "#f093fb"]}
                          animationSpeed={4}
                          showBorder={false}
                          className="text-2xl font-bold"
                        >
                          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", margin: 0, lineHeight: 1.2, overflow: "visible" }}>
                            View Correlations
                          </Typography>
                        </GradientText>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                      View and manage your data source correlations. Each correlation represents a connection between different data sources for unified analysis.
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
                          {correlations.length} Active Correlation{correlations.length !== 1 ? 's' : ''}
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
                          {allDataSources.length} Connected Source{allDataSources.length !== 1 ? 's' : ''}
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
                      onClick={() => navigate("/datasources/correlate")}
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
                      Create Correlation
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

              {/* Correlations Grid */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Loading correlations...
                  </Typography>
                </Box>
              ) : correlations.length === 0 ? (
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
                      <LinkIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                    </Box>
                    <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Correlations Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                      Create your first correlation to connect your data sources and enable unified analysis across different observability platforms.
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
                        onClick={() => navigate("/datasources/correlate")}
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
                        Create Your First Correlation
                      </Button>
                    </ClickSpark>
                  </Paper>
                </Fade>
              ) : (
                <Grid container spacing={3}>
                  {correlations.map((correlation, index) => (
                    <Grid item xs={12} md={6} key={correlation._id}>
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
                            spotlightColor="#667eea40"
                            className="correlation-card"
                          >
                            <ClickSpark
                              sparkColor="#667eea"
                              sparkCount={6}
                              sparkSize={8}
                              sparkRadius={20}
                              duration={500}
                            >
                              <CorrelationCard 
                                correlation={correlation}
                                dataSources={allDataSources}
                              />
                            </ClickSpark>
                          </SpotlightCard>
                        </Box>
                      </Fade>
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