import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";
import { AuthContext } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/constants";
import { visuallyHidden } from '@mui/utils';

const formatDateTime = (date) => {
  return Math.floor(date.getTime() * 1e6).toString();
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('user_id');
  const [startTime, setStartTime] = useState(new Date(Date.now() - 60 * 60 * 1000));
  const [endTime, setEndTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [useTimeFilter, setUseTimeFilter] = useState(false);
  const { user } = useContext(AuthContext);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${BASE_URL}/dashboard/${id}?query={job="express_logs"}&limit=${rowsPerPage}`;
      
      if (useTimeFilter) {
        if (startTime) {
          const startTimestamp = formatDateTime(startTime);
          url += `&start=${startTimestamp}`;
        }
        if (endTime) {
          const endTimestamp = formatDateTime(endTime);
          url += `&end=${endTimestamp}`;
        }
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      // Map the new data format to the expected structure
      const parsedLogs = data.map(item => ({
        timestamp: item.timestamp,
        user_id: item.log.sourceId,
        event_type: item.log.type
      }));
      
      setLogs(parsedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError(error.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, user?.token, startTime, endTime, rowsPerPage, autoRefresh]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStartTimeChange = (event) => {
    const value = event.target.value;
    setStartTime(value ? new Date(value) : null);
  };

  const handleEndTimeChange = (event) => {
    const value = event.target.value;
    setEndTime(value ? new Date(value) : null);
  };

  const resetTimeRange = () => {
    const now = new Date();
    setEndTime(now);
    setStartTime(new Date(now.getTime() - 60 * 60 * 1000));
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleTimeFilterToggle = (event) => {
    setUseTimeFilter(event.target.checked);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
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
          <AppNavbar />
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
            <Box sx={{ width: "100%", maxWidth: 1200 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Loki Logs Dashboard
              </Typography>

              {error && (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: 'error.light',
                    color: 'error.contrastText'
                  }}
                >
                  <Typography variant="body1">
                    Error: {error}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={fetchLogs}
                    sx={{ mt: 1 }}
                  >
                    Retry
                  </Button>
                </Paper>
              )}

              <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  value={startTime ? startTime.toISOString().slice(0, 16) : ''}
                  onChange={handleStartTimeChange}
                  disabled={!useTimeFilter}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ minWidth: 250 }}
                  placeholder="Optional"
                />
                <TextField
                  label="End Time"
                  type="datetime-local"
                  value={endTime ? endTime.toISOString().slice(0, 16) : ''}
                  onChange={handleEndTimeChange}
                  disabled={!useTimeFilter}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ minWidth: 250 }}
                  placeholder="Optional"
                />
                <Button
                  variant="outlined"
                  onClick={resetTimeRange}
                  disabled={!useTimeFilter}
                >
                  Reset Time Range
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useTimeFilter}
                      onChange={handleTimeFilterToggle}
                    />
                  }
                  label="Use Time Filter"
                />
                <IconButton
                  onClick={fetchLogs}
                  color="primary"
                  sx={{ ml: 'auto' }}
                >
                  <RefreshIcon />
                </IconButton>
                <Button
                  variant={autoRefresh ? "contained" : "outlined"}
                  onClick={toggleAutoRefresh}
                  color="primary"
                >
                  {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Typography>Loading logs...</Typography>
                </Box>
              ) : logs.length === 0 && !error ? (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    backgroundColor: 'info.light',
                    color: 'info.contrastText'
                  }}
                >
                  <Typography variant="body1">
                    No logs found for the selected criteria.
                  </Typography>
                </Paper>
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="logs table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sortDirection={orderBy === 'user_id' ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === 'user_id'}
                              direction={orderBy === 'user_id' ? order : 'asc'}
                              onClick={() => handleRequestSort('user_id')}
                            >
                              User ID
                              {orderBy === 'user_id' ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            sortDirection={orderBy === 'event_type' ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === 'event_type'}
                              direction={orderBy === 'event_type' ? order : 'asc'}
                              onClick={() => handleRequestSort('event_type')}
                            >
                              Event Type
                              {orderBy === 'event_type' ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            sortDirection={orderBy === 'timestamp' ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === 'timestamp'}
                              direction={orderBy === 'timestamp' ? order : 'asc'}
                              onClick={() => handleRequestSort('timestamp')}
                            >
                              Date
                              {orderBy === 'timestamp' ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            sortDirection={orderBy === 'timestamp' ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === 'timestamp'}
                              direction={orderBy === 'timestamp' ? order : 'asc'}
                              onClick={() => handleRequestSort('timestamp')}
                            >
                              Time
                              {orderBy === 'timestamp' ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {logs
                          .slice()
                          .sort(getComparator(order, orderBy))
                          .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                          .map((log, index) => {
                            const date = new Date(parseInt(log.timestamp) / 1e6);
                            const formattedDate = date.toLocaleDateString();
                            const formattedTime = date.toLocaleTimeString();
                            
                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  '&:nth-of-type(odd)': {
                                    backgroundColor: 'action.hover',
                                  },
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell>{log.user_id}</TableCell>
                                <TableCell>{log.event_type}</TableCell>
                                <TableCell>{formattedDate}</TableCell>
                                <TableCell>{formattedTime}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={logs.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                  />
                </>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}