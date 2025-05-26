import { useContext, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../context/Auth/AuthContext";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { BASE_URL } from "../constants/constants";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.data || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "An error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
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
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Paper
              elevation={0}
              sx={{
                p: 4,
                width: "100%",
                maxWidth: 800,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={4}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user?.email?.[0]?.toUpperCase()}
                  </Avatar>
                  <Stack>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                      Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage your account settings and preferences
                    </Typography>
                  </Stack>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Account Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{user?.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Account Type
                      </Typography>
                      <Typography variant="body1">Standard User</Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Change Password
                  </Typography>
                  <form onSubmit={handleChangePassword}>
                    <Stack spacing={2}>
                      {error && (
                        <Alert severity="error" onClose={() => setError("")}>
                          {error}
                        </Alert>
                      )}
                      {success && (
                        <Alert severity="success" onClose={() => setSuccess("")}>
                          {success}
                        </Alert>
                      )}
                      <TextField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        {loading ? "Changing Password..." : "Change Password"}
                      </Button>
                    </Stack>
                  </form>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Preferences
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Theme
                      </Typography>
                      <Typography variant="body1">System Default</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Language
                      </Typography>
                      <Typography variant="body1">English</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </div>
  );
} 