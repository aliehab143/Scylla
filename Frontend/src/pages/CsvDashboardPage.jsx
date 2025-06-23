import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import DashboardGrid from "../components/DashboardsPageComponents/DashboardGrid";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

export default function CsvDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dashboard/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${user?.token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch dashboard data.");
        }
  
        const result = await response.json();
        console.log("Dashboard data:", result);
  
        // Dynamically generate columns with custom ordering and widths
        if (result.data && result.data.length > 0) {
          const keys = Object.keys(result.data[0]);
          
          // Helper function to calculate column width based on content
          const calculateColumnWidth = (key, data) => {
            const headerLength = key.length;
            const maxContentLength = Math.max(
              ...data.map(row => String(row[key] || "").length),
              headerLength
            );
            
            // Base width with some padding, min 120, max 400
            return Math.min(Math.max(maxContentLength * 10 + 60, 120), 400);
          };

          // Define column order priority
          const getColumnOrder = (key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('uid') || lowerKey.includes('id')) return 0;
            if (lowerKey.includes('type')) return 1;
            if (lowerKey.includes('timestamp') || lowerKey.includes('time') || lowerKey.includes('date')) return 999;
            return 500; // Other columns in the middle
          };

          // Sort keys based on priority
          const sortedKeys = keys.sort((a, b) => getColumnOrder(a) - getColumnOrder(b));

          // Create row number column first
          const rowNumberColumn = {
            field: 'rowNumber',
            headerName: '#',
            width: 80,
            flex: 0,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
              </Typography>
            ),
          };

          const dynamicColumns = sortedKeys.map((key) => {
            const lowerKey = key.toLowerCase();
            const shouldCenterHeader = lowerKey.includes('uid') || 
                                     lowerKey.includes('id') || 
                                     lowerKey.includes('type') || 
                                     lowerKey.includes('timestamp') || 
                                     lowerKey.includes('time') || 
                                     lowerKey.includes('date');

            return {
              field: key,
              headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
              width: calculateColumnWidth(key, result.data),
              flex: key.toLowerCase().includes('uid') || key.toLowerCase().includes('id') ? 0 : 1,
              minWidth: 120,
              sortable: true,
              filterable: true,
              headerAlign: shouldCenterHeader ? 'center' : 'left',
              align: shouldCenterHeader ? 'center' : 'left',
              renderCell: (params) => {
                const value = params.value;
                
                // Special rendering for different column types
                if (lowerKey.includes('type') && value) {
                  return (
                    <Chip
                      label={value}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 'medium' }}
                    />
                  );
                }
                
                if (lowerKey.includes('timestamp') || lowerKey.includes('time') || lowerKey.includes('date')) {
                  return (
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {value}
                    </Typography>
                  );
                }
                
                if (lowerKey.includes('uid') || lowerKey.includes('id')) {
                  return (
                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      {value}
                    </Typography>
                  );
                }
                
                return value;
              },
            };
          });
          
          // Combine row number column with data columns
          setColumns([rowNumberColumn, ...dynamicColumns]);
        }
  
        // Set rows with row numbers
        const processedRows = result.data.map((row, index) => ({
          id: index,
          rowNumber: index + 1,
          ...row,
        }));
        
        setRows(processedRows);
        setFilteredRows(processedRows); // Initialize filtered rows
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An error occurred while fetching the dashboard data.");
      }
    };
  
    fetchDashboardData();
  }, [id, user?.token]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    // Update row numbers for filtered results
    const filteredWithNumbers = filtered.map((row, index) => ({
      ...row,
      rowNumber: index + 1,
    }));

    setFilteredRows(filteredWithNumbers);
  }, [searchTerm, rows]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Dynamic gradient colors based on theme mode
  const getTitleGradient = () => {
    if (theme.palette.mode === 'dark') {
      return 'linear-gradient(45deg, #90CAF9 30%, #81C784 90%)'; // Light blue to light green for dark mode
    }
    return 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'; // Original blue gradient for light mode
  };

  const getButtonGradient = () => {
    if (theme.palette.mode === 'dark') {
      return 'linear-gradient(45deg, #F48FB1 30%, #CE93D8 90%)'; // Pink to purple for dark mode
    }
    return 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)'; // Original red gradient for light mode
  };

  const getButtonHoverGradient = () => {
    if (theme.palette.mode === 'dark') {
      return 'linear-gradient(45deg, #E91E63 30%, #9C27B0 90%)'; // Darker pink to purple for dark mode
    }
    return 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)'; // Original red hover for light mode
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            position: "relative",
            // Use the exact same background as home page
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
            minHeight: "100vh",
          }}
        >
          {/* Background Pattern - Same as home page */}
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 25% 25%, #667eea20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f093fb20 0%, transparent 50%)'
                : 'radial-gradient(circle at 25% 25%, #667eea10 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f093fb10 0%, transparent 50%)',
              opacity: 0.7,
              zIndex: 0,
            })}
          />

          <AppNavbar />
          <Box sx={{ p: 3, pt: { xs: 11, md: 3 }, position: "relative", zIndex: 1 }}>
            <Header />
            
            {/* Dashboard Header */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: "bold",
                    background: getTitleGradient(),
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  CSV Dashboard
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip 
                    label={searchTerm ? `${filteredRows.length} of ${rows.length} Records` : `${rows.length} Records`}
                    color={searchTerm ? "secondary" : "primary"}
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                </Stack>
              </Stack>

              {/* Search Bar */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search across all columns and records..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClearSearch}
                          edge="end"
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' }
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: (theme) => theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                        : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                      backdropFilter: "blur(20px)",
                      border: (theme) => theme.palette.mode === 'dark'
                        ? "1px solid rgba(102, 126, 234, 0.2)"
                        : "1px solid rgba(226, 232, 240, 0.8)",
                      borderRadius: 3,
                      '&:hover': {
                        border: (theme) => theme.palette.mode === 'dark'
                          ? "1px solid rgba(102, 126, 234, 0.3)"
                          : "1px solid rgba(226, 232, 240, 1)",
                      },
                      '&.Mui-focused': {
                        border: (theme) => theme.palette.mode === 'dark'
                          ? "1px solid rgba(102, 126, 234, 0.5)"
                          : "1px solid rgba(102, 126, 234, 0.8)",
                      },
                    },
                  }}
                />
              </Box>

              {error && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'error.light', 
                    color: 'error.contrastText',
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  <Typography>{error}</Typography>
                </Paper>
              )}
            </Box>

            {/* Enhanced Data Grid Container */}
            <Paper 
              elevation={0}
              sx={{ 
                height: '70vh',
                overflow: "hidden", 
                borderRadius: 3,
                // Use the same glass-morphism effect as home page cards
                background: (theme) => theme.palette.mode === 'dark'
                  ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                border: (theme) => theme.palette.mode === 'dark'
                  ? "1px solid rgba(102, 126, 234, 0.2)"
                  : "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? "0 20px 40px rgba(0, 0, 0, 0.4)"
                  : "0 20px 40px rgba(0, 0, 0, 0.1)",
                mb: 3,
              }}
            >
              <DashboardGrid type="csv" columns={columns} rows={filteredRows} />
            </Paper>

            {/* Action Button */}
            <Box sx={{ display: "flex", justifyContent: "center", pb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate(`/analyze/${id}`)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  background: getButtonGradient(),
                  '&:hover': {
                    background: getButtonHoverGradient(),
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 8px 25px rgba(233, 30, 99, 0.3)'
                      : '0 8px 25px rgba(255, 107, 107, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Analyze CSV Data
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
