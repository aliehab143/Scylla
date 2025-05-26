import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { BASE_URL } from "../constants/constants";
import { AuthContext } from "../context/Auth/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SideMenu from "../components/DashboardsPageComponents/SideMenu";
import AppNavbar from "../components/DashboardsPageComponents/AppNavbar";
import Header from "../components/DashboardsPageComponents/Header";

export default function CsvAnalyzePage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [analysisData, setAnalysisData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("uid");
  const [sortConfig, setSortConfig] = useState({ key: "uid", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        console.log('id is ', id)
        const response = await fetch(`${BASE_URL}/model/logs_anomaly_detector/csv/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
        });
        console.log('this is the csv response is ', response)
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to analyze data , Check The Csv  have valid columns ");
        }

        const result = await response.json();
        console.log("Fetched Analysis Data:", result);

        // Set the sequences array from the response data
        setAnalysisData(result.data?.sequences || []);
      } catch (err) {
        setError(err.message || "An error occurred while analyzing data.");
      }
    };

    fetchAnalysisData();
  }, [id, user?.token]);

  // Handle Sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedData = [...analysisData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setAnalysisData(sortedData);
  };

  // Filter Data
  const filteredData = analysisData?.filter((row) =>
    row[searchField]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Paginate Data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle Page Change
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, Math.min(totalPages, prev + direction)));
  };

  return (
    <div>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {/* SideMenu */}
        <SideMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            px: { xs: 2, md: 4 },
            pb: 5,
            mt: { xs: 8, md: 0 },
            backgroundColor: (theme) =>
              theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : theme.palette.background.default,
          }}
        >
          {/* AppNavbar */}
          <AppNavbar />
          <Box>
            {/* Header */}
            <Header />

            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
              CSV Analyze Page
            </Typography>

            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                {/* Search Bar */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                  }}
                >
                  <TextField
                    label={`Search by ${searchField}`}
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">🔍</InputAdornment>
                      ),
                    }}
                  />
                  <Select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    sx={{ minWidth: { xs: "100%", md: 200 } }}
                  >
                    <MenuItem value="uid">UID</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                    <MenuItem value="anomaly">Anomaly</MenuItem>
                  </Select>
                </Box>

                {/* Data Table */}
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === "uid"}
                            direction={sortConfig.key === "uid" ? sortConfig.direction : "asc"}
                            onClick={() => handleSort("uid")}
                          >
                            UID
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortConfig.key === "anomaly"}
                            direction={sortConfig.key === "anomaly" ? sortConfig.direction : "asc"}
                            onClick={() => handleSort("anomaly")}
                          >
                            Anomaly Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          Event Sequence
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: row.anomaly ? "rgba(255, 0, 0, 0.1)" : "inherit",
                          }}
                        >
                          <TableCell>{row.uid}</TableCell>
                          <TableCell>{row.anomaly ? "Anomaly Detected" : "Normal"}</TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 1,
                              maxWidth: '600px'
                            }}>
                              {row.sequence?.map((event, idx) => (
                                <Paper
                                  key={idx}
                                  elevation={1}
                                  sx={{
                                    padding: '4px 8px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Paper>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handlePageChange(-1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Typography>
                    Page {currentPage} of {totalPages}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
