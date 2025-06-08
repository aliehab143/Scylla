import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GradientText from "./blocks/TextAnimations/GradientText/GradientText";
import ClickSpark from "./blocks/Animations/ClickSpark/ClickSpark";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.2),
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.1)`
    : alpha(theme.palette.background.default, 0.1),
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  padding: "12px 20px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.15)`
      : alpha(theme.palette.background.default, 0.15),
    borderColor: alpha(theme.palette.primary.main, 0.3),
    transform: "translateY(-1px)",
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: theme.shape.borderRadius,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "scale(1.02)",
    '& img': {
      transform: "scale(1.1) rotate(5deg)",
    }
  }
}));

const StyledNavButton = styled(Button)(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-2px)",
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
    color: theme.palette.primary.main,
  }
}));

const EnhancedButton = ({ children, variant = "text", onClick, ...props }) => {
  return (
    <ClickSpark>
      <StyledNavButton variant={variant} onClick={onClick} {...props}>
        {children}
      </StyledNavButton>
    </ClickSpark>
  );
};

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
        zIndex: 1300,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            {/* Enhanced Logo Section */}
            <LogoContainer onClick={() => handleNavigate("/")}>
              <Box
                component="img"
                src="/siteLogo.png"
                alt="Scylla Logo"
                sx={{
                  height: "56px", // Increased from 40px
                  width: "56px",
                  objectFit: "contain",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                }}
              />
              <GradientText
                colors={["#667eea", "#764ba2", "#f093fb"]}
                animationSpeed={3}
                showBorder={false}
                className="text-2xl font-bold"
              >
                Scylla
              </GradientText>
            </LogoContainer>

            {/* Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 4, gap: 1 }}>
              <EnhancedButton color="inherit" size="small">
                Features
              </EnhancedButton>
              <EnhancedButton color="inherit" size="small">
                Highlights
              </EnhancedButton>
              <EnhancedButton color="inherit" size="small">
                FAQ
              </EnhancedButton>
              <EnhancedButton color="inherit" size="small">
                Blog
              </EnhancedButton>
            </Box>
          </Box>

          {/* Right Side Actions */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <EnhancedButton
              color="primary"
              variant="text"
              size="small"
              onClick={() => handleNavigate("/signIn")}
              sx={{
                color: "text.primary",
                fontWeight: 500,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 1,
                minWidth: "auto",
                whiteSpace: "nowrap",
                '&:hover': {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                  color: "primary.main",
                }
              }}
            >
              Sign in
            </EnhancedButton>
            <EnhancedButton
              color="primary"
              variant="contained"
              size="small"
              onClick={() => handleNavigate("/signUp")}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                minWidth: "auto",
                whiteSpace: "nowrap",
                '&:hover': {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                  color: "#ffffff",
                }
              }}
            >
              Sign up
            </EnhancedButton>
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <ClickSpark>
              <IconButton 
                aria-label="Menu button" 
                onClick={toggleDrawer(true)}
                sx={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  '&:hover': {
                    backgroundColor: alpha("#667eea", 0.1),
                    transform: "scale(1.1)",
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </ClickSpark>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                  backdropFilter: "blur(20px)",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                },
              }}
            >
              <Box sx={{ p: 3, backgroundColor: "transparent" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                  }}
                >
                  <ClickSpark>
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </ClickSpark>
                </Box>

                <MenuItem sx={{ borderRadius: 1, mb: 1 }}>Features</MenuItem>
                <MenuItem sx={{ borderRadius: 1, mb: 1 }}>Highlights</MenuItem>
                <MenuItem sx={{ borderRadius: 1, mb: 1 }}>FAQ</MenuItem>
                <MenuItem sx={{ borderRadius: 1, mb: 1 }}>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                                 <MenuItem sx={{ borderRadius: 1, mb: 2 }}>
                   <EnhancedButton
                     color="primary"
                     variant="contained"
                     fullWidth
                     onClick={() => handleNavigate("/signUp")}
                     sx={{
                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                       color: "#ffffff",
                       fontWeight: 600,
                       fontSize: "0.9rem",
                       textTransform: "none",
                       borderRadius: "8px",
                       py: 1.5,
                       '&:hover': {
                         background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                         color: "#ffffff",
                       }
                     }}
                   >
                     Sign up
                   </EnhancedButton>
                 </MenuItem>
                                 <MenuItem sx={{ borderRadius: 1 }}>
                   <EnhancedButton
                     color="primary"
                     variant="outlined"
                     fullWidth
                     onClick={() => handleNavigate("/signIn")}
                     sx={{
                       color: "primary.main",
                       borderColor: "primary.main",
                       fontWeight: 500,
                       fontSize: "0.9rem",
                       textTransform: "none",
                       borderRadius: "8px",
                       py: 1.5,
                       '&:hover': {
                         backgroundColor: "rgba(102, 126, 234, 0.08)",
                         borderColor: "primary.main",
                         color: "primary.main",
                       }
                     }}
                   >
                     Sign in
                   </EnhancedButton>
                 </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
