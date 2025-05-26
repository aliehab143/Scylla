import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded"; // Icon for Performance Metrics

const DashboardCard = ({ name, type, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        cursor: "pointer",
        "&:hover": { boxShadow: 3 },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "primary.main",
          color: "white",
          marginRight: 2,
        }}
      >
        <BarChartRoundedIcon />
      </Box>

      {/* Dashboard Name and Type */}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {type}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
