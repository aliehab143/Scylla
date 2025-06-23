import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";

// Styled DataGrid with enhanced visual appeal
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
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(51, 65, 85, 0.4)'
      : 'rgba(248, 250, 252, 0.6)',
    borderTop: `1px solid ${theme.palette.divider}`,
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

const formatDateTime = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatDateTime:', date);
    return '';
  }
  return Math.floor(date.getTime() / 1000).toString();
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function LokiDashboardPage() {
  const { id } = useParams();
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startTime, setStartTime] = useState(new Date(Date.now() - 60 * 60 * 1000));
  const [endTime, setEndTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [useTimeFilter, setUseTimeFilter] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Refs for debouncing
  const timeChangeDebounceRef = useRef(null);
  const lastFetchParamsRef = useRef(null);

  // Dynamic gradient colors based on theme mode
  const getTitleGradient = () => {
    if (theme.palette.mode === 'dark') {
      return 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'; // Blue to purple for Loki
    }
    return 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)'; // Light blue to cyan for Loki
  };

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((log) => {
      return Object.values(log).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Helper function to calculate column width based on content
  const calculateColumnWidth = (fieldName, data) => {
    if (fieldName === 'rowNumber') return 80;
    
    if (fieldName === 'user_id') {
      const headerLength = 7; // "User ID"
      const maxContentLength = Math.max(
        ...data.map(row => String(row.user_id || "").length),
        headerLength
      );
      return Math.min(Math.max(maxContentLength * 12 + 80, 200), 400);
    }
    
    if (fieldName === 'event_type') {
      const headerLength = 10; // "Event Type"
      const maxContentLength = Math.max(
        ...data.map(row => String(row.event_type || "").length),
        headerLength
      );
      return Math.min(Math.max(maxContentLength * 12 + 80, 180), 300);
    }
    
    if (fieldName === 'timestamp') {
      return 200; // Fixed width for timestamps
    }
    
    return 200; // Default width
  };

  // Define columns for DataGrid
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
      field: 'user_id',
      headerName: 'User ID',
      width: calculateColumnWidth('user_id', logs),
      flex: 0,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Chip
            icon={<PersonIcon />}
            label={params.value || 'Unknown User'}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
      ),
    },
    {
      field: 'event_type',
      headerName: 'Event Type',
      width: calculateColumnWidth('event_type', logs),
      flex: 0,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Chip
            icon={<EventIcon />}
            label={params.value || 'Unknown Event'}
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 200,
      flex: 1,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        // Handle timestamp format: "2025-06-20 23:06:27,020"
        let date;
        try {
          let timestampStr = params.value;
          
          // If the timestamp has a comma for milliseconds, replace it with a period
          if (typeof timestampStr === 'string' && timestampStr.includes(',')) {
            timestampStr = timestampStr.replace(',', '.');
          }
          
          date = new Date(timestampStr);
          
          // If date is invalid, try showing the raw timestamp
          if (isNaN(date.getTime())) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                  {params.value || 'Invalid Date'}
                </Typography>
              </Box>
            );
          }
          
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Stack direction="column" alignItems="center" spacing={0.5}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.primary' }}>
                  {formattedDate}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                  {formattedTime}
                </Typography>
              </Stack>
            </Box>
          );
        } catch (error) {
          console.warn('Error parsing timestamp:', params.value, error);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                {params.value || 'Invalid Date'}
              </Typography>
            </Box>
          );
        }
      },
    },
  ];

  const fetchLogs = useCallback(async (forceRefresh = false) => {
    try {
      console.log('🚀 Starting fetchLogs...');
      console.log('📍 Dashboard ID:', id);
      console.log('👤 User token exists:', !!user?.token);
      
      // Create params signature for duplicate check
      const currentParams = {
        id,
        useTimeFilter,
        startTime: startTime?.getTime(),
        endTime: endTime?.getTime(),
        userToken: user?.token
      };
      
      // Skip if same params and not forced refresh
      if (!forceRefresh && lastFetchParamsRef.current && 
          JSON.stringify(lastFetchParamsRef.current) === JSON.stringify(currentParams)) {
        console.log('⏭️ Skipping fetch - same parameters');
        return;
      }
      
      lastFetchParamsRef.current = currentParams;
      setLoading(true);
      setError(null);
      let url = `${BASE_URL}/dashboard/${id}?query={job="cloud-server-logs"}`;
      
      const now = new Date();
      
      if (streaming) {
        // In streaming mode, fetch last 1 minute of logs
        const endTimestamp = formatDateTime(now);
        const startTimestamp = formatDateTime(new Date(now.getTime() - 60000)); // Last 1 minute
        url += `&start=${startTimestamp}&end=${endTimestamp}`;
        console.log('📅 Streaming window: Last 1 minute until now');
        console.log('📅 From:', new Date(now.getTime() - 60000).toISOString());
        console.log('📅 To:', now.toISOString());
      } else if (useTimeFilter) {
        if (startTime) {
          const startTimestamp = formatDateTime(startTime);
          if (startTimestamp) {
            url += `&start=${startTimestamp}`;
            console.log('⏰ Start timestamp:', startTimestamp);
          }
        }
        if (endTime) {
          const endTimestamp = formatDateTime(endTime);
          if (endTimestamp) {
            url += `&end=${endTimestamp}`;
            console.log('⏰ End timestamp:', endTimestamp);
          }
        }
      }
      
      console.log('🌐 Final URL:', url);
      console.log('🔍 Use time filter:', useTimeFilter);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Raw response data:', data);
      console.log('📝 Data type:', typeof data);
      console.log('📝 Is array:', Array.isArray(data));
      console.log('📝 Data length:', data?.length);
      
      if (!data || !Array.isArray(data)) {
        console.error('❌ Invalid data format - expected array but got:', typeof data);
        throw new Error('Invalid data format received from server');
      }
      
      // Map the actual data format to the expected structure
      const parsedLogs = data.map((item, index) => {
        console.log(`📋 Processing item ${index}:`, item);
        
        // Validate the item structure
        if (!item || typeof item !== 'object') {
          console.warn(`⚠️ Invalid item at index ${index}:`, item);
          return {
            id: index,
            timestamp: 'Invalid Date',
            user_id: 'Unknown User',
            event_type: 'Unknown Event'
          };
        }
        
        return {
          id: index,
          timestamp: item.timestamp || 'Invalid Date',
          user_id: item.uid || 'Unknown User', // uid is the user_id
          event_type: item.type || 'Unknown Event' // type is the event_type
        };
      }).filter(log => log !== null); // Filter out any null entries
      
      console.log('🎯 Parsed logs:', parsedLogs);
      console.log('✨ Successfully fetched', parsedLogs.length, 'logs');
      
      // Handle data differently for streaming vs non-streaming
      if (streaming) {
        // In streaming mode, filter out duplicates based on timestamp and user_id
        setLogs((prevLogs) => {
          const existingKeys = new Set(prevLogs.map(log => `${log.timestamp}-${log.user_id}-${log.event_type}`));
          const newUniqueLogs = parsedLogs.filter(log => !existingKeys.has(`${log.timestamp}-${log.user_id}-${log.event_type}`));
          console.log(`🔄 Streaming (last 1min): ${prevLogs.length} existing logs, ${parsedLogs.length} new logs, ${newUniqueLogs.length} unique new logs`);
          
          const updatedLogs = [...prevLogs, ...newUniqueLogs];
          setFilteredLogs(updatedLogs);
          return updatedLogs;
        });
      } else {
        // Replace logs for non-streaming mode to prevent duplication
        console.log(`📊 Non-streaming: Replacing ${parsedLogs.length} logs`);
        setLogs(parsedLogs);
        setFilteredLogs(parsedLogs);
      }
    } catch (error) {
      console.error("💥 Error fetching logs:", error);
      console.error("💥 Error message:", error.message);
      console.error("💥 Error stack:", error.stack);
      setError(error.message);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchLogs completed');
    }
  }, [id, user?.token, useTimeFilter, startTime, endTime, streaming]);

  // Debounced fetch function for time changes
  const debouncedFetchLogs = useCallback(() => {
    if (timeChangeDebounceRef.current) {
      clearTimeout(timeChangeDebounceRef.current);
    }
    timeChangeDebounceRef.current = setTimeout(() => {
      console.log('⏱️ Debounced fetch triggered');
      fetchLogs(true);
    }, 500); // 0.5 second debounce for faster response
  }, [fetchLogs]);

  // Initial load and auto-refresh effect
  useEffect(() => {
    console.log('🔄 Initial load effect triggered');
    fetchLogs(true);
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('🔄 Auto-refresh triggered');
        fetchLogs(true);
      }, 15000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, user?.token, autoRefresh]);

  // Streaming effect - separate from auto-refresh
  useEffect(() => {
    let interval;
    if (streaming) {
      // Fetch every 1 minute for streaming mode
      interval = setInterval(() => {
        console.log('🔄 Streaming fetch triggered (1 minute interval)');
        fetchLogs(true);
      }, 60000); // 60 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streaming, fetchLogs]);

  // Reset data when switching modes
  useEffect(() => {
    setLogs([]);
    setFilteredLogs([]);
  }, [streaming]);

  // Time filter changes effect (debounced)
  useEffect(() => {
    if (!useTimeFilter) {
      console.log('⏭️ Time filter disabled, fetching without time constraints');
      fetchLogs(true);
      return;
    }
    
    console.log('⏱️ Time parameters changed, debouncing fetch...');
    debouncedFetchLogs();
    
    return () => {
      if (timeChangeDebounceRef.current) {
        clearTimeout(timeChangeDebounceRef.current);
      }
    };
  }, [useTimeFilter, startTime, endTime, debouncedFetchLogs]);

  const handleStartTimeChange = (event) => {
    const value = event.target.value;
    if (value) {
      const newDate = new Date(value);
      if (isNaN(newDate.getTime())) {
        console.warn('Invalid start date:', value);
        return;
      }
      setStartTime(newDate);
    } else {
      setStartTime(new Date(Date.now() - 60 * 60 * 1000)); // Default to 1 hour ago
    }
  };

  const handleEndTimeChange = (event) => {
    const value = event.target.value;
    if (value) {
      const newDate = new Date(value);
      if (isNaN(newDate.getTime())) {
        console.warn('Invalid end date:', value);
        return;
      }
      setEndTime(newDate);
    } else {
      setEndTime(new Date()); // Default to now
    }
  };

  const resetTimeRange = () => {
    const now = new Date();
    setEndTime(now);
    setStartTime(new Date(now.getTime() - 60 * 60 * 1000));
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const toggleStreaming = () => {
    setStreaming(prev => !prev);
    if (!streaming) {
      // Clear logs when starting streaming mode
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const handleTimeFilterToggle = (event) => {
    const checked = event.target.checked;
    setUseTimeFilter(checked);
    
    // Reset to default time range when enabling filter
    if (checked && (!startTime || !endTime)) {
      const now = new Date();
      setEndTime(now);
      setStartTime(new Date(now.getTime() - 60 * 60 * 1000));
    }
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
            // Enhanced gradient background
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.8) 100%)",
            minHeight: "100vh",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={(theme) => ({
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 25% 25%, #667eea20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #764ba220 0%, transparent 50%)'
                : 'radial-gradient(circle at 25% 25%, #4facfe15 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00f2fe15 0%, transparent 50%)',
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
                  Loki Logs Dashboard
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip 
                    icon={<AccessTimeIcon />}
                    label={searchTerm ? `${filteredLogs.length} of ${logs.length} Logs` : `${logs.length} Logs`}
                    color={searchTerm ? "secondary" : "primary"}
                    variant="outlined"
                    sx={{ fontWeight: 'medium' }}
                  />
                  {streaming && (
                    <Chip 
                      icon={<PlayArrowIcon />}
                      label="Streaming (1min)"
                      color="success"
                      variant="filled"
                      sx={{ 
                        fontWeight: 'medium',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  )}
                </Stack>
              </Stack>

              {/* Controls Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) => theme.palette.mode === 'dark'
                    ? "1px solid rgba(102, 126, 234, 0.2)"
                    : "1px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                <Stack spacing={3}>
                  {/* Search Bar */}
                  <TextField
                    fullWidth
                    placeholder="Search across User ID, Event Type, and Timestamp..."
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
                          ? "rgba(51, 65, 85, 0.4)"
                          : "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                      },
                    }}
                  />

                  {/* Time Controls */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useTimeFilter}
                          onChange={handleTimeFilterToggle}
                        />
                      }
                      label="Enable Time Filter"
                    />
                    <TextField
                      label="Start Time"
                      type="datetime-local"
                      value={startTime ? new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={handleStartTimeChange}
                      disabled={!useTimeFilter}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ minWidth: 250 }}
                    />
                    <TextField
                      label="End Time"
                      type="datetime-local"
                      value={endTime ? new Date(endTime.getTime() - endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={handleEndTimeChange}
                      disabled={!useTimeFilter}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ minWidth: 250 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={resetTimeRange}
                      disabled={!useTimeFilter}
                      sx={{ borderRadius: 2 }}
                    >
                      Reset Range
                    </Button>
                    <IconButton
                      onClick={() => fetchLogs(true)}
                      color="primary"
                      sx={{ 
                        ml: 'auto',
                        background: (theme) => theme.palette.mode === 'dark'
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                        '&:hover': {
                          background: (theme) => theme.palette.mode === 'dark'
                            ? "rgba(102, 126, 234, 0.2)"
                            : "rgba(102, 126, 234, 0.1)",
                        }
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                    <Button
                      variant={autoRefresh ? "contained" : "outlined"}
                      onClick={toggleAutoRefresh}
                      color="primary"
                      sx={{ borderRadius: 2 }}
                    >
                      {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
                    </Button>
                    <Button
                      variant={streaming ? "contained" : "outlined"}
                      onClick={toggleStreaming}
                      startIcon={streaming ? <PauseIcon /> : <PlayArrowIcon />}
                      color={streaming ? "error" : "success"}
                      sx={{ borderRadius: 2 }}
                    >
                      {streaming ? "Stop Stream" : "Start Stream"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setLogs([]);
                        setFilteredLogs([]);
                      }}
                      startIcon={<DeleteSweepIcon />}
                      disabled={logs.length === 0}
                      sx={{ borderRadius: 2 }}
                      color="warning"
                    >
                      Clear Logs
                    </Button>
                  </Box>
                </Stack>
              </Paper>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                  }}
                  action={
                    <Button color="inherit" size="small" onClick={() => fetchLogs(true)}>
                      Retry
                    </Button>
                  }
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
                rows={filteredLogs}
                columns={columns}
                pagination
                pageSize={25}
                rowsPerPageOptions={[10, 25, 50, 100]}
                checkboxSelection={false}
                disableRowSelectionOnClick
                sx={{
                  height: '100%',
                  '& .MuiDataGrid-virtualScroller': {
                    scrollBehavior: 'smooth',
                  },
                }}
                rowHeight={80}
                loading={loading}
                getRowId={(row) => row.id}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  );
}