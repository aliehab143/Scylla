import { useContext } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { AuthContext } from "../../context/Auth/AuthContext"; // Adjust the path to AuthContext

const drawerWidth = 280;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    backgroundImage: 'none',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SideMenu() {
  const { user } = useContext(AuthContext); // Get user from AuthContext

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 2,
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <img
          src="/assets/siteLogo.png"
          alt="Scylla Logo"
          style={{ width: 40, height: 40 }}
        />
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 600, 
            color: "text.primary",
            fontSize: '1.25rem',
            letterSpacing: '0.5px'
          }}
        >
          Scylla
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1.5,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: 'background.default',
        }}
      >
        <Avatar
          sizes="small"
          alt={user?.email || "No Email"}
          src="/static/images/avatar/7.jpg"
          sx={{ 
            width: 36, 
            height: 36,
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: 1
          }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "text.primary",
              fontWeight: 500,
              lineHeight: 1.2
            }}
          >
            {user?.email || "No Email"}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: "text.secondary",
              display: 'block'
            }}
          >
            {user?.role || "User"}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
