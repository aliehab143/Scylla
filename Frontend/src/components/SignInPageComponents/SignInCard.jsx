import { useRef, useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/Auth/AuthContext"; // Adjust the path as needed
import { BASE_URL } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import ClickSpark from "../blocks/Animations/ClickSpark/ClickSpark";

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
    width: "450px",
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

export default function SignInCard() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext
  const [validationError, setValidationError] = useState(""); // Validation error
  const [apiError, setApiError] = useState(""); // API response error
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateInputs = () => {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) {
      setValidationError("All fields are required.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }

    setValidationError(""); // Clear validation error
    return true;
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!validateInputs()) return;

    // Clear API error before API call
    setApiError("");

    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      // Make the API call
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const token = await response.json(); // Contains { username, email, token }
        login({
          email: userData.email,
          token,
        });
        navigate("/main");
        console.log("User logged in successfully:", token);
      } else {
        const errorData = await response.json();
        setApiError(errorData.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
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

  return (
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
        <Fade in={true} timeout={400}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                mb: 2,
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              <LoginIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{ 
                width: "100%", 
                fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Sign in to continue to Scylla
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Error Messages */}
          {(apiError || validationError) && (
            <Fade in={true} timeout={300}>
              <Alert 
                severity="error" 
                onClose={() => {
                  setApiError("");
                  setValidationError("");
                }}
                sx={{
                  background: "linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))",
                  border: "1px solid rgba(244, 67, 54, 0.2)",
                  borderRadius: 2,
                }}
              >
                {apiError || validationError}
              </Alert>
            </Fade>
          )}

          {/* Email Field */}
          <FormControl>
            <StyledFormLabel htmlFor="email">Email Address</StyledFormLabel>
            <StyledTextField
              inputRef={emailRef}
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              fullWidth
              disabled={loading}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Password Field */}
          <FormControl>
            <StyledFormLabel htmlFor="password">Password</StyledFormLabel>
            <StyledTextField
              inputRef={passwordRef}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              fullWidth
              disabled={loading}
              onKeyPress={handleKeyPress}
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

          {/* Sign In Button */}
          <ClickSpark
            sparkColor="#667eea"
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
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8, #6b4190)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
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
                  Signing in...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </ClickSpark>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Typography
                component="a"
                href="/SignUp"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#667eea",
                  },
                  transition: "color 0.2s ease",
                }}
              >
                Sign up here
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
              🔒 Your data is protected with enterprise-grade security
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
