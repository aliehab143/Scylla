import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// Styled DataGrid with enhanced visual appeal matching home page theme
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent', // Let parent background show through
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
    '& .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitle': {
      justifyContent: 'center',
    },
    '& .MuiDataGrid-columnHeader': {
      display: 'flex',
      alignItems: 'center', // Vertically center header content
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center', // Vertically center cell content
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none',
    },
    '&.MuiDataGrid-cell--textCenter': {
      justifyContent: 'center',
    },
    // Ensure proper padding and vertical alignment
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
    '&.even': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(102, 126, 234, 0.03)'
        : 'rgba(102, 126, 234, 0.02)',
    },
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none', // Hide footer since we're removing pagination
  },
  '& .MuiDataGrid-selectedRowCount': {
    visibility: 'hidden',
  },
  '& .MuiDataGrid-toolbarContainer': {
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'transparent',
    // Ensure smooth scrolling and proper virtual scrolling
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
  // Ensure all cell content is vertically centered
  '& .MuiDataGrid-cellContent': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: '52px',
  },
}));

const DashboardGrid = ({ type, columns, rows }) => {
  // Debug logging for row count
  console.log("DashboardGrid - Total rows received:", rows?.length);
  console.log("DashboardGrid - First few rows:", rows?.slice(0, 3));
  console.log("DashboardGrid - Last few rows:", rows?.slice(-3));

  if (type !== "csv") {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        minHeight: 200 
      }}>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
          Dashboard type "{type}" is not supported for rendering.
        </Typography>
      </Box>
    );
  }

  if (!columns || columns.length === 0 || !rows || rows.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        minHeight: 200 
      }}>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
          No data available to render this dashboard.
        </Typography>
      </Box>
    );
  }

  // Update row number column to use actual row index for continuous numbering
  const updatedColumns = columns.map(col => {
    if (col.field === 'rowNumber') {
      return {
        ...col,
        renderCell: (params) => {
          // Calculate actual row number based on data index
          const rowIndex = rows.findIndex(row => row.id === params.id);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                {rowIndex + 1}
              </Typography>
            </Box>
          );
        },
      };
    }
    return col;
  });

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={updatedColumns}
        hideFooter={true} // Hide footer completely
        pagination={false} // Disable pagination completely
        checkboxSelection={false}
        disableRowSelectionOnClick
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        sx={{
          height: '100%',
          '& .MuiDataGrid-virtualScroller': {
            // Ensure smooth scrolling and proper virtual scrolling
            scrollBehavior: 'smooth',
          },
        }}
        // Critical settings for displaying all rows
        rowHeight={52}
        // Remove virtual scrolling limitations
        rowsLoadingMode="client"
        // Increase buffers significantly for large datasets
        rowBuffer={50} // Increased from 10
        columnBuffer={5} // Increased from 2
        // Disable virtualization row limit
        hideFooterRowCount={true}
        // Performance optimizations
        disableColumnFilter={false}
        disableColumnSelector={true}
        disableDensitySelector={true}
        // Ensure all rows are loaded
        initialState={{
          pagination: {
            paginationModel: { pageSize: -1 }, // -1 means show all rows
          },
        }}
        // Override any row limits
        rowCount={rows.length}
        // Disable any automatic pagination
        paginationMode="client"
        // Force display of all rows
        autoPageSize={false}
      />
      
      {/* Custom footer showing total rows with home page styling */}
      <Box sx={{ 
        p: 1, 
        borderTop: 1, 
        borderColor: 'divider',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(51, 65, 85, 0.4)'
          : 'rgba(248, 250, 252, 0.6)',
        backdropFilter: "blur(10px)",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          Total Rows: {rows.length.toLocaleString()} (All loaded)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Scroll to view all records • Rows 1-{rows.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardGrid;
