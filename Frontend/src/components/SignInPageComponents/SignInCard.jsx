import { useRef, useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../context/Auth/AuthContext"; // Adjust the path as needed
import { BASE_URL } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
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

export default function SignInCard() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext
  const [validationError, setValidationError] = useState(""); // Validation error
  const [apiError, setApiError] = useState(""); // API response error
  const navigate = useNavigate();

  // Validation function
  const validateInputs = () => {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!email || !password) {
      setValidationError("All fields are required.");
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
        setApiError(errorData.message || "Login failed."); // Set API error
      }
    } catch (error) {
      console.error("Error during login:", error);
      setApiError("An error occurred. Please try again.");
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {apiError && (
          <Typography color="error" variant="body2">
            {apiError}
          </Typography>
        )}
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            inputRef={emailRef}
            type="email"
            id="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            inputRef={passwordRef}
            type="password"
            id="password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
            fullWidth
          />
        </FormControl>
        {validationError && (
          <Typography color="error" variant="body2">
            {validationError}
          </Typography>
        )}
        <Button onClick={handleSubmit} fullWidth variant="contained">
          Sign in
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span>
            <Typography
              component="a"
              href="/SignUp"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign up
            </Typography>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
