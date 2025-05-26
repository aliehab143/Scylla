import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import SideMenu from "../components/DashboardsPageComponents/SideMenu"; // Adjust path as needed
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar"; // Adjust path as needed
import Header from "../components/DashboardsPageComponents/Header"; // Adjust path as needed
import DataSourceCard from "../components/DataSourceCard"; // Adjust path as needed
import Container from "@mui/material/Container";

// Mock Data for Data Sources
const dataSources = [
  {
    name: "Loki",
    description: "A horizontally-scalable, highly-available, multi-tenant log aggregation system.",
    image: "/loki.png",
    path: "/data-source/loki", // New path for navigation
  },
  {
    name: "CSV",
    description: "A simple and widely-used format for tabular data.",
    image: "/csv.png",
    path: "/data-source/csv", // New path for navigation
  },
  {
    name: "Prometheus",
    description: "An open-source systems monitoring and alerting toolkit.",
    image: "/prometheus.png",
    path: "/data-source/prometheus", // New path for navigation
  },
];

export default function DataSourcesPage() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSelect = (path) => {
    navigate(path); // Navigate to the new page
  };

  return (
    <div>
      {/* Apply baseline styles */}
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <AppNavbar />
          <Stack
            spacing={3}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Container maxWidth="lg">
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ 
                    fontWeight: "bold",
                    mb: 1,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Data Sources
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 600 }}
                >
                  Choose a data source to integrate into your system. Each data source type offers unique capabilities for collecting and analyzing your data.
                </Typography>
              </Box>
              {/* Data Source Cards */}
              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                }}
              >
                {dataSources.map((dataSource) => (
                  <DataSourceCard
                    key={dataSource.name}
                    name={dataSource.name}
                    description={dataSource.description}
                    image={dataSource.image}
                    onClick={() => handleSelect(dataSource.path)} // Navigate on click
                    sx={{
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  />
                ))}
              </Box>
            </Container>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}
