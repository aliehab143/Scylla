import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MagnetLines from "../blocks/Animations/MagnetLines/MagnetLines";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import ClickSpark from "../blocks/Animations/ClickSpark/ClickSpark";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url('https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard.jpg')`,
  backgroundSize: "cover",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    backgroundImage: `url('https://mui.com/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg')`,
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

const FloatingBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: theme.palette.mode === 'dark' 
    ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
    : "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))",
  pointerEvents: "none",
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px) rotate(0deg)",
    },
    "50%": {
      transform: "translateY(-20px) rotate(180deg)",
    },
  },
}));

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      {/* Floating Elements */}
      <FloatingBox
        sx={{
          width: 60,
          height: 60,
          top: "20%",
          left: "10%",
          animationDelay: "0s",
        }}
      />
      <FloatingBox
        sx={{
          width: 40,
          height: 40,
          top: "60%",
          right: "15%",
          animationDelay: "2s",
        }}
      />
      <FloatingBox
        sx={{
          width: 80,
          height: 80,
          bottom: "30%",
          left: "20%",
          animationDelay: "4s",
        }}
      />

      {/* Magnet Lines Background */}
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "100%",
          opacity: theme.palette.mode === 'dark' ? 0.4 : 0.2,
          pointerEvents: "none",
          zIndex: 0,
        })}
      >
        <MagnetLines
          rows={15}
          columns={15}
          containerSize="100vw"
          lineColor="rgba(102, 126, 234, 0.6)"
          lineWidth="1.5px"
          lineHeight="6vmin"
          baseAngle={-10}
        />
      </Box>

      <Container
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 8, sm: 12 },
          width: "100%",
        }}
      >
        <Stack
          spacing={4}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" }, mb: 6, mt: { xs: 8, sm: 12 } }}
        >
          <Box sx={{
            animation: "fadeInUp 0.8s ease-out 0.3s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
                fontSize: "clamp(3rem, 10vw, 4rem)",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: 1.1,
                color: "text.primary"
            }}
          >
            Explore&nbsp;
              <GradientText
                colors={['#667eea', '#764ba2', '#f093fb', '#43e97b']}
                animationSpeed={3}
                showBorder={false}
                className="hero-gradient-text"
            >
              Scylla
              </GradientText>
            </Typography>
          </Box>
          
          <Box sx={{
            animation: "fadeInUp 0.8s ease-out 0.6s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}>
          <Typography
              variant="h5"
            sx={{
              textAlign: "center",
              color: "text.secondary",
                width: { sm: "100%", md: "90%" },
                fontWeight: 400,
                lineHeight: 1.6,
            }}
          >
              Your AI-powered solution for user behavior analytics.
              Designed for precision and efficiency, delivering insightful
              analytics, anomaly detection, and advanced features.
            </Typography>
          </Box>

          <Box sx={{
            animation: "fadeInUp 0.8s ease-out 0.9s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              sx={{ mt: 4 }}
            >
              <ClickSpark
                sparkColor="#667eea"
                sparkCount={10}
                sparkSize={10}
                sparkRadius={25}
                duration={700}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    px: 4,
                    py: 2,
                    borderRadius: "50px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a67d8, #6b5b95)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                      transform: "translateY(-2px)"
                    }
                  }}
                  onClick={() => navigate('/signin')}
                >
                  Get Started Free
                </Button>
              </ClickSpark>

              <ClickSpark
                sparkColor="#f093fb"
                sparkCount={6}
                sparkSize={8}
                sparkRadius={20}
                duration={500}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    px: 4,
                    py: 2,
                    borderRadius: "50px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    minWidth: 200,
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "primary.dark",
                      color: "primary.dark",
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      borderWidth: 2,
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  Watch Demo
                </Button>
              </ClickSpark>
            </Stack>
          </Box>

          {/* Feature highlights */}
          <Box sx={{
            animation: "fadeInUp 0.8s ease-out 1.2s both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={4}
              sx={{ 
                mt: 4,
                color: "text.secondary",
                fontSize: "0.9rem",
                textAlign: "center"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                  }}
                />
                <Typography variant="body2" color="text.secondary">99.9% Uptime</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f093fb, #43e97b)",
                  }}
                />
                <Typography variant="body2" color="text.secondary">Real-time Analytics</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #43e97b, #667eea)",
                  }}
                />
                <Typography variant="body2" color="text.secondary">Enterprise Security</Typography>
              </Box>
        </Stack>
          </Box>
        </Stack>
        
        <Box sx={{
          animation: "fadeInUp 0.8s ease-out 1.5s both",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" }
          }
        }}>
          <Box 
            sx={{ 
              position: "relative", 
              width: "100%",
              maxWidth: 900,
            }}
          >
            <StyledBox id="image">
              {/* Enhanced overlay with gradient and animations */}
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme.palette.mode === 'dark'
                    ? "linear-gradient(45deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15), rgba(240, 147, 251, 0.15))"
                    : "linear-gradient(45deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08), rgba(240, 147, 251, 0.08))",
                  backdropFilter: "blur(2px)",
                  zIndex: 1,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                      ? "radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.3), transparent 50%)"
                      : "radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.15), transparent 50%)",
                    animation: "pulse 4s ease-in-out infinite",
                  },
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 0.5,
                    },
                    "50%": {
                      opacity: 1,
                    },
                  }
                })}
              />
            </StyledBox>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
