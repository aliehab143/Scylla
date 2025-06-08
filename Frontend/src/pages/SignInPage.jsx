import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import SignInCard from "../components/SignInPageComponents/SignInCard";
import Content from "../components/SignInPageComponents/Content";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

export default function SignInpage() {
  return (
    <div>
      <CssBaseline enableColorScheme />
      
      {/* Theme Toggle Button */}
      <Stack
        direction="row"
        sx={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          justifyContent: "flex-end",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: (theme) => theme.palette.mode === 'dark'
              ? "1px solid rgba(102, 126, 234, 0.2)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            p: 1,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? "0 12px 32px rgba(0, 0, 0, 0.3)"
              : "0 12px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ColorModeIconDropdown size="medium" />
        </Box>
      </Stack>

      {/* Main Content */}
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          position: "relative",
          background: (theme) => theme.palette.mode === 'dark'
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 20%, #667eea30 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f093fb30 0%, transparent 50%), radial-gradient(circle at 40% 60%, #43e97b20 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 20%, #667eea15 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f093fb15 0%, transparent 50%), radial-gradient(circle at 40% 60%, #43e97b10 0%, transparent 50%)',
            opacity: 0.8,
            zIndex: 0,
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(1deg)" },
            },
          })}
        />

        {/* Floating Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
            opacity: 0.6,
            animation: "pulse 4s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)", opacity: 0.6 },
              "50%": { transform: "scale(1.1)", opacity: 0.8 },
            },
          }}
        />
        
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))",
            opacity: 0.5,
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />



        {/* Main Content Container */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            p: { xs: 2, sm: 4 },
            maxWidth: "1200px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Fade in={true} timeout={1000}>
            <Box sx={{ order: { xs: 2, md: 1 } }}>
              <Content />
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1200}>
            <Box sx={{ order: { xs: 1, md: 2 } }}>
              <SignInCard />
            </Box>
          </Fade>
        </Stack>


      </Stack>
    </div>
  );
}
