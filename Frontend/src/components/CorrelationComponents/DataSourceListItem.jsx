import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function DataSourceListItem({ source }) {
  return (
    <ListItem 
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <ListItemIcon>
        {source.type === 'loki' ? (
          <StorageIcon color="primary" />
        ) : (
          <TimelineIcon color="primary" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            {source.name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            Type: {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
          </Typography>
        }
      />
    </ListItem>
  );
} 