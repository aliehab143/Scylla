import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { BASE_URL } from "../constants/constants";
import { AuthContext } from "../context/Auth/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";

// Styled DataGrid with enhanced visual appeal matching dashboard theme
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-main': {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(51, 65, 85, 0.6)'
      : 'rgba(248, 250, 252, 0.8)',
    borderBottom: `2px solid ${theme.palette.divider}`,
    fontSize: '0.95rem',
    fontWeight: 600,
    minHeight: '56px !important',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
    },
    '& .MuiDataGrid-columnHeader': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitle': {
      justifyContent: 'center',
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none',
    },
    '&.MuiDataGrid-cell--textCenter': {
      justifyContent: 'center',
    },
    paddingTop: '0',
    paddingBottom: '0',
  },
  '& .MuiDataGrid-row': {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(102, 126, 234, 0.08)'
        : 'rgba(102, 126, 234, 0.04)',
    },
    '&.anomaly': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(244, 67, 54, 0.2)'
        : 'rgba(244, 67, 54, 0.15)',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(244, 67, 54, 0.3)'
          : 'rgba(244, 67, 54, 0.25)',
      },
    },
    '&.normal': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(76, 175, 80, 0.05)'
        : 'rgba(76, 175, 80, 0.03)',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(76, 175, 80, 0.1)'
          : 'rgba(76, 175, 80, 0.08)',
      },
    },
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'transparent',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(51, 65, 85, 0.3)'
        : 'rgba(226, 232, 240, 0.5)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(102, 126, 234, 0.6)'
        : 'rgba(102, 126, 234, 0.4)',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(102, 126, 234, 0.8)'
          : 'rgba(102, 126, 234, 0.6)',
      },
    },
  },
  '& .MuiDataGrid-cellContent': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: '52px',
  },
}));

export default function CsvAnalyzePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  
  const [analysisData, setAnalysisData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        console.log('Fetching analysis for ID:', id);
        
        const response = await fetch(`${BASE_URL}/model/logs_anomaly_detector/csv/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Authorization": `Bearer ${user?.token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to analyze data. Check that the CSV has valid columns.");
        }

        const result = await response.json();
        console.log("Fetched Analysis Data:", result);

        const sequences = result.data?.sequences || [];
        setAnalysisData(sequences);
        setFilteredData(sequences);
      } catch (err) {
        setError(err.message || "An error occurred while analyzing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id, user?.token]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(analysisData);
      return;
    }

    const filtered = analysisData.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value)) {
          return value.some(item => String(item).toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredData(filtered);
  }, [searchTerm, analysisData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Dynamic gradient colors based on theme mode
  const getTitleGradient = () => {
    if (theme.palette.mode === 'dark') {
      return 'linear-gradient(45deg, #F48FB1 30%, #CE93D8 90%)'; // Pink to purple for analyze
    }
    return 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)'; // Red to orange for analyze
  };

  // Calculate statistics
  const totalRecords = analysisData.length;
  const anomalies = analysisData.filter(row => row.anomaly).length;
  const normalRecords = totalRecords - anomalies;
  const anomalyRate = totalRecords > 0 ? ((anomalies / totalRecords) * 100).toFixed(1) : 0;

  // Helper function to calculate column width based on content
  const calculateColumnWidth = (fieldName, data) => {
    if (fieldName === 'rowNumber') return 80;
    if (fieldName === 'anomaly') return 150;
    
    if (fieldName === 'uid') {
      const headerLength = 3; // "UID"
      const maxContentLength = Math.max(
        ...data.map(row => String(row.uid || "").length),
        headerLength
      );
      return Math.min(Math.max(maxContentLength * 10 + 60, 200), 350);
    }
    
    if (fieldName === 'sequence') {
      // For sequence, calculate based on average sequence length
      const avgSequenceLength = data.reduce((acc, row) => {
        const sequenceLength = row.sequence ? row.sequence.length : 0;
        return acc + sequenceLength;
      }, 0) / data.length;
      
      // Base width on average sequence length, with reasonable min/max
      return Math.min(Math.max(avgSequenceLength * 80 + 200, 400), 800);
    }
    
    return 200; // Default width
  };

  // Define columns for DataGrid with content-based sizing
  const columns = [
    {
      field: 'rowNumber',
      headerName: '#',
      width: 80,
      flex: 0,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
              {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'uid',
      headerName: 'UID',
      width: calculateColumnWidth('uid', analysisData),
      flex: 0,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'anomaly',
      headerName: 'Status',
      width: 150,
      flex: 0,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Chip
            icon={params.value ? <BugReportIcon /> : <CheckCircleIcon />}
            label={params.value ? "Anomaly" : "Normal"}
            color={params.value ? "error" : "success"}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
      ),
    },
    {
      field: 'sequence',
      headerName: 'Event Sequence',
      width: calculateColumnWidth('sequence', analysisData),
      flex: 1,
      minWidth: 400,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5,
          py: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {params.value?.map((event, idx) => (
            <Chip
              key={idx}
              label={event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '24px',
                '& .MuiChip-label': {
                  padding: '0 6px',
                },
              }}
            />
          ))}
        </Box>
      ),
    },
  ];

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
            // Use the exact same background as dashboard page
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
            minHeight: "100vh",
          }}
        >
          {/* Background Pattern - Same as dashboard page */}
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
            
            {/* Analysis Header */}
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
                  CSV Anomaly Analysis
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label={searchTerm ? `${filteredData.length} of ${totalRecords} Records` : `${totalRecords} Records`}
                    color={searchTerm ? "secondary" : "primary"}
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                </Stack>
              </Stack>

              {/* Statistics Cards */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                    backdropFilter: "blur(20px)",
                    border: (theme) => theme.palette.mode === 'dark'
                      ? "1px solid rgba(76, 175, 80, 0.2)"
                      : "1px solid rgba(76, 175, 80, 0.3)",
                    flex: 1 
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon color="success" />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {normalRecords}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Normal Records
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                    backdropFilter: "blur(20px)",
                    border: (theme) => theme.palette.mode === 'dark'
                      ? "1px solid rgba(244, 67, 54, 0.2)"
                      : "1px solid rgba(244, 67, 54, 0.3)",
                    flex: 1 
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BugReportIcon color="error" />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {anomalies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Anomalies Detected
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                    backdropFilter: "blur(20px)",
                    border: (theme) => theme.palette.mode === 'dark'
                      ? "1px solid rgba(102, 126, 234, 0.2)"
                      : "1px solid rgba(102, 126, 234, 0.3)",
                    flex: 1 
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpIcon color="primary" />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {anomalyRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Anomaly Rate
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>

              {/* Search Bar */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search across UID, status, and event sequences..."
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
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>

            {/* Enhanced Data Grid Container */}
            <Paper 
              elevation={0}
              sx={{ 
                height: '70vh',
                overflow: "hidden", 
                borderRadius: 3,
                // Use the same glass-morphism effect as dashboard page
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
              <StyledDataGrid
                rows={filteredData.map((row, index) => ({ ...row, id: index }))}
                columns={columns}
                hideFooter={true}
                pagination={false}
                checkboxSelection={false}
                disableRowSelectionOnClick
                getRowClassName={(params) => 
                  params.row.anomaly ? "anomaly" : "normal"
                }
                sx={{
                  height: '100%',
                  '& .MuiDataGrid-virtualScroller': {
                    scrollBehavior: 'smooth',
                  },
                }}
                rowHeight={80}
                rowsLoadingMode="client"
                rowBuffer={50}
                columnBuffer={10}
                disableColumnFilter={false}
                disableColumnSelector={true}
                disableDensitySelector={true}
                loading={loading}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: { paginationModel: { pageSize: -1 } },
                }}
                pageSizeOptions={[]}
                disableVirtualization={false}
                scrollEndThreshold={300}
              />
            </Paper>

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center" sx={{ pb: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate(`/dashboard/csv/${id}`)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                }}
              >
                Back to Dashboard
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
