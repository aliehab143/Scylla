import { useEffect, useState, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaunchIcon from '@mui/icons-material/Launch';
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

export default function AuthUserMainPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboards, setDashboards] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [datacorrelations, setdatacorrelations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const quickActions = [
    {
      title: "Create Dashboard",
      description: "Build interactive dashboards",
      icon: AddIcon,
      color: "#667eea",
      bgColor: "rgba(102, 126, 234, 0.1)",
      path: "/dashboards/add",
      sparkColor: "#667eea"
    },
    {
      title: "Add Data Source",
      description: "Connect new data sources",
      icon: StorageIcon,
      color: "#43e97b",
      bgColor: "rgba(67, 233, 123, 0.1)",
      path: "/datasources/add",
      sparkColor: "#43e97b"
    },
    {
      title: "View Dashboards",
      description: "Browse all dashboards",
      icon: ViewListIcon,
      color: "#f093fb",
      bgColor: "rgba(240, 147, 251, 0.1)",
      path: "/dashboards",
      sparkColor: "#f093fb"
    },
    {
      title: "Correlate Data",
      description: "Create data correlations",
      icon: LinkIcon,
      color: "#764ba2",
      bgColor: "rgba(118, 75, 162, 0.1)",
      path: "/datasources/correlate",
      sparkColor: "#764ba2"
    }
  ];

  const recentDashboards = dashboards.slice(0, 3);

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideMenu />
        <AppNavbar />
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

            {/* Welcome Section */}
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: "1200px",
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
                position: "relative",
                overflow: "hidden",
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

              <Box sx={{ display: "flex", alignItems: "center", gap: 3, position: "relative", zIndex: 1 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <GradientText
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="text-4xl font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", margin: 0, mb: 1 }}>
                      Welcome back!
                    </Typography>
                  </GradientText>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                    {user?.email || 'Analytics Platform User'}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                      label="System Online"
                      sx={{
                        background: "linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(67, 233, 123, 0.05))",
                        border: "1px solid rgba(67, 233, 123, 0.3)",
                        color: "#43e97b",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                      label="Last login: Today"
                      sx={{
                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))",
                        border: "1px solid rgba(102, 126, 234, 0.3)",
                        color: "#667eea",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Grid container spacing={3} sx={{ width: "100%", maxWidth: "1200px" }}>
              {error ? (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))",
                      border: "1px solid rgba(244, 67, 54, 0.2)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="error.main" sx={{ fontWeight: 600 }}>
                      {error}
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                <>
                  {/* Statistics Cards */}
                  <Grid item xs={12} md={4}>
                    <Fade in={true} timeout={300}>
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          background: (theme) => theme.palette.mode === 'dark'
                            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                            : "0 20px 40px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                width: 48,
                                height: 48,
                              }}
                            >
                              <DashboardIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, color: "#667eea" }}>
                        {dashboards.length}
                      </Typography>
                              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Dashboards
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TrendingUpIcon sx={{ fontSize: 16, color: "#43e97b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Active and ready
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Fade in={true} timeout={400}>
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          background: (theme) => theme.palette.mode === 'dark'
                            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(67, 233, 123, 0.3)",
                          boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                            : "0 20px 40px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                                width: 48,
                                height: 48,
                              }}
                            >
                              <StorageIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, color: "#43e97b" }}>
                        {dataSources.length}
                      </Typography>
                              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Data Sources
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#43e97b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Connected & synced
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Fade in={true} timeout={500}>
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          background: (theme) => theme.palette.mode === 'dark'
                            ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(240, 147, 251, 0.3)",
                          boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                            : "0 20px 40px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                background: "linear-gradient(135deg, #f093fb, #f5576c)",
                                width: 48,
                                height: 48,
                              }}
                            >
                              <LinkIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, color: "#f093fb" }}>
                        {datacorrelations.length}
                      </Typography>
                              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Correlations
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AssessmentIcon sx={{ fontSize: 16, color: "#f093fb" }} />
                            <Typography variant="body2" color="text.secondary">
                              Analyzing patterns
                            </Typography>
                      </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  {/* Quick Actions */}
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                      {quickActions.map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                          <Grid item xs={12} sm={6} md={3} key={action.title}>
                            <Fade in={true} timeout={600 + index * 100}>
                              <Box>
                                <SpotlightCard
                                  spotlightColor={`${action.color}40`}
                                  className="action-card"
                                >
                                  <ClickSpark
                                    sparkColor={action.sparkColor}
                                    sparkCount={6}
                                    sparkSize={8}
                                    sparkRadius={20}
                                    duration={500}
                                  >
                                    <Card
                                      onClick={() => navigate(action.path)}
                                      sx={{
                                        cursor: 'pointer',
                                        borderRadius: 3,
                                        background: (theme) => theme.palette.mode === 'dark'
                                          ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                                        backdropFilter: "blur(20px)",
                                        border: `1px solid ${action.color}30`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                          transform: 'translateY(-4px)',
                                          border: `1px solid ${action.color}`,
                                          boxShadow: `0 20px 40px ${action.color}20`,
                                        },
                                      }}
                                    >
                                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Avatar
                                          sx={{
                                            width: 56,
                                            height: 56,
                                            background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                                            mb: 2,
                                            mx: 'auto',
                                          }}
                                        >
                                          <IconComponent sx={{ fontSize: 28 }} />
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: action.color }}>
                                          {action.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                          {action.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                          <LaunchIcon sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.7 }} />
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
                  </Grid>

                  {/* Recent Dashboards */}
                  {recentDashboards.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Recent Dashboards
                      </Typography>
                      <Grid container spacing={2}>
                        {recentDashboards.map((dashboard, index) => (
                          <Grid item xs={12} md={4} key={dashboard._id}>
                            <Fade in={true} timeout={700 + index * 100}>
                              <Card
                                onClick={() => navigate(`/dashboard/${dashboard.sourceType}/${dashboard._id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  borderRadius: 3,
                                  background: (theme) => theme.palette.mode === 'dark'
                                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                                  backdropFilter: "blur(20px)",
                                  border: "1px solid rgba(102, 126, 234, 0.2)",
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    border: "1px solid rgba(102, 126, 234, 0.4)",
                                    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.2)",
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar
                                      sx={{
                                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                                        width: 40,
                                        height: 40,
                                      }}
                                    >
                                      <DashboardIcon sx={{ fontSize: 20 }} />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {dashboard.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {dashboard.sourceType?.toUpperCase()} Dashboard
                                      </Typography>
                                    </Box>
                                    <LaunchIcon sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.7 }} />
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {dashboard.description || 'Interactive data visualization'}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Fade>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
