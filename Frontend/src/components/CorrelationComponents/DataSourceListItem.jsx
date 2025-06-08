import { ListItem, ListItemIcon, ListItemText, Typography, Box, Chip } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const getDataSourceConfig = (type) => {
  switch (type.toLowerCase()) {
    case 'loki':
      return {
        icon: StorageIcon,
        color: '#43e97b',
        bgColor: 'rgba(67, 233, 123, 0.1)',
        borderColor: 'rgba(67, 233, 123, 0.3)',
        label: 'Loki'
      };
    case 'prometheus':
      return {
        icon: TimelineIcon,
        color: '#667eea',
        bgColor: 'rgba(102, 126, 234, 0.1)',
        borderColor: 'rgba(102, 126, 234, 0.3)',
        label: 'Prometheus'
      };
    case 'csv':
      return {
        icon: InsertDriveFileIcon,
        color: '#f093fb',
        bgColor: 'rgba(240, 147, 251, 0.1)',
        borderColor: 'rgba(240, 147, 251, 0.3)',
        label: 'CSV'
      };
    default:
      return {
        icon: StorageIcon,
        color: '#667eea',
        bgColor: 'rgba(102, 126, 234, 0.1)',
        borderColor: 'rgba(102, 126, 234, 0.3)',
        label: type.charAt(0).toUpperCase() + type.slice(1)
      };
  }
};

export default function DataSourceListItem({ source }) {
  const config = getDataSourceConfig(source.type);
  const IconComponent = config.icon;

  return (
    <ListItem 
      sx={{
        p: 2,
        borderRadius: 2,
        background: (theme) => theme.palette.mode === 'dark'
          ? "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${config.borderColor}`,
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? "0 4px 12px rgba(0, 0, 0, 0.2)"
          : "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? "0 8px 24px rgba(0, 0, 0, 0.3)"
            : "0 8px 24px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${config.color}`,
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            background: config.bgColor,
            border: `1px solid ${config.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent 
            sx={{ 
              fontSize: 20, 
              color: config.color,
            }} 
          />
        </Box>
      </ListItemIcon>
      
      <ListItemText
        sx={{ flex: 1 }}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {source.name}
            </Typography>
            <Chip
              label={config.label}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: config.color,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>
        }
        secondary={
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 0.5,
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Data source connection established
          </Typography>
        }
      />
    </ListItem>
  );
} 