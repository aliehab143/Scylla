import { Card, CardContent, Typography, Box, List, Chip, Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import DataSourceListItem from './DataSourceListItem';

export default function CorrelationCard({ correlation, dataSources }) {
  const connectedSources = correlation.datasources?.map((sourceId) => {
    return dataSources.find(s => s._id === sourceId);
  }).filter(Boolean) || [];

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
        border: (theme) => theme.palette.mode === 'dark'
          ? "1px solid rgba(102, 126, 234, 0.2)"
          : "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? "0 20px 40px rgba(0, 0, 0, 0.3)"
          : "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? "0 32px 64px rgba(0, 0, 0, 0.4)"
            : "0 32px 64px rgba(0, 0, 0, 0.15)",
          border: (theme) => theme.palette.mode === 'dark'
            ? "1px solid rgba(102, 126, 234, 0.4)"
            : "1px solid rgba(102, 126, 234, 0.3)",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
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
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
            opacity: 0.5,
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                <LinkIcon sx={{ fontSize: 18, color: "white" }} />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                {correlation.name}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mt: 2,
            }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Created {new Date(correlation.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>
          
          <Chip
            label={`${connectedSources.length} Source${connectedSources.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              color: "text.primary",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 3, pt: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          />
          Connected Data Sources
        </Typography>
        
        {connectedSources.length > 0 ? (
          <List sx={{ 
            p: 0,
            flex: 1,
            '& .MuiListItem-root': {
              borderRadius: 2,
              mb: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                bgcolor: 'action.hover',
              },
              '&:last-child': {
                mb: 0,
              }
            }
          }}>
            {connectedSources.map((source) => (
              <DataSourceListItem 
                key={source._id}
                source={source}
              />
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              No data sources connected
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 