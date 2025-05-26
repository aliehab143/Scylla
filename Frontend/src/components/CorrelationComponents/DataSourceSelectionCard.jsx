import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box, Chip, Tooltip, ListItemButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import InfoIcon from '@mui/icons-material/Info';

export default function DataSourceSelectionCard({
  title,
  icon,
  tooltip,
  dataSources,
  selectedSource,
  onSourceSelect,
  onSourceDeselect,
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6">
            {title}
          </Typography>
          <Tooltip title={tooltip}>
            <InfoIcon sx={{ ml: 1, color: 'text.secondary' }} />
          </Tooltip>
        </Box>
        {selectedSource && (
          <Chip
            label={`Selected: ${selectedSource.name}`}
            color="primary"
            sx={{ mb: 2 }}
            onDelete={onSourceDeselect}
          />
        )}
        <List sx={{ 
          maxHeight: 400,
          overflow: 'auto',
          '& .MuiListItem-root': {
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            },
          },
        }}>
          {dataSources.map((source) => (
            <ListItemButton
              key={source._id}
              onClick={() => onSourceSelect(source)}
              selected={selectedSource?._id === source._id}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedSource?._id === source._id}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary={source.name}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {source.description || 'No description available'}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
} 