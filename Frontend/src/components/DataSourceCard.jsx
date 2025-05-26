import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const DataSourceCard = ({ name, description, image, onClick, sx }) => {
  return (
    <Card 
      sx={{ 
        display: "flex", 
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        ...sx
      }}
    >
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
        }}
      >
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center",
          mb: 2,
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: 120,
              height: 120,
              objectFit: "contain",
            }}
            image={image}
            alt={`${name} logo`}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 0 }}>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                {name}
              </Typography>
              <Chip 
                label="New" 
                color="primary" 
                size="small"
                sx={{ 
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                mt: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DataSourceCard;
