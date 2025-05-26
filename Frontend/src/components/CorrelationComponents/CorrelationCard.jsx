import { Card, CardContent, Typography, Box, List } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DataSourceListItem from './DataSourceListItem';

export default function CorrelationCard({ correlation, dataSources }) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          {correlation.name}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          color: 'text.secondary'
        }}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            Created: {new Date(correlation.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2,
            fontWeight: 'medium',
            color: 'text.secondary'
          }}
        >
          Connected Data Sources:
        </Typography>
        <List sx={{ 
          p: 0,
          '& .MuiListItem-root': {
            borderRadius: 1,
            mb: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }
        }}>
          {correlation.datasources?.map((sourceId) => {
            const source = dataSources.find(s => s._id === sourceId);
            if (!source) return null;
            
            return (
              <DataSourceListItem 
                key={source._id}
                source={source}
              />
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
} 