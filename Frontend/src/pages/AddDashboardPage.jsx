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
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { alpha, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DatasetIcon from "@mui/icons-material/Dataset";
import WidgetsIcon from "@mui/icons-material/Widgets";
import CreateIcon from "@mui/icons-material/Create";
import TimelineIcon from "@mui/icons-material/Timeline";
import TableChartIcon from "@mui/icons-material/TableChart";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BarChartIcon from "@mui/icons-material/BarChart";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import Header from "../components/DashboardsPageComponents/Header";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha("#667eea", 0.3)}`
    : `1px solid ${alpha("#e2e8f0", 0.6)}`,
  borderRadius: "24px",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 20px 40px rgba(0, 0, 0, 0.3)"
    : "0 20px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 30% 30%, #667eea15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #f093fb10 0%, transparent 50%)'
      : 'radial-gradient(circle at 30% 30%, #667eea08 0%, transparent 50%), radial-gradient(circle at 70% 70%, #f093fb06 0%, transparent 50%)',
    pointerEvents: "none",
    borderRadius: "24px",
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
      ? alpha('#1e293b', 0.4)
      : alpha('#ffffff', 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#667eea', 0.2)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: alpha('#667eea', 0.4),
      boxShadow: `0 8px 32px ${alpha('#667eea', 0.15)}`,
    },
    '&.Mui-focused': {
      borderColor: '#667eea',
      boxShadow: `0 8px 32px ${alpha('#667eea', 0.25)}`,
      background: theme.palette.mode === 'dark'
        ? alpha('#1e293b', 0.6)
        : alpha('#ffffff', 0.9),
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
      ? alpha('#1e293b', 0.4)
      : alpha('#ffffff', 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#667eea', 0.2)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: alpha('#667eea', 0.4),
      boxShadow: `0 8px 32px ${alpha('#667eea', 0.15)}`,
    },
    '&.Mui-focused': {
      borderColor: '#667eea',
      boxShadow: `0 8px 32px ${alpha('#667eea', 0.25)}`,
      background: theme.palette.mode === 'dark'
        ? alpha('#1e293b', 0.6)
        : alpha('#ffffff', 0.9),
    }
  }
}));

const WidgetTypeCard = styled(Paper)(({ theme, selected }) => ({
  padding: '20px',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected
    ? (theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)')
    : (theme.palette.mode === 'dark'
        ? alpha('#1e293b', 0.4)
        : alpha('#ffffff', 0.7)),
  backdropFilter: 'blur(10px)',
  border: selected
    ? `2px solid ${alpha('#667eea', 0.5)}`
    : `1px solid ${alpha('#667eea', 0.2)}`,
  boxShadow: selected
    ? `0 12px 40px ${alpha('#667eea', 0.3)}`
    : `0 4px 20px ${alpha('#000000', 0.05)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: alpha('#667eea', 0.4),
    boxShadow: `0 16px 48px ${alpha('#667eea', 0.2)}`,
  }
}));

export default function AddDashboardPage() {
  const [dataSources, setDataSources] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [widgetType, setWidgetType] = useState("");
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const widgetTypes = [
    {
      value: "chart",
      label: "Line Chart",
      description: "Perfect for time-series data and trends",
      icon: <ShowChartIcon sx={{ fontSize: 32 }} />,
      color: "#667eea"
    },
    {
      value: "table",
      label: "Data Table",
      description: "Structured view of your raw data",
      icon: <TableChartIcon sx={{ fontSize: 32 }} />,
      color: "#f093fb"
    },
    {
      value: "graph",
      label: "Bar Chart",
      description: "Compare values across categories",
      icon: <BarChartIcon sx={{ fontSize: 32 }} />,
      color: "#43e97b"
    }
  ];

  useEffect(() => {
    const fetchDataSources = async () => {
      setLoading(true);
      try {
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
          throw new Error(errorData.message || "Failed to fetch data sources.");
        }

        const data = await response.json();
        setDataSources(data.data[0]?.datasources || []);
      } catch (err) {
        console.error("Error fetching data sources:", err);
        setError(err.message || "An error occurred while fetching data sources.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, [user?.token]);

  const handleCreateDashboard = async () => {
    if (!dashboardName || !widgetType || !selectedDataSource) {
      setError("Please fill in all the fields.");
      return;
    }

    setCreating(true);
    setError("");

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
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create dashboard.");
      }

      // Success animation delay before navigation
      setTimeout(() => {
        navigate("/dashboards");
      }, 1000);
    } catch (err) {
      console.error("Error creating dashboard:", err);
      setError(err.message || "An error occurred while creating the dashboard.");
      setCreating(false);
    }
  };

  const getDataSourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus":
        return <TimelineIcon sx={{ fontSize: 20, color: "#667eea" }} />;
      case "csv":
        return <TableChartIcon sx={{ fontSize: 20, color: "#f093fb" }} />;
      case "loki":
        return <AnalyticsIcon sx={{ fontSize: 20, color: "#43e97b" }} />;
      default:
        return <DatasetIcon sx={{ fontSize: 20, color: "#764ba2" }} />;
    }
  };

  const getDataSourceColor = (type) => {
    switch (type?.toLowerCase()) {
      case "prometheus": return "#667eea";
      case "csv": return "#f093fb";
      case "loki": return "#43e97b";
      default: return "#764ba2";
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.5)'
        }}
        open={creating}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Creating Your Dashboard...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we set up everything for you
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ display: "flex" }}>
        <SideMenu />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            minHeight: "100vh",
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 20% 80%, #667eea20 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f093fb15 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b10 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 80%, #667eea10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f093fb08 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b06 0%, transparent 50%)',
              pointerEvents: "none",
              zIndex: 0,
            }
          }}
        >
          <AppNavbar />
          
          <Container 
            maxWidth="lg" 
            sx={{ 
              position: "relative", 
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 80px)",
              py: 4
            }}
          >
            <Stack 
              spacing={4} 
              sx={{ 
                width: "100%",
                maxWidth: 800,
                alignItems: "center"
              }}
                         >
               {/* Page Header */}
              <Fade in={true} timeout={800}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      mb: 3,
                      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-10px)" }
                      }
                    }}
                  >
                    <CreateIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  
                  <GradientText
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                      Create New Dashboard
                    </Typography>
                  </GradientText>
                  
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: 600, 
                      mx: "auto", 
                      fontSize: "1.1rem",
                      lineHeight: 1.6
                    }}
                  >
                    Build powerful data visualizations by connecting your data sources 
                    and choosing the perfect widget type for your insights.
                  </Typography>
                </Box>
              </Fade>

              {/* Error Alert */}
              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    onClose={() => setError("")}
                    sx={{
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(244, 67, 54, 0.2)",
                    }}
                  >
                    <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
                    {error}
                  </Alert>
                </Fade>
              )}

                             {/* Main Form */}
               <Fade in={true} timeout={1000}>
                 <StyledCard 
                   elevation={0} 
                   sx={{ 
                     width: "100%",
                     maxWidth: 800
                   }}
                 >
                  <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                    <Stack spacing={4}>
                      {/* Step 1: Data Source Selection */}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "1.1rem"
                            }}
                          >
                            1
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Select Data Source
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Choose the data source you want to visualize
                            </Typography>
                          </Box>
                        </Box>

                        {loading ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                            <CircularProgress size={24} />
                            <Typography color="text.secondary">Loading data sources...</Typography>
                          </Box>
                        ) : (
                          <StyledFormControl fullWidth>
                            <InputLabel>Select Data Source</InputLabel>
                            <Select
                              value={selectedDataSource}
                              onChange={(e) => setSelectedDataSource(e.target.value)}
                              label="Select Data Source"
                              startAdornment={
                                <InputAdornment position="start">
                                  <DatasetIcon sx={{ color: "text.secondary" }} />
                                </InputAdornment>
                              }
                            >
                              {dataSources.map((dataSource) => (
                                <MenuItem key={dataSource._id} value={dataSource._id}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                    {getDataSourceIcon(dataSource.type)}
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography sx={{ fontWeight: 500 }}>
                                        {dataSource.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {dataSource.type || "Unknown Type"}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={dataSource.type || "Unknown"}
                                      size="small"
                                      sx={{
                                        background: `linear-gradient(135deg, ${getDataSourceColor(dataSource.type)}20, ${getDataSourceColor(dataSource.type)}10)`,
                                        color: getDataSourceColor(dataSource.type),
                                        border: `1px solid ${getDataSourceColor(dataSource.type)}40`,
                                      }}
                                    />
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </StyledFormControl>
                        )}
                      </Box>

                      {/* Step 2: Dashboard Name */}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #764ba2, #f093fb)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "1.1rem"
                            }}
                          >
                            2
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Dashboard Name
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Give your dashboard a descriptive name
                            </Typography>
                          </Box>
                        </Box>

                        <StyledTextField
                          label="Dashboard Name"
                          value={dashboardName}
                          onChange={(e) => setDashboardName(e.target.value)}
                          fullWidth
                          placeholder="e.g., Sales Analytics, System Monitoring, User Metrics"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DashboardIcon sx={{ color: "text.secondary" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      {/* Step 3: Widget Type Selection */}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #f093fb, #43e97b)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "1.1rem"
                            }}
                          >
                            3
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Choose Widget Type
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Select how you want to visualize your data
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={3}>
                          {widgetTypes.map((widget) => (
                            <Grid item xs={12} md={4} key={widget.value}>
                              <ClickSpark
                                sparkColor={widget.color}
                                sparkCount={6}
                                sparkSize={8}
                                sparkRadius={15}
                                duration={500}
                              >
                                <WidgetTypeCard
                                  selected={widgetType === widget.value}
                                  onClick={() => setWidgetType(widget.value)}
                                  elevation={0}
                                >
                                  <Box sx={{ textAlign: "center" }}>
                                    <Box
                                      sx={{
                                        color: widget.color,
                                        mb: 2,
                                        filter: `drop-shadow(0 4px 8px ${widget.color}40)`,
                                      }}
                                    >
                                      {widget.icon}
                                    </Box>
                                    <Typography 
                                      variant="h6" 
                                      sx={{ 
                                        fontWeight: 600, 
                                        mb: 1,
                                        color: widgetType === widget.value ? widget.color : "text.primary"
                                      }}
                                    >
                                      {widget.label}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary"
                                      sx={{ fontSize: "0.9rem", lineHeight: 1.4 }}
                                    >
                                      {widget.description}
                                    </Typography>
                                  </Box>
                                </WidgetTypeCard>
                              </ClickSpark>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Create Button */}
                      <Box sx={{ pt: 2 }}>
                        <ClickSpark
                          sparkColor="#667eea"
                          sparkCount={12}
                          sparkSize={12}
                          sparkRadius={30}
                          duration={800}
                        >
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleCreateDashboard}
                            disabled={!dashboardName || !widgetType || !selectedDataSource || creating}
                            sx={{
                              py: 2,
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              textTransform: "none",
                              borderRadius: 3,
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                                boxShadow: "0 16px 48px rgba(102, 126, 234, 0.5)",
                                transform: "translateY(-2px)",
                              },
                              "&:disabled": {
                                background: "linear-gradient(135deg, #94a3b8, #64748b)",
                                boxShadow: "none",
                                transform: "none",
                              },
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            {creating ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <CircularProgress size={24} color="inherit" />
                                Creating Dashboard...
                              </Box>
                            ) : (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CreateIcon />
                                Create Dashboard
                              </Box>
                            )}
                          </Button>
                        </ClickSpark>
                      </Box>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Fade>
            </Stack>
          </Container>
        </Box>
      </Box>
    </div>
  );
}
