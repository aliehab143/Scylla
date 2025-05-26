import { useState } from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";

export default function PrometheusDashboard({ fetchData, queries, error }) {
  const [selectedQuery, setSelectedQuery] = useState("");
  const [timeRange, setTimeRange] = useState({ start: "", end: "", step: "" });

  const handleFetchData = () => {
    if (!selectedQuery || !timeRange.start || !timeRange.end || !timeRange.step) {
      alert("Please fill in all fields.");
      return;
    }

    fetchData(selectedQuery, timeRange);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Prometheus Dashboard
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Select
        value={selectedQuery}
        onChange={(e) => setSelectedQuery(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>
          Select Query
        </MenuItem>
        {queries.map((query, index) => (
          <MenuItem key={index} value={query}>
            {query}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Start Time"
        type="datetime-local"
        value={timeRange.start}
        onChange={(e) => setTimeRange((prev) => ({ ...prev, start: e.target.value }))}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="End Time"
        type="datetime-local"
        value={timeRange.end}
        onChange={(e) => setTimeRange((prev) => ({ ...prev, end: e.target.value }))}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Step"
        type="number"
        value={timeRange.step}
        onChange={(e) => setTimeRange((prev) => ({ ...prev, step: e.target.value }))}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleFetchData}>
        Fetch Data
      </Button>
    </Box>
  );
}
