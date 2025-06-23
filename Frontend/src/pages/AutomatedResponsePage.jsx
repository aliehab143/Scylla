import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { AuthContext } from "../context/Auth/AuthContext";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

const LOCAL_STORAGE_KEY = 'mongoDbConfig';

export default function AutomatedResponsePage() {
  const { user } = useContext(AuthContext);
  const [mongoUrl, setMongoUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempMongoUrl, setTempMongoUrl] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load MongoDB URL from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setMongoUrl(config.url || "");
        setLastUpdated(config.lastUpdated || null);
        setConnectionStatus(config.connectionStatus || null);
      } catch (err) {
        console.error("Error loading saved config:", err);
      }
    }
  }, []);

  const validateMongoUrl = (url) => {
    const mongoUrlPattern = /^mongodb(\+srv)?:\/\/.+/;
    return mongoUrlPattern.test(url);
  };

  const handleEdit = () => {
    setTempMongoUrl(mongoUrl);
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setTempMongoUrl("");
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = () => {
    if (!tempMongoUrl.trim()) {
      setError("MongoDB URL cannot be empty");
      return;
    }

    if (!validateMongoUrl(tempMongoUrl)) {
      setError("Please enter a valid MongoDB URL (e.g., mongodb://... or mongodb+srv://...)");
      return;
    }

    try {
      const config = {
        url: tempMongoUrl,
        lastUpdated: new Date().toISOString(),
        connectionStatus: 'configured'
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      setMongoUrl(tempMongoUrl);
      setLastUpdated(config.lastUpdated);
      setConnectionStatus(config.connectionStatus);
      setIsEditing(false);
      setSuccess("MongoDB URL saved successfully!");
      setError("");
      setTempMongoUrl("");
    } catch (err) {
      setError("Failed to save MongoDB URL");
      console.error("Error saving config:", err);
    }
  };

  const handleTestConnection = async () => {
    if (!mongoUrl) {
      setError("Please configure MongoDB URL first");
      return;
    }

    try {
      setConnectionStatus('testing');
      // Simulate connection test (replace with actual test logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const testResult = Math.random() > 0.3;
      
      const config = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      config.connectionStatus = testResult ? 'connected' : 'failed';
      config.lastTested = new Date().toISOString();
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      setConnectionStatus(config.connectionStatus);
      
      if (testResult) {
        setSuccess("Connection test successful!");
        setError("");
      } else {
        setError("Connection test failed. Please check your MongoDB URL and credentials.");
        setSuccess("");
      }
    } catch (err) {
      setConnectionStatus('failed');
      setError("Connection test failed: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#4caf50';
      case 'failed': return '#f44336';
      case 'testing': return '#ff9800';
      case 'configured': return '#2196f3';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon />;
      case 'failed': return <ErrorIcon />;
      case 'testing': return <SettingsIcon className="rotating" />;
      case 'configured': return <StorageIcon />;
      default: return <StorageIcon />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'failed': return 'Connection Failed';
      case 'testing': return 'Testing Connection...';
      case 'configured': return 'Configured';
      default: return 'Not Configured';
    }
  };

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
          
          <Container 
            maxWidth="lg" 
            sx={{ 
              position: "relative", 
              zIndex: 1,
              py: 4,
              mt: { xs: 8, md: 2 }
            }}
          >
            <Stack spacing={6}>
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
                    <AutoFixHighIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  
                  <GradientText
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                      Automated Response
                    </Typography>
                  </GradientText>
                  
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: 700, 
                      mx: "auto", 
                      fontSize: "1.1rem",
                      lineHeight: 1.6
                    }}
                  >
                    Configure your MongoDB database connection for automated response system.
                    Set up intelligent automation for your monitoring and alerting workflows.
                  </Typography>
                </Box>
              </Fade>

              {/* Success/Error Messages */}
              {success && (
                <Fade in={!!success}>
                  <Alert severity="success" onClose={() => setSuccess("")}>
                    {success}
                  </Alert>
                </Fade>
              )}
              
              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" onClose={() => setError("")}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Configuration Cards */}
              <Fade in={true} timeout={1000}>
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} md={8} lg={6}>
                    {/* Database Configuration Card */}
                    <SpotlightCard>
                      <Card
                        sx={{
                          background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(30, 41, 59, 0.8)'
                            : 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: (theme) => theme.palette.mode === 'dark'
                            ? '1px solid rgba(148, 163, 184, 0.1)'
                            : '1px solid rgba(203, 213, 224, 0.3)',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <CardHeader
                          avatar={<StorageIcon sx={{ color: '#667eea' }} />}
                          title={
                            <Typography variant="h5" fontWeight="bold">
                              MongoDB Configuration
                            </Typography>
                          }
                          subheader="Configure your database connection settings"
                          action={
                            !isEditing && (
                              <Tooltip title="Edit Configuration">
                                <IconButton onClick={handleEdit} color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )
                          }
                        />
                        <Divider />
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={3}>
                            {/* MongoDB URL Field */}
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                MongoDB URL
                              </Typography>
                              <TextField
                                fullWidth
                                placeholder="mongodb://username:password@host:port/database"
                                value={isEditing ? tempMongoUrl : mongoUrl}
                                onChange={(e) => isEditing && setTempMongoUrl(e.target.value)}
                                disabled={!isEditing}
                                multiline={!isEditing && mongoUrl.length > 50}
                                rows={!isEditing && mongoUrl.length > 50 ? 2 : 1}
                                variant="outlined"
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: isEditing 
                                      ? 'transparent' 
                                      : (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(51, 65, 85, 0.3)' 
                                        : 'rgba(248, 250, 252, 0.5)',
                                  }
                                }}
                                helperText={isEditing ? "Enter your MongoDB connection string" : ""}
                              />
                            </Box>

                            {/* Action Buttons */}
                            {isEditing ? (
                              <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                  variant="outlined"
                                  startIcon={<CancelIcon />}
                                  onClick={handleCancel}
                                  color="inherit"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={handleSave}
                                  color="primary"
                                >
                                  Save
                                </Button>
                              </Stack>
                            ) : (
                              mongoUrl && (
                                <Button
                                  variant="outlined"
                                  onClick={handleTestConnection}
                                  disabled={connectionStatus === 'testing'}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                                </Button>
                              )
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </SpotlightCard>
                  </Grid>

                  {/* Status Card */}
                  {mongoUrl && (
                    <Grid item xs={12} md={8} lg={6}>
                      <SpotlightCard>
                        <Card
                          sx={{
                            background: (theme) => theme.palette.mode === 'dark'
                              ? 'rgba(30, 41, 59, 0.8)'
                              : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: (theme) => theme.palette.mode === 'dark'
                              ? '1px solid rgba(148, 163, 184, 0.1)'
                              : '1px solid rgba(203, 213, 224, 0.3)',
                            borderRadius: 3,
                            overflow: 'hidden',
                          }}
                        >
                          <CardHeader
                            title={
                              <Typography variant="h5" fontWeight="bold">
                                Connection Status
                              </Typography>
                            }
                            subheader="Current database connection status"
                          />
                          <Divider />
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{ color: getStatusColor(connectionStatus) }}>
                                  {getStatusIcon(connectionStatus)}
                                </Box>
                                <Chip
                                  label={getStatusText(connectionStatus)}
                                  color={connectionStatus === 'connected' ? 'success' : 
                                         connectionStatus === 'failed' ? 'error' : 'default'}
                                  variant="filled"
                                />
                              </Box>
                              
                              {lastUpdated && (
                                <Typography variant="body2" color="textSecondary">
                                  Last updated: {new Date(lastUpdated).toLocaleString()}
                                </Typography>
                              )}

                              <Typography variant="body2" color="textSecondary">
                                Database URL: {mongoUrl.substring(0, 30)}...
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </SpotlightCard>
                    </Grid>
                  )}
                </Grid>
              </Fade>
            </Stack>
          </Container>
        </Box>
      </Box>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotating {
          animation: rotate 2s linear infinite;
        }
      `}</style>
    </div>
  );
} 