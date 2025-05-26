import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate for navigation
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"; // Add Button component
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import DashboardGrid from "../components/DashboardsPageComponents/DashboardGrid";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

export default function CsvDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const { user } = useContext(AuthContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dashboard/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch dashboard data.");
        }
  
        const result = await response.json();
        console.log("Dashboard data:", result);
  
        // Dynamically generate columns based on keys in the JSON response
        if (result.data && result.data.length > 0) {
          const keys = Object.keys(result.data[0]); // Get keys from the first object
          const dynamicColumns = keys.map((key) => ({
            field: key,
            headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()), // Format header name
            width: 150,
          }));
          setColumns(dynamicColumns);
        }
  
        // Set rows
        setRows(
          result.data.map((row, index) => ({
            id: index,
            ...row,
          }))
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An error occurred while fetching the dashboard data.");
      }
    };
  
    fetchDashboardData();
  }, [id, user?.token]);
  

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: (theme) =>
              theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : theme.palette.background.default,
          }}
        >
          <AppNavbar />
          <Stack spacing={2} sx={{ alignItems: "center", mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <Box sx={{ width: "100%", maxWidth: 1200, mt: 3 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
                CSV Dashboard
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <DashboardGrid type="csv" columns={columns} rows={rows} />

              {/* Button to navigate to CSV Analyze Page */}
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate(`/analyze/${id}`)} // Navigate to the analyze page
                >
                  Analyze CSV Data
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
