import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha, styled } from "@mui/material/styles";
import FeedIcon from "@mui/icons-material/Feed";
import StorageIcon from "@mui/icons-material/Storage";
import HttpIcon from "@mui/icons-material/Http";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha("#43e97b", 0.3)}`
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
      ? 'radial-gradient(circle at 30% 30%, #43e97b15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #667eea10 0%, transparent 50%)'
      : 'radial-gradient(circle at 30% 30%, #43e97b08 0%, transparent 50%), radial-gradient(circle at 70% 70%, #667eea06 0%, transparent 50%)',
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
    border: `1px solid ${alpha('#43e97b', 0.2)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: alpha('#43e97b', 0.4),
      boxShadow: `0 8px 32px ${alpha('#43e97b', 0.15)}`,
    },
    '&.Mui-focused': {
      borderColor: '#43e97b',
      boxShadow: `0 8px 32px ${alpha('#43e97b', 0.25)}`,
      background: theme.palette.mode === 'dark'
        ? alpha('#1e293b', 0.6)
        : alpha('#ffffff', 0.9),
    }
  }
}));

export default function LokiDataSourceFormPage() {
  const { user } = useContext(AuthContext);
  const type = "loki";
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !host) {
      setError("Both name and host URL are required.");
      return;
    }

    setLoading(true);

    const formData = {
      name: name,
      hostURL: host,
      type: type,
    };

    try {
      const response = await fetch(`${BASE_URL}/datasource/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create the data source.");
      }

      setSuccess("Data source added successfully!");
      setName("");
      setHost("");

      setTimeout(() => navigate("/datasources/view"), 2000);
    } catch (err) {
      console.error("Error adding data source:", err);
      setError(err.message || "An error occurred while adding the data source.");
    } finally {
      setLoading(false);
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
        open={loading}
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
            Creating Loki Data Source...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we configure your connection
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ display: "flex" }}>
        <SideMenu />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
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
                ? 'radial-gradient(circle at 20% 80%, #43e97b20 0%, transparent 50%), radial-gradient(circle at 80% 20%, #667eea15 0%, transparent 50%), radial-gradient(circle at 40% 40%, #f093fb10 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 80%, #43e97b10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #667eea08 0%, transparent 50%), radial-gradient(circle at 40% 40%, #f093fb06 0%, transparent 50%)',
              pointerEvents: "none",
              zIndex: 0,
            }
          }}
        >
          <AppNavbar />
          
          <Container 
            maxWidth="md" 
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
                maxWidth: 600,
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
                      background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                      mb: 3,
                      boxShadow: "0 20px 40px rgba(67, 233, 123, 0.3)",
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-10px)" }
                      }
                    }}
                  >
                    <FeedIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  
                  <GradientText
                    colors={["#43e97b", "#38f9d7", "#667eea"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                      Loki Data Source
                    </Typography>
                  </GradientText>
                  
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: 500, 
                      mx: "auto", 
                      fontSize: "1.1rem",
                      lineHeight: 1.6
                    }}
                  >
                    Connect your Loki log aggregation system to create comprehensive 
                    log analysis and monitoring dashboards.
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

              {/* Success Alert */}
              {success && (
                <Fade in={!!success}>
                  <Alert 
                    severity="success"
                    sx={{
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                    }}
                  >
                    <AlertTitle sx={{ fontWeight: 600 }}>Success</AlertTitle>
                    {success}
                  </Alert>
                </Fade>
              )}

              {/* Main Form */}
              <Fade in={true} timeout={1000}>
                <StyledCard elevation={0} sx={{ width: "100%" }}>
                  <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        {/* Step 1: Data Source Name */}
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #43e97b, #38f9d7)",
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
                                Data Source Name
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Give your Loki data source a descriptive name
                              </Typography>
                            </Box>
                          </Box>

                          <StyledTextField
                            label="Data Source Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            placeholder="e.g., Application Logs, System Logs, Error Tracking"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <StorageIcon sx={{ color: "text.secondary" }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        {/* Step 2: Host URL */}
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #38f9d7, #667eea)",
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
                                Loki Host URL
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Enter the URL where your Loki server is accessible
                              </Typography>
                            </Box>
                          </Box>

                          <StyledTextField
                            label="Host URL"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            fullWidth
                            required
                            placeholder="http://localhost:3100"
                            helperText="Include protocol (http:// or https://) and port if needed"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HttpIcon sx={{ color: "text.secondary" }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        {/* Info Box */}
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: (theme) => theme.palette.mode === 'dark'
                              ? "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%)"
                              : "linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(56, 249, 215, 0.03) 100%)",
                            border: (theme) => `1px solid ${alpha("#43e97b", 0.2)}`,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#43e97b" }}>
                            📊 Loki Configuration Tips
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="body2" color="text.secondary">
                              • Ensure your Loki server is running and accessible
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Default Loki port is usually 3100
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Verify that log ingestion is properly configured
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Check that CORS settings allow web access
                            </Typography>
                          </Stack>
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ pt: 2 }}>
                          <ClickSpark
                            sparkColor="#43e97b"
                            sparkCount={12}
                            sparkSize={12}
                            sparkRadius={30}
                            duration={800}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={!name || !host || loading}
                              sx={{
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                                boxShadow: "0 12px 40px rgba(67, 233, 123, 0.4)",
                                position: "relative",
                                overflow: "hidden",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #3dd970, #32e6c7)",
                                  boxShadow: "0 16px 48px rgba(67, 233, 123, 0.5)",
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
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <FeedIcon />
                                Add Loki Data Source
                              </Box>
                            </Button>
                          </ClickSpark>
                        </Box>
                      </Stack>
                    </form>
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