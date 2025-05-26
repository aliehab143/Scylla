import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown"; // Import theme switcher

export default function DataSourceForm() {
  const [csvFile, setCsvFile] = useState(null);
  const [name, setName] = useState(""); // State for name
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Retrieve the token from AuthContext

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        setError("Only CSV files are allowed.");
        setCsvFile(null);
        return;
      }
      setCsvFile(file);
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!csvFile || !name) {
      setError("Both name and CSV file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("filename", name); // Add name to the body as 'filename'

    try {
      const response = await fetch(`${BASE_URL}/datasource/upload/csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`, // Include the token in the headers
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload CSV.");
      }

      setSuccess("CSV uploaded successfully!");
      setCsvFile(null);
      setName("");

      // Redirect to the data sources page after success
      setTimeout(() => navigate("/datasources/view"), 2000);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError(err.message || "An error occurred during upload.");
    }
  };

  return (
    <div>
      {/* Apply baseline styles */}
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Side Menu */}
        <SideMenu />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          {/* App Navbar */}
          <AppNavbar />

          {/* Page Content */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              position: "relative",
            }}
          >
            {/* Theme Switcher */}
            <Box
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 1000,
              }}
            >
              <ColorModeIconDropdown />
            </Box>

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
              <img
                src="/csv.png" // Replace with your CSV image path
                alt="CSV Upload"
                style={{ width: "100px", height: "100px", marginBottom: "16px" }}
              />
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Upload CSV Data Source
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
              <form
                onSubmit={handleSubmit}
                method="POST"
                encType="multipart/form-data"
              >
                <Stack spacing={3}>
                  {/* Name Field */}
                  <TextField
                    label="Data Source Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />

                  {/* CSV Upload */}
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ justifyContent: "start" }}
                  >
                    {csvFile ? csvFile.name : "Upload CSV File"}
                    <input
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Upload
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
