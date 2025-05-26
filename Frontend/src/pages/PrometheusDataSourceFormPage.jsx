import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

export default function PrometheusDataSourceFormPage() {
  const { user } = useContext(AuthContext); // Retrieve user and token from AuthContext
  const { type } = useParams(); // Get the type from the URL params
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  console.log(type);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !host) {
      setError("Both name and host URL are required.");
      return;
    }


    const formData = {
        name:name,
        hostURL: host, 
        type:type,
      };
      console.log(formData)
    try {
      const response = await fetch(`${BASE_URL}/datasource/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Include the token in the headers
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

      // Redirect to the data sources page after success
      setTimeout(() => navigate("/datasources/view"), 2000);
    } catch (err) {
      console.error("Error adding data source:", err);
      setError(err.message || "An error occurred while adding the data source.");
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Side Menu */}
        <SideMenu />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {/* App Navbar */}
          <AppNavbar />

          {/* Form Content */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
            }}
          >
            {/* Form Container */}
            <Box
              sx={{
                maxWidth: 500,
                width: "100%",
                textAlign: "center",
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "background.paper",
              }}
            >
              {/* Prometheus Logo */}
              <img
                src="/prometheus.png"
                alt="Prometheus Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "16px",
                }}
              />

              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Add Prometheus Data Source
              </Typography>
              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mb: 2, textAlign: "left" }}
                >
                  {error}
                </Typography>
              )}
              {success && (
                <Typography
                  color="success.main"
                  variant="body2"
                  sx={{ mb: 2, textAlign: "left" }}
                >
                  {success}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Name Field */}
                  <TextField
                    label="Data Source Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />

                  {/* Host URL Field */}
                  <TextField
                    label="Host URL"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    fullWidth
                    required
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add Data Source
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
