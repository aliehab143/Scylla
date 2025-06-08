import { useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { AuthContext } from "../../context/Auth/AuthContext";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

const drawerWidth = 300;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  minWidth: drawerWidth,
  maxWidth: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    minWidth: drawerWidth,
    maxWidth: drawerWidth,
    boxSizing: "border-box",
    border: "none",
    backgroundImage: 'none',
    background: theme.palette.mode === 'dark'
      ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(241, 245, 249, 0.95) 100%)",
    backdropFilter: "blur(20px)",
    borderRight: theme.palette.mode === 'dark' 
      ? `1px solid ${alpha("#667eea", 0.2)}`
      : `1px solid ${alpha("#e2e8f0", 0.8)}`,
    boxShadow: theme.palette.mode === 'dark'
      ? "4px 0 24px rgba(0, 0, 0, 0.4)"
      : "4px 0 24px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at 50% 20%, #667eea15 0%, transparent 50%), radial-gradient(circle at 50% 80%, #f093fb10 0%, transparent 50%)'
        : 'radial-gradient(circle at 50% 20%, #667eea08 0%, transparent 50%), radial-gradient(circle at 50% 80%, #f093fb06 0%, transparent 50%)',
      pointerEvents: "none",
      zIndex: 0,
    }
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  padding: "20px",
  height: "80px",
  marginTop: "16px",
  gap: "12px",
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  margin: "16px",
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha("#667eea", 0.3)}`
    : `1px solid ${alpha("#e2e8f0", 0.6)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
    : "0 8px 32px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 12px 40px rgba(102, 126, 234, 0.4)"
      : "0 12px 40px rgba(102, 126, 234, 0.2)",
    borderColor: alpha("#667eea", 0.5),
    "& .logo-image": {
      transform: "scale(1.1) rotate(5deg)",
    }
  }
}));

const UserProfileContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  padding: "20px",
  margin: "16px",
  height: "100px",
  borderRadius: "16px",
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.7) 100%)",
  backdropFilter: "blur(15px)",
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha("#667eea", 0.2)}`
    : `1px solid ${alpha("#e2e8f0", 0.5)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? "0 8px 32px rgba(0, 0, 0, 0.2)"
    : "0 8px 32px rgba(0, 0, 0, 0.08)",
}));

export default function SideMenu() {
  const { user } = useContext(AuthContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
      }}
    >
      {/* Enhanced Logo Section */}
      <LogoContainer>
        <Box
          className="logo-image"
          component="img"
          src="/siteLogo.png"
          alt="Scylla Logo"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))",
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <GradientText
            colors={["#667eea", "#764ba2", "#f093fb"]}
            animationSpeed={4}
            showBorder={false}
            className="font-bold"
          >
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.4rem',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
                margin: 0
              }}
            >
              Scylla
            </Typography>
          </GradientText>
          <Typography
            variant="caption"
            sx={{ 
              color: "text.secondary",
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}
          >
            Analytics Platform
          </Typography>
        </Box>
      </LogoContainer>

      {/* Enhanced Menu Content */}
      <Box 
        sx={{ 
          position: "absolute",
          top: "120px", // After logo container
          bottom: "140px", // Before user profile container
          left: 0,
          right: 0,
          overflowY: 'auto',
          zIndex: 1,
          px: 2,
          py: 1,
          // Custom scrollbar
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: (theme) => alpha(theme.palette.primary.main, 0.5),
          },
        }}
      >
        <MenuContent />
      </Box>

      {/* Enhanced User Profile Section */}
      <UserProfileContainer>
        <Stack direction="row" spacing={2} alignItems="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 }
                  }
                }}
              />
            }
          >
            <Avatar
              alt={user?.email || "User"}
              src="/static/images/avatar/7.jpg"
              sx={{ 
                width: 44, 
                height: 44,
                border: '3px solid',
                borderColor: 'transparent',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
                }
              }}
            >
              {user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </Badge>
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.primary",
                fontWeight: 600,
                lineHeight: 1.3,
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.email || "No Email"}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={user?.role || "User"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea20, #764ba220)',
                  color: '#667eea',
                  border: '1px solid #667eea40',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
                }}
              />
            </Box>
          </Box>
          
          <OptionsMenu />
        </Stack>
      </UserProfileContainer>
    </Drawer>
  );
}
