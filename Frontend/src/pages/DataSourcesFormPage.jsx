import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha, styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import ClickSpark from "../components/blocks/Animations/ClickSpark/ClickSpark";
import GradientText from "../components/blocks/TextAnimations/GradientText/GradientText";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
  backdropFilter: "blur(20px)",
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha("#f093fb", 0.3)}`
    : `1px solid ${alpha("#e2e8f0", 0.6)}`,
  borderRadius: "24px",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 20px 40px rgba(0, 0, 0, 0.3)"
    : "0 20px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 30% 30%, #f093fb15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #667eea10 0%, transparent 50%)'
      : 'radial-gradient(circle at 30% 30%, #f093fb08 0%, transparent 50%), radial-gradient(circle at 70% 70%, #667eea06 0%, transparent 50%)',
    pointerEvents: "none",
    borderRadius: "24px",
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
      ? alpha('#1e293b', 0.4)
      : alpha('#ffffff', 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#f093fb', 0.2)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: alpha('#f093fb', 0.4),
      boxShadow: `0 8px 32px ${alpha('#f093fb', 0.15)}`,
    },
    '&.Mui-focused': {
      borderColor: '#f093fb',
      boxShadow: `0 8px 32px ${alpha('#f093fb', 0.25)}`,
      background: theme.palette.mode === 'dark'
        ? alpha('#1e293b', 0.6)
        : alpha('#ffffff', 0.9),
    }
  }
}));

const DropZone = styled(Paper)(({ theme, isDragOver, hasFile }) => ({
  padding: '40px',
  borderRadius: '20px',
  border: `2px dashed ${isDragOver ? '#f093fb' : alpha('#f093fb', 0.3)}`,
  background: hasFile
    ? (theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(102, 126, 234, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(240, 147, 251, 0.08) 0%, rgba(102, 126, 234, 0.05) 100%)')
    : (isDragOver
        ? (theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(102, 126, 234, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(102, 126, 234, 0.08) 100%)')
        : (theme.palette.mode === 'dark'
            ? alpha('#1e293b', 0.4)
            : alpha('#ffffff', 0.7))),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  
  '&:hover': {
    borderColor: '#f093fb',
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 40px ${alpha('#f093fb', 0.2)}`,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDragOver 
      ? 'radial-gradient(circle at center, #f093fb20 0%, transparent 70%)'
      : 'transparent',
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
  }
}));

export default function DataSourceForm() {
  const [csvFile, setCsvFile] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFileChange = (file) => {
    if (file) {
      if (file.type !== "text/csv") {
        setError("Only CSV files are allowed.");
        setCsvFile(null);
        return;
      }
      setCsvFile(file);
      setError("");
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    handleFileChange(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!csvFile || !name) {
      setError("Both name and CSV file are required.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("filename", name);

    try {
      const response = await fetch(`${BASE_URL}/datasource/upload/csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload CSV.");
      }

      setSuccess("CSV uploaded successfully!");
      setCsvFile(null);
      setName("");

      setTimeout(() => navigate("/datasources/view"), 2000);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError(err.message || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.5)'
        }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Uploading CSV File...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we process your data
          </Typography>
        </Box>
      </Backdrop>

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
                ? 'radial-gradient(circle at 20% 80%, #f093fb20 0%, transparent 50%), radial-gradient(circle at 80% 20%, #667eea15 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b10 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 80%, #f093fb10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #667eea08 0%, transparent 50%), radial-gradient(circle at 40% 40%, #43e97b06 0%, transparent 50%)',
              pointerEvents: "none",
              zIndex: 0,
            }
          }}
        >
          <AppNavbar />
          
          <Container 
            maxWidth="md" 
            sx={{ 
              position: "relative", 
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 80px)",
              py: 4
            }}
          >
            <Stack 
              spacing={4} 
              sx={{ 
                width: "100%",
                maxWidth: 600,
                alignItems: "center"
              }}
            >
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
                      background: "linear-gradient(135deg, #f093fb, #667eea)",
                      mb: 3,
                      boxShadow: "0 20px 40px rgba(240, 147, 251, 0.3)",
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-10px)" }
                      }
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  
                  <GradientText
                    colors={["#f093fb", "#667eea", "#43e97b"]}
                    animationSpeed={4}
                    showBorder={false}
                    className="font-bold"
                  >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                      Upload CSV Data
                    </Typography>
                  </GradientText>
                  
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      maxWidth: 500, 
                      mx: "auto", 
                      fontSize: "1.1rem",
                      lineHeight: 1.6
                    }}
                  >
                    Upload your CSV files to start building powerful data visualizations 
                    and analytics dashboards.
                  </Typography>
                </Box>
              </Fade>

              {/* Error Alert */}
              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    onClose={() => setError("")}
                    sx={{
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(244, 67, 54, 0.2)",
                    }}
                  >
                    <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Success Alert */}
              {success && (
                <Fade in={!!success}>
                  <Alert 
                    severity="success"
                    sx={{
                      borderRadius: 3,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                    }}
                  >
                    <AlertTitle sx={{ fontWeight: 600 }}>Success</AlertTitle>
                    {success}
                  </Alert>
                </Fade>
              )}

              {/* Main Form */}
              <Fade in={true} timeout={1000}>
                <StyledCard elevation={0} sx={{ width: "100%" }}>
                  <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={4}>
                        {/* Step 1: Data Source Name */}
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #f093fb, #667eea)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "1.1rem"
                              }}
                            >
                              1
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Data Source Name
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Give your CSV data source a descriptive name
                              </Typography>
                            </Box>
                          </Box>

                          <StyledTextField
                            label="Data Source Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            placeholder="e.g., Sales Data, User Analytics, Monthly Reports"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DescriptionIcon sx={{ color: "text.secondary" }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        {/* Step 2: File Upload */}
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #667eea, #43e97b)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "1.1rem"
                              }}
                            >
                              2
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Upload CSV File
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Drag and drop your CSV file or click to browse
                              </Typography>
                            </Box>
                          </Box>

                          <DropZone
                            isDragOver={isDragOver}
                            hasFile={!!csvFile}
                            onClick={() => fileInputRef.current?.click()}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            elevation={0}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".csv"
                              hidden
                              onChange={handleInputChange}
                            />
                            
                            <Box sx={{ position: "relative", zIndex: 1 }}>
                              {csvFile ? (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                  <CheckCircleIcon 
                                    sx={{ 
                                      fontSize: 48, 
                                      color: "#f093fb",
                                      filter: "drop-shadow(0 4px 8px rgba(240, 147, 251, 0.4))"
                                    }} 
                                  />
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#f093fb" }}>
                                    {csvFile.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    File size: {(csvFile.size / 1024).toFixed(2)} KB
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCsvFile(null);
                                    }}
                                    sx={{
                                      borderColor: "#f093fb",
                                      color: "#f093fb",
                                      "&:hover": {
                                        borderColor: "#f093fb",
                                        background: alpha("#f093fb", 0.1)
                                      }
                                    }}
                                  >
                                    Remove File
                                  </Button>
                                </Box>
                              ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                  <CloudUploadIcon 
                                    sx={{ 
                                      fontSize: 48, 
                                      color: isDragOver ? "#f093fb" : "text.secondary",
                                      transition: "all 0.3s ease"
                                    }} 
                                  />
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: isDragOver ? "#f093fb" : "text.primary"
                                    }}
                                  >
                                    {isDragOver ? "Drop your CSV file here" : "Upload CSV File"}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Drag and drop a CSV file here, or click to browse
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Supported format: .csv • Max size: 10MB
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </DropZone>
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ pt: 2 }}>
                          <ClickSpark
                            sparkColor="#f093fb"
                            sparkCount={12}
                            sparkSize={12}
                            sparkRadius={30}
                            duration={800}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={!csvFile || !name || loading}
                              sx={{
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #f093fb, #667eea)",
                                boxShadow: "0 12px 40px rgba(240, 147, 251, 0.4)",
                                position: "relative",
                                overflow: "hidden",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #e084e5, #5a67d8)",
                                  boxShadow: "0 16px 48px rgba(240, 147, 251, 0.5)",
                                  transform: "translateY(-2px)",
                                },
                                "&:disabled": {
                                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                                  boxShadow: "none",
                                  transform: "none",
                                },
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CloudUploadIcon />
                                Upload CSV Data Source
                              </Box>
                            </Button>
                          </ClickSpark>
                        </Box>
                      </Stack>
                    </form>
                  </CardContent>
                </StyledCard>
              </Fade>
            </Stack>
          </Container>
        </Box>
      </Box>
    </div>
  );
}
