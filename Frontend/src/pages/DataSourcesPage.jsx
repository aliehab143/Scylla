import { alpha, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import DataSourceCard from "../components/DataSourceCard";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import SpotlightCard from "../components/blocks/Components/SpotlightCard/SpotlightCard";
import AddBoxIcon from "@mui/icons-material/AddBox";

const dataSources = [
  {
    name: "Loki",
    description: "A horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus.",
    image: "/loki.png",
    path: "/data-source/loki",
    color: "#43e97b",
    features: ["Log Aggregation", "Multi-tenant", "Highly Available", "Grafana Integration"]
  },
  {
    name: "CSV",
    description: "Upload and analyze your CSV files with powerful data visualization and processing capabilities.",
    image: "/csv.png", 
    path: "/data-source/csv",
    color: "#f093fb",
    features: ["File Upload", "Data Processing", "Quick Analysis", "Visualization Ready"]
  },
  {
    name: "Prometheus",
    description: "An open-source systems monitoring and alerting toolkit with powerful query language and time series database.",
    image: "/prometheus.png",
    path: "/data-source/prometheus",
    color: "#667eea",
    features: ["Metrics Collection", "Time Series DB", "Alerting", "PromQL Queries"]
  },
];

const EnhancedDataSourceCard = styled(Box)(({ theme, color }) => ({
  position: "relative",
  padding: "32px",
  borderRadius: "24px",
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha(color || "#667eea", 0.3)}`,
  boxShadow: `0 20px 40px ${alpha(color || "#667eea", 0.15)}`,
  cursor: "pointer",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 30% 30%, ${color}15 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${color}10 0%, transparent 50%)`,
    pointerEvents: "none",
    borderRadius: "24px",
  },
  
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: `0 32px 64px ${alpha(color || "#667eea", 0.25)}`,
    borderColor: alpha(color || "#667eea", 0.5),
    
    "& .data-source-image": {
      transform: "scale(1.1) rotate(5deg)",
    },
    
    "& .feature-chips": {
      transform: "translateY(0)",
      opacity: 1,
    }
  }
}));

export default function DataSourcesPage() {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 20% 80%, #667eea20 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f093fb15 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b10 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 80%, #667eea10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f093fb08 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b06 0%, transparent 50%)',
              pointerEvents: "none",
              zIndex: 0,
            }
          }}
        >
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
                    <AddBoxIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  
                  <GradientText
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                      Add Data Source
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
                    Choose a data source to integrate into your analytics platform. 
                    Each data source offers unique capabilities for collecting, processing, and analyzing your data.
                  </Typography>
                </Box>
              </Fade>

              {/* Data Source Cards */}
              <Fade in={true} timeout={1000}>
                <Box
                  sx={{
                    display: "grid",
                    gap: 4,
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(auto-fit, minmax(350px, 1fr))",
                    },
                    maxWidth: 1200,
                    mx: "auto"
                  }}
                >
                  {dataSources.map((dataSource, index) => (
                    <Box
                      key={dataSource.name}
                      sx={{
                        animation: `slideInUp 0.6s ease-out ${index * 0.2}s both`,
                        "@keyframes slideInUp": {
                          from: { opacity: 0, transform: "translateY(30px)" },
                          to: { opacity: 1, transform: "translateY(0)" }
                        }
                      }}
                    >
                      <ClickSpark
                        sparkColor={dataSource.color}
                        sparkCount={8}
                        sparkSize={10}
                        sparkRadius={25}
                        duration={600}
                      >
                        <EnhancedDataSourceCard
                          color={dataSource.color}
                          onClick={() => handleSelect(dataSource.path)}
                        >
                          <Box sx={{ position: "relative", zIndex: 1 }}>
                            {/* Header */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                              <Box
                                className="data-source-image"
                                component="img"
                                src={dataSource.image}
                                alt={`${dataSource.name} Logo`}
                                sx={{
                                  width: 64,
                                  height: 64,
                                  objectFit: "contain",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  filter: `drop-shadow(0 8px 16px ${dataSource.color}40)`,
                                }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography 
                                  variant="h5" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    mb: 0.5,
                                    color: dataSource.color,
                                    textShadow: `0 2px 8px ${dataSource.color}40`
                                  }}
                                >
                                  {dataSource.name}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 3,
                                    background: `linear-gradient(90deg, ${dataSource.color}, transparent)`,
                                    borderRadius: 2,
                                  }}
                                />
                              </Box>
                            </Box>

                            {/* Description */}
                            <Typography 
                              variant="body1" 
                              color="text.secondary"
                              sx={{ 
                                mb: 3, 
                                lineHeight: 1.6,
                                fontSize: "1rem"
                              }}
                            >
                              {dataSource.description}
                            </Typography>

                            {/* Features */}
                            <Box 
                              className="feature-chips"
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                transform: "translateY(10px)",
                                opacity: 0.7,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            >
                              {dataSource.features.map((feature, featureIndex) => (
                                <Box
                                  key={feature}
                                  sx={{
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    background: `linear-gradient(135deg, ${dataSource.color}20, ${dataSource.color}10)`,
                                    color: dataSource.color,
                                    border: `1px solid ${dataSource.color}40`,
                                    backdropFilter: "blur(10px)",
                                  }}
                                >
                                  {feature}
                                </Box>
                              ))}
                            </Box>

                            {/* Action Arrow */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${dataSource.color}30, ${dataSource.color}20)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Typography 
                                sx={{ 
                                  color: dataSource.color, 
                                  fontWeight: "bold",
                                  fontSize: "1.2rem"
                                }}
                              >
                                →
                              </Typography>
                            </Box>
                          </Box>
                        </EnhancedDataSourceCard>
                      </ClickSpark>
                    </Box>
                  ))}
                </Box>
              </Fade>
            </Stack>
          </Container>
        </Box>
      </Box>
    </div>
  );
}
