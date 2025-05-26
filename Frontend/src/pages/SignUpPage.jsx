import * as React from "react";
import { useContext } from "react";
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
import { styled } from "@mui/material/styles";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/constants";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp() {
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const phoneRef = React.useRef();
  const passwordRef = React.useRef();
  const confirmPasswordRef = React.useRef();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apiError, setApiError] = React.useState("");

  const [formErrors, setFormErrors] = React.useState({
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
    if (validateInputs()) {
      setApiError("");
      const userData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phoneNumber: phoneRef.current.value,
        password: passwordRef.current.value,
      };

      console.log("User data to be sent:", userData);

      try {
        const response = await fetch(`${BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          setApiError(errorData || "Registration failed.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Stack
        direction="row"
        sx={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
          justifyContent: "flex-end",
        }}
      >
        <ColorModeIconDropdown size="medium" />
      </Stack>
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <img
              src="/siteLogo.png"
              alt="Scylla Logo"
              style={{ width: "80px", height: "auto" }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Scylla
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          {apiError && (
            <Typography sx={{ color: "red", textAlign: "center", mb: 2 }}>
              {apiError}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField
                inputRef={nameRef}
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="your name"
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                inputRef={emailRef}
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <TextField
                inputRef={phoneRef}
                required
                fullWidth
                id="phone"
                placeholder="1234567890"
                name="phone"
                autoComplete="tel"
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                inputRef={passwordRef}
                required
                fullWidth
                name="password"
                placeholder="••••••••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                inputRef={confirmPasswordRef}
                required
                fullWidth
                name="confirmPassword"
                placeholder="••••••••••••"
                type="password"
                id="confirmPassword"
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
            </FormControl>
            <Button onClick={handleSubmit} fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?{" "}
            <Link to="/signIn" variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </div>
  );
}
