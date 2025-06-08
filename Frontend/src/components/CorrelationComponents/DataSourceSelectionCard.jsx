import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Chip, 
  Tooltip, 
  ListItemButton,
  Avatar,
  Paper,
  Badge
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const getCardConfig = (title) => {
  if (title.includes('Loki')) {
    return {
      primaryColor: '#43e97b',
      secondaryColor: '#52ffb8',
      bgColor: 'rgba(67, 233, 123, 0.1)',
      borderColor: 'rgba(67, 233, 123, 0.3)',
      icon: StorageIcon,
    };
  } else if (title.includes('Prometheus')) {
    return {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      icon: TimelineIcon,
    };
  }
  return {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    bgColor: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    icon: StorageIcon,
  };
};

export default function DataSourceSelectionCard({
  title,
  icon,
  tooltip,
  dataSources,
  selectedSource,
  onSourceSelect,
  onSourceDeselect,
}) {
  const config = getCardConfig(title);
  const IconComponent = config.icon;

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        background: (theme) => theme.palette.mode === 'dark'
          ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${config.borderColor}`,
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? "0 20px 40px rgba(0, 0, 0, 0.3)"
          : "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? "0 32px 64px rgba(0, 0, 0, 0.4)"
            : "0 32px 64px rgba(0, 0, 0, 0.15)",
          border: `1px solid ${config.primaryColor}`,
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          background: `linear-gradient(135deg, ${config.bgColor}, rgba(255, 255, 255, 0.05))`,
          borderRadius: "12px 12px 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${config.primaryColor}20, ${config.secondaryColor}20)`,
            opacity: 0.6,
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
              }}
            >
              <IconComponent sx={{ fontSize: 22, color: "white" }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {dataSources.length} Available
                </Typography>
                <Tooltip title={tooltip} placement="top">
                  <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
            </Box>
          </Box>
          
          {selectedSource && (
            <Badge
              badgeContent={<CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: config.primaryColor,
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  minWidth: 24,
                },
              }}
            >
              <Box />
            </Badge>
          )}
        </Box>
      </Box>

      {/* Selected Source Display */}
      {selectedSource && (
        <Box sx={{ px: 3, pt: 2 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${config.primaryColor}15, ${config.secondaryColor}10)`,
              border: `1px solid ${config.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon sx={{ color: config.primaryColor, fontSize: 20 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {selectedSource.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Currently Selected
                </Typography>
              </Box>
            </Box>
            <Chip
              label="Remove"
              size="small"
              onClick={onSourceDeselect}
              sx={{
                backgroundColor: 'transparent',
                border: `1px solid ${config.primaryColor}`,
                color: config.primaryColor,
                fontWeight: 600,
                fontSize: '0.7rem',
                '&:hover': {
                  backgroundColor: config.bgColor,
                },
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Content Section */}
      <CardContent sx={{ p: 3, pt: selectedSource ? 2 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 16,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
            }}
          />
          Select Data Source
        </Typography>
        
        {dataSources.length > 0 ? (
          <List sx={{ 
            p: 0,
            flex: 1,
            maxHeight: 300,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: config.primaryColor,
              borderRadius: '3px',
              '&:hover': {
                background: config.secondaryColor,
              },
            },
          }}>
            {dataSources.map((source, index) => (
              <ListItemButton
                key={source._id}
                onClick={() => onSourceSelect(source)}
                selected={selectedSource?._id === source._id}
                sx={{
                  borderRadius: 2,
                  mb: 1.5,
                  p: 2,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(226, 232, 240, 0.3)`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    border: `1px solid ${config.borderColor}`,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${config.bgColor}, rgba(30, 41, 59, 0.2))`
                      : `linear-gradient(135deg, ${config.bgColor}, rgba(255, 255, 255, 0.8))`,
                  },
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${config.bgColor}, ${config.primaryColor}10)`,
                    border: `1px solid ${config.primaryColor}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${config.bgColor}, ${config.primaryColor}15)`,
                    },
                  },
                  '&:last-child': {
                    mb: 0,
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                  {selectedSource?._id === source._id ? (
                    <CheckCircleIcon sx={{ color: config.primaryColor, fontSize: 24 }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: selectedSource?._id === source._id ? 700 : 600,
                        color: selectedSource?._id === source._id ? config.primaryColor : 'text.primary',
                      }}
                    >
                      {source.name}
                    </Typography>
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
                      {source.description || 'Ready for correlation'}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <IconComponent sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
              No {title.toLowerCase()} available
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.8rem', mt: 1 }}>
              Add a data source to continue
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 