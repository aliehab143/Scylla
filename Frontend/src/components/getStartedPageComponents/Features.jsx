import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";
import ClickSpark from "../blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

const features = [
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: 40 }} />,
    title: "AI-Driven Anomaly Detection",
    description:
      "Scylla leverages state-of-the-art AI algorithms to detect anomalies in user behavior, ensuring early identification of potential issues.",
    highlight: "99.9% Accuracy",
    color: "#667eea"
  },
  {
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Real-Time User Insights",
    description:
      "Gain deep insights into user behavior patterns with Scylla's advanced analytics, enabling data-driven decision-making in real-time.",
    highlight: "Live Analytics",
    color: "#764ba2"
  },
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Enterprise Security",
    description:
      "Scylla is designed to handle large-scale datasets while maintaining robust security, ensuring your data remains protected and accessible.",
    highlight: "Bank-Level Security",
    color: "#f093fb"
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Predictive Analytics",
    description:
      "Forecast user behavior trends and patterns with advanced machine learning models, staying ahead of the curve.",
    highlight: "Future-Ready",
    color: "#4facfe"
  },
  {
    icon: <BarChartRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Advanced Visualizations",
    description:
      "Transform complex data into intuitive visualizations and dashboards that make insights accessible to everyone.",
    highlight: "Interactive Dashboards",
    color: "#43e97b"
  },
  {
    icon: <SpeedRoundedIcon sx={{ fontSize: 40 }} />,
    title: "Lightning Fast Performance",
    description:
      "Process millions of data points in seconds with our optimized algorithms and cloud-native architecture.",
    highlight: "Sub-second Response",
    color: "#fa709a"
  },
];

const stats = [
  { label: "Data Points Processed", value: "2.4B+", suffix: "" },
  { label: "Anomalies Detected", value: "500K+", suffix: "" },
  { label: "Active Users", value: "10K+", suffix: "" },
  { label: "Uptime", value: "99.9%", suffix: "" },
];

export default function Features() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="features"
      sx={(theme) => ({
        py: { xs: 8, sm: 16 },
        position: "relative",
        overflow: "hidden",
        background: theme.palette.mode === 'dark'
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)",
        backgroundColor: "background.default"
      })}
    >
      <Container sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Box sx={{ 
          width: { sm: "100%", md: "70%" }, 
          textAlign: "center", 
          mx: "auto", 
          mb: 8,
          animation: "fadeInUp 0.8s ease-out",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" }
          }
        }}>
        <Typography
          component="h2"
            variant="h3"
          gutterBottom
            sx={{ 
              color: "text.primary",
              fontWeight: "bold",
              mb: 2
            }}
        >
            Why Choose{" "}
            <GradientText
              colors={['#667eea', '#764ba2', '#f093fb']}
              animationSpeed={4}
              showBorder={false}
            >
              Scylla
            </GradientText>
            ?
        </Typography>
        <Typography
            variant="h6"
            sx={{ 
              color: "text.secondary", 
              mb: 4,
              lineHeight: 1.6,
              fontWeight: 400
            }}
        >
          Scylla combines cutting-edge AI with advanced analytics to empower
          organizations with actionable insights. Discover how Scylla's
            features can transform your user behavior analysis.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          mb: 8,
          animation: "fadeInUp 0.8s ease-out 0.2s both",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" }
          }
        }}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{ 
                      fontWeight: "bold",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
        </Typography>
      </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
      <Box
        sx={{
                  animation: `fadeInUp 0.8s ease-out ${0.4 + index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(30px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                  }
        }}
      >
                <ClickSpark
                  sparkColor={feature.color}
                  sparkCount={6}
                  sparkSize={8}
                  sparkRadius={20}
                  duration={600}
                >
                  <SpotlightCard
                    spotlightColor={isDark ? `${feature.color}40` : `${feature.color}60`}
                    className="feature-card"
                  >
          <Box
            sx={{
              height: "100%",
                        backgroundColor: isDark 
                          ? "background.paper" 
                          : "rgba(255, 255, 255, 0.9)",
                        border: isDark 
                          ? `1px solid ${feature.color}30` 
                          : `2px solid ${feature.color}20`,
                        borderRadius: "16px",
                        padding: "24px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)",
                        boxShadow: isDark 
                          ? `0 4px 20px rgba(0, 0, 0, 0.1)`
                          : `0 8px 32px ${feature.color}15`,
                    "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: isDark 
                            ? `0 8px 40px rgba(0, 0, 0, 0.2)`
                            : `0 12px 48px ${feature.color}25`,
                          borderColor: isDark 
                            ? `${feature.color}60` 
                            : `${feature.color}40`,
                        }
                      }}
              >
                      <Stack spacing={3} sx={{ height: "100%" }}>
                        {/* Icon and Highlight */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box
                            sx={{
                              color: feature.color,
                              p: 1.5,
                              borderRadius: "12px",
                              backgroundColor: `${feature.color}${isDark ? '15' : '10'}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                >
                            {feature.icon}
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: `${feature.color}${isDark ? '20' : '15'}`,
                              color: feature.color,
                              px: 2,
                              py: 0.5,
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              border: isDark ? 'none' : `1px solid ${feature.color}30`
                            }}
                          >
                            {feature.highlight}
                </Box>
              </Box>

                        {/* Title and Description */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                              fontWeight: "bold",
                              color: "text.primary",
                              mb: 2
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "text.secondary",
                              lineHeight: 1.6
                            }}
                          >
                            {feature.description}
                          </Typography>
          </Box>

                        {/* Hover indicator */}
        <Box
          sx={{
                            height: "3px",
                            background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                            borderRadius: "2px",
                            transform: "scaleX(0)",
                            transformOrigin: "left",
                            transition: "transform 0.3s ease",
                            ".feature-card:hover &": {
                              transform: "scaleX(1)"
                            }
                          }}
                        />
                      </Stack>
                    </Box>
                  </SpotlightCard>
                </ClickSpark>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ 
          textAlign: "center", 
          mt: 8,
          animation: "fadeInUp 0.8s ease-out 1s both",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" }
          }
        }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: "bold",
              mb: 3
            }}
          >
            Ready to Transform Your Analytics?
          </Typography>
          <ClickSpark
            sparkColor="#667eea"
            sparkCount={10}
            sparkSize={12}
            sparkRadius={30}
            duration={800}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                px: 4,
                py: 2,
                borderRadius: "30px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Get Started with Scylla
            </Button>
          </ClickSpark>
        </Box>
      </Container>
      </Box>
  );
}
