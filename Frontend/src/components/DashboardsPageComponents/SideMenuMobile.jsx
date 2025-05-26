import PropTypes from "prop-types";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";
import MenuContent from "./MenuContent";
import { AuthContext } from "../../context/Auth/AuthContext";
import Box from "@mui/material/Box";

function SideMenuMobile({ open, toggleDrawer }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toggleDrawer(false)();
    navigate("/");
  };

  const handleProfileClick = () => {
    toggleDrawer(false)();
    navigate("/profile");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
          width: "280px",
          boxShadow: (theme) => theme.shadows[2],
        },
      }}
    >
      <Stack
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
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
              fontSize: "1.25rem",
              letterSpacing: "0.5px",
            }}
          >
            Scylla
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
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
            backgroundColor: "background.default",
          }}
        >
          <Avatar
            sizes="small"
            alt={user?.email || "No Email"}
            src="/static/images/avatar/7.jpg"
            sx={{
              width: 36,
              height: 36,
              border: "2px solid",
              borderColor: "primary.main",
              boxShadow: 1,
            }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {user?.email || "No Email"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
              }}
            >
              {user?.role || "User"}
            </Typography>
          </Box>
        </Stack>

        <Stack sx={{ p: 2, gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<PersonRoundedIcon />}
            onClick={handleProfileClick}
            sx={{
              textTransform: "none",
              py: 1,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              py: 1,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
