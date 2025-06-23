import { useContext, useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AuthContext } from "../context/Auth/AuthContext";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { BASE_URL } from "../constants/constants";
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [userStats, setUserStats] = useState({
    dashboards: 0,
    dataSources: 0,
    correlations: 0
  });
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.data[0];
          setUserStats({
            dashboards: userData?.dashboards?.length || 0,
            dataSources: userData?.datasources?.length || 0,
            correlations: userData?.datacorrelations?.length || 0
          });
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    fetchUserStats();
  }, [user?.token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.data || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "An error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const accountSections = [
    {
      title: "Account Information",
      icon: PersonIcon,
      color: "#667eea",
      bgColor: "rgba(102, 126, 234, 0.1)",
    },
    {
      title: "Security Settings",
      icon: SecurityIcon,
      color: "#43e97b",
      bgColor: "rgba(67, 233, 123, 0.1)",
    },
    {
      title: "Preferences",
      icon: SettingsIcon,
      color: "#f093fb",
      bgColor: "rgba(240, 147, 251, 0.1)",
    }
  ];

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

            {/* Profile Header */}
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
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                  opacity: 0.7,
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      fontSize: "3rem",
                      fontWeight: 700,
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "linear-gradient(135deg, #f093fb, #f5576c)",
                      color: "white",
                      width: 32,
                      height: 32,
                      '&:hover': {
                        background: "linear-gradient(135deg, #e087f0, #e54d68)",
                      },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <GradientText
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="text-3xl font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", margin: 0, mb: 1 }}>
                      User Profile
                    </Typography>
                  </GradientText>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                    {user?.email || 'user@example.com'}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                      label="Active Account"
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
                            {userStats.dashboards}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Dashboards
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Interactive visualizations created
                      </Typography>
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
                            {userStats.dataSources}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Data Sources
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Connected data sources
                      </Typography>
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
                            {userStats.correlations}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Correlations
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Data correlations established
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>

              {/* Account Information */}
              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={600}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? "0 12px 32px rgba(0, 0, 0, 0.3)"
                        : "0 12px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#667eea" }}>
                        Account Information
                      </Typography>
                    </Box>
                    
                    <Stack spacing={3}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Email Address
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, pl: 3 }}>
                          {user?.email || 'user@example.com'}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ opacity: 0.3 }} />
                      
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Account Type
                        </Typography>
                        <Chip
                          label="Standard User"
                          sx={{
                            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))",
                            border: "1px solid rgba(102, 126, 234, 0.3)",
                            color: "#667eea",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                          Member Since
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Fade>
              </Grid>

              {/* Security Settings */}
              <Grid item xs={12} md={6}>
                <Fade in={true} timeout={700}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(67, 233, 123, 0.3)",
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? "0 12px 32px rgba(0, 0, 0, 0.3)"
                        : "0 12px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SecurityIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#43e97b" }}>
                        Security Settings
                      </Typography>
                    </Box>

                  <form onSubmit={handleChangePassword}>
                      <Stack spacing={3}>
                      {error && (
                          <Alert 
                            severity="error" 
                            onClose={() => setError("")}
                            sx={{
                              background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))",
                              border: "1px solid rgba(244, 67, 54, 0.2)",
                            }}
                          >
                          {error}
                        </Alert>
                      )}
                      {success && (
                          <Alert 
                            severity="success" 
                            onClose={() => setSuccess("")}
                            sx={{
                              background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))",
                              border: "1px solid rgba(76, 175, 80, 0.2)",
                            }}
                          >
                          {success}
                        </Alert>
                      )}
                        
                      <TextField
                        label="Current Password"
                          type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        fullWidth
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={() => togglePasswordVisibility('current')}
                                edge="end"
                              >
                                {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: (theme) => theme.palette.mode === 'dark'
                                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.4) 100%)",
                              backdropFilter: "blur(10px)",
                            },
                          }}
                        />
                        
                      <TextField
                        label="New Password"
                          type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={() => togglePasswordVisibility('new')}
                                edge="end"
                              >
                                {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: (theme) => theme.palette.mode === 'dark'
                                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.4) 100%)",
                              backdropFilter: "blur(10px)",
                            },
                          }}
                        />
                        
                      <TextField
                        label="Confirm New Password"
                          type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={() => togglePasswordVisibility('confirm')}
                                edge="end"
                              >
                                {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: (theme) => theme.palette.mode === 'dark'
                                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)"
                                : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.4) 100%)",
                              backdropFilter: "blur(10px)",
                            },
                          }}
                        />
                        
                        <ClickSpark
                          sparkColor="#43e97b"
                          sparkCount={6}
                          sparkSize={8}
                          sparkRadius={20}
                          duration={500}
                        >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                            sx={{
                              alignSelf: "flex-start",
                              background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                              borderRadius: 2,
                              px: 4,
                              py: 1.5,
                              fontSize: "1rem",
                              fontWeight: 600,
                              textTransform: "none",
                              boxShadow: "0 8px 32px rgba(67, 233, 123, 0.3)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #3dd472, #49f0b0)",
                                boxShadow: "0 12px 40px rgba(67, 233, 123, 0.4)",
                                transform: "translateY(-2px)",
                              },
                              "&:disabled": {
                                background: (theme) => theme.palette.mode === 'dark' 
                                  ? "linear-gradient(135deg, #424242, #616161)"
                                  : "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
                                color: (theme) => theme.palette.mode === 'dark' 
                                  ? "rgba(255, 255, 255, 0.4)"
                                  : "rgba(0, 0, 0, 0.4)",
                                boxShadow: "none",
                                cursor: "not-allowed",
                              },
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            {loading ? "Updating..." : "Update Password"}
                      </Button>
                        </ClickSpark>
                    </Stack>
                  </form>
                  </Paper>
                </Fade>
              </Grid>

              {/* Preferences */}
              <Grid item xs={12}>
                <Fade in={true} timeout={800}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(240, 147, 251, 0.3)",
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? "0 12px 32px rgba(0, 0, 0, 0.3)"
                        : "0 12px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #f093fb, #f5576c)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SettingsIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#f093fb" }}>
                    Preferences
                      </Typography>
                    </Box>

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={4}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
                            Theme Settings
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                            System Default
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Follows your system theme preference
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
                            Notifications
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#f093fb',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#f093fb',
                                  },
                                }}
                              />
                            }
                            label="Enable notifications"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={emailUpdates}
                                onChange={(e) => setEmailUpdates(e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#f093fb',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#f093fb',
                                  },
                                }}
                              />
                            }
                            label="Email updates"
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                    <Box>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
                            Language & Region
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                            English (US)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Default language setting
                      </Typography>
                    </Box>
                      </Grid>
                    </Grid>
            </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 