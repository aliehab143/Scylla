import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DashboardGrid = ({ type, columns, rows }) => {
  if (type !== "csv") {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Dashboard type "{type}" is not supported for rendering.
      </Typography>
    );
  }

  if (!columns || columns.length === 0 || !rows || rows.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No data available to render this dashboard.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25, 50]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </Box>
  );
};

export default DashboardGrid;
