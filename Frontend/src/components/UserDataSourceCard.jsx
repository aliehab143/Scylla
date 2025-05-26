import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import StorageRoundedIcon from "@mui/icons-material/StorageRounded"; // Icon for Data Source

const UserDataSourceCard = ({ name, onClick }) => {
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
        <StorageRoundedIcon />
      </Box>

      {/* Data Source Name */}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserDataSourceCard;
