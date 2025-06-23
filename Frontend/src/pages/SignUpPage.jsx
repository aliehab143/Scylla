import * as React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  borderRadius: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(102, 126, 234, 0.2)"
    : "1px solid rgba(226, 232, 240, 0.8)",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 20px 40px rgba(0, 0, 0, 0.4)"
    : "0 20px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: "500px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: theme.palette.mode === 'dark'
      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.4) 100%)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    '&:hover': {
      transform: "translateY(-1px)",
      boxShadow: theme.palette.mode === 'dark'
        ? "0 8px 25px rgba(0, 0, 0, 0.3)"
        : "0 8px 25px rgba(0, 0, 0, 0.1)",
    },
    '&.Mui-focused': {
      transform: "translateY(-2px)",
      boxShadow: theme.palette.mode === 'dark'
        ? "0 12px 30px rgba(102, 126, 234, 0.3)"
        : "0 12px 30px rgba(102, 126, 234, 0.2)",
    },
  },
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.8)',
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative",
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
    : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
  overflow: "hidden",
}));

export default function SignUp() {
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const phoneRef = React.useRef();
  const passwordRef = React.useRef();
  const confirmPasswordRef = React.useRef();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateInputs = () => {
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    let errors = {};

    if (!name) errors.name = "Full name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!phone || !/^\d+$/.test(phone))
      errors.phone = "Please enter a valid phone number.";
    if (!password || password.length < 6)
      errors.password = "Password must be at least 6 characters long.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setApiError("");
    
    const userData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phoneNumber: phoneRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const token = await response.json();

        if (!token) {
          setApiError("Incorrect token received from the server.");
          return;
        }

        login({
          email: userData.email,
          token,
        });
        navigate("/main");
        console.log("User registered successfully:", token);
      } else {
        const errorData = await response.json();
        setApiError(errorData?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      
      {/* Theme Toggle Button */}
      <Stack
        direction="row"
        sx={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          justifyContent: "flex-end",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: (theme) => theme.palette.mode === 'dark'
              ? "1px solid rgba(102, 126, 234, 0.2)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            p: 1,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? "0 12px 32px rgba(0, 0, 0, 0.3)"
              : "0 12px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ColorModeIconDropdown size="medium" />
        </Box>
      </Stack>

      <SignUpContainer>
        {/* Animated Background Pattern */}
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 20%, #667eea30 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f093fb30 0%, transparent 50%), radial-gradient(circle at 40% 60%, #43e97b20 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 20%, #667eea15 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f093fb15 0%, transparent 50%), radial-gradient(circle at 40% 60%, #43e97b10 0%, transparent 50%)',
            opacity: 0.8,
            zIndex: 0,
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(1deg)" },
            },
          })}
        />

        {/* Floating Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "15%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
            opacity: 0.6,
            animation: "pulse 4s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)", opacity: 0.6 },
              "50%": { transform: "scale(1.1)", opacity: 0.8 },
            },
          }}
        />
        
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))",
            opacity: 0.5,
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <Fade in={true} timeout={600}>
          <Card variant="outlined">
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

            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Logo and Header */}
              <Fade in={true} timeout={400}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Box 
                    onClick={() => navigate('/')}
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: 2, 
                      mb: 3,
                      cursor: "pointer",
                      p: 1,
                      borderRadius: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                          ? "0 8px 25px rgba(0, 0, 0, 0.3)"
                          : "0 8px 25px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <img
                      src="/siteLogo.png"
                      alt="Scylla Logo"
                      style={{ 
                        width: "60px", 
                        height: "auto",
                      }}
                    />
                    <GradientText
                      colors={["#667eea", "#764ba2", "#f093fb"]}
                      animationSpeed={4}
                      showBorder={false}
                    >
                      <Typography variant="h4" sx={{ fontWeight: "bold", margin: 0, textAlign: "center" }}>
                        Scylla
                      </Typography>
                    </GradientText>
                  </Box>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                      mb: 2,
                      boxShadow: "0 8px 32px rgba(67, 233, 123, 0.3)",
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 32, color: "white" }} />
                  </Box>

                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{ 
                      width: "100%", 
                      fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #43e97b, #52ffb8)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Join Scylla and unlock powerful analytics
                  </Typography>
                </Box>
              </Fade>

              {/* Form */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Error Message */}
                {apiError && (
                  <Fade in={true} timeout={300}>
                    <Alert 
                      severity="error" 
                      onClose={() => setApiError("")}
                      sx={{
                        background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))",
                        border: "1px solid rgba(244, 67, 54, 0.2)",
                        borderRadius: 2,
                      }}
                    >
                      {apiError}
                    </Alert>
                  </Fade>
                )}

                {/* Full Name */}
                <FormControl>
                  <StyledFormLabel htmlFor="name">Full Name</StyledFormLabel>
                  <StyledTextField
                    inputRef={nameRef}
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Enter your full name"
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* Email */}
                <FormControl>
                  <StyledFormLabel htmlFor="email">Email Address</StyledFormLabel>
                  <StyledTextField
                    inputRef={emailRef}
                    required
                    fullWidth
                    id="email"
                    placeholder="Enter your email"
                    name="email"
                    autoComplete="email"
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* Phone Number */}
                <FormControl>
                  <StyledFormLabel htmlFor="phone">Phone Number</StyledFormLabel>
                  <StyledTextField
                    inputRef={phoneRef}
                    required
                    fullWidth
                    id="phone"
                    placeholder="Enter your phone number"
                    name="phone"
                    autoComplete="tel"
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* Password */}
                <FormControl>
                  <StyledFormLabel htmlFor="password">Password</StyledFormLabel>
                  <StyledTextField
                    inputRef={passwordRef}
                    required
                    fullWidth
                    name="password"
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            disabled={loading}
                            sx={{
                              color: "text.secondary",
                              '&:hover': {
                                color: "primary.main",
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* Confirm Password */}
                <FormControl>
                  <StyledFormLabel htmlFor="confirmPassword">Confirm Password</StyledFormLabel>
                  <StyledTextField
                    inputRef={confirmPasswordRef}
                    required
                    fullWidth
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            disabled={loading}
                            sx={{
                              color: "text.secondary",
                              '&:hover': {
                                color: "primary.main",
                              },
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* Sign Up Button */}
                <ClickSpark
                  sparkColor="#43e97b"
                  sparkCount={8}
                  sparkSize={10}
                  sparkRadius={25}
                  duration={600}
                >
                  <Button 
                    onClick={handleSubmit} 
                    fullWidth 
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #43e97b, #52ffb8)",
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
                        transform: "none",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: "inherit" }} />
                        Creating Account...
                      </Box>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </ClickSpark>

                {/* Sign In Link */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Typography
                      component={Link}
                      to="/signIn"
                      variant="body2"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#43e97b",
                        },
                        transition: "color 0.2s ease",
                      }}
                    >
                      Sign in here
                    </Typography>
                  </Typography>
                </Box>

                {/* Security Notice */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? "linear-gradient(135deg, rgba(67, 233, 123, 0.05), rgba(67, 233, 123, 0.02))"
                      : "linear-gradient(135deg, rgba(67, 233, 123, 0.08), rgba(67, 233, 123, 0.04))",
                    border: "1px solid rgba(67, 233, 123, 0.2)",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", display: "block" }}>
                    🔒 By creating an account, you agree to our secure data handling practices
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      </SignUpContainer>
    </div>
  );
}
