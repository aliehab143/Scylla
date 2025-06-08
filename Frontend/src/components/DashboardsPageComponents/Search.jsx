import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LaunchIcon from '@mui/icons-material/Launch';
import { useSearch } from '../../context/Search/SearchContext';

const getDataSourceConfig = (type) => {
  switch (type?.toLowerCase()) {
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
        label: 'Data Source'
      };
  }
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { searchResults, loading, error, search } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    search(value);
    setIsOpen(true);
  };

  const handleItemClick = (item) => {
    if (item.type === 'dashboard') {
      if (item.sourceType === 'csv') {
        navigate(`/dashboard/csv/${item._id}`);
      } else if (item.sourceType === 'prometheus') {
        navigate(`/dashboard/prometheus/${item._id}`);
      } else if (item.sourceType === 'loki') {
        navigate(`/dashboard/loki/${item._id}`);
      }
      setIsOpen(false);
      setQuery('');
    }
    // For datasources, we don't navigate anywhere
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative' }}>
      <FormControl sx={{ width: { xs: '100%', md: '30ch' } }} variant="outlined">
        <OutlinedInput
          size="small"
          id="search"
          placeholder="Search dashboards & data sources..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          sx={{ 
            flexGrow: 1,
            borderRadius: 2,
            background: (theme) => theme.palette.mode === 'dark'
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
            backdropFilter: "blur(10px)",
            border: (theme) => theme.palette.mode === 'dark'
              ? "1px solid rgba(102, 126, 234, 0.2)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              border: (theme) => theme.palette.mode === 'dark'
                ? "1px solid rgba(102, 126, 234, 0.4)"
                : "1px solid rgba(102, 126, 234, 0.3)",
              transform: 'translateY(-1px)',
              boxShadow: (theme) => theme.palette.mode === 'dark'
                ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                : "0 4px 16px rgba(0, 0, 0, 0.1)",
            },
            '&.Mui-focused': {
              border: (theme) => theme.palette.mode === 'dark'
                ? "1px solid rgba(102, 126, 234, 0.6)"
                : "1px solid rgba(102, 126, 234, 0.5)",
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.palette.mode === 'dark'
                ? "0 8px 32px rgba(102, 126, 234, 0.3)"
                : "0 8px 32px rgba(102, 126, 234, 0.2)",
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          startAdornment={
            <InputAdornment position="start" sx={{ color: 'text.primary' }}>
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'search',
          }}
        />
      </FormControl>

      {isOpen && query && (
        <Fade in={true} timeout={200}>
          <Paper
            sx={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              mt: 0.5,
              maxHeight: 500,
              overflow: 'hidden',
              zIndex: 1000,
              borderRadius: 3,
              background: (theme) => theme.palette.mode === 'dark'
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: (theme) => theme.palette.mode === 'dark'
                ? "1px solid rgba(102, 126, 234, 0.2)"
                : "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: (theme) => theme.palette.mode === 'dark'
                ? "0 20px 60px rgba(0, 0, 0, 0.4)"
                : "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 4,
                flexDirection: 'column',
                gap: 2,
              }}>
                <CircularProgress 
                  size={32} 
                  sx={{ 
                    color: (theme) => theme.palette.mode === 'dark' ? '#667eea' : '#5a67d8',
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Searching...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <Typography color="error" variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Search Error
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Please try again or check your connection
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                <List dense sx={{ p: 1 }}>
                  {/* Dashboards Section */}
                  {searchResults.dashboards.length > 0 && (
                    <>
                      <ListItem sx={{ px: 2, py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DashboardIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#667eea' }}>
                            Dashboards ({searchResults.dashboards.length})
                          </Typography>
                        </Box>
                      </ListItem>
                      {searchResults.dashboards.map((dashboard, index) => (
                        <ListItem
                          key={dashboard._id}
                          button
                          onClick={() => handleItemClick(dashboard)}
                          sx={{
                            borderRadius: 2,
                            mx: 1,
                            mb: 0.5,
                            transition: 'all 0.2s ease',
                            background: 'transparent',
                            '&:hover': {
                              background: (theme) => theme.palette.mode === 'dark'
                                ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                                : "linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))",
                              transform: 'translateX(4px)',
                              border: (theme) => theme.palette.mode === 'dark'
                                ? "1px solid rgba(102, 126, 234, 0.3)"
                                : "1px solid rgba(102, 126, 234, 0.2)",
                            },
                            cursor: 'pointer',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                                border: "1px solid rgba(102, 126, 234, 0.3)",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <DashboardIcon sx={{ fontSize: 16, color: '#667eea' }} />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {dashboard.name}
                                </Typography>
                                <LaunchIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.7 }} />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                  {dashboard.description || 'Interactive dashboard'}
                                </Typography>
                                {dashboard.sourceType && (
                                  <Chip
                                    label={dashboard.sourceType.toUpperCase()}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.65rem',
                                      fontWeight: 600,
                                      color: getDataSourceConfig(dashboard.sourceType).color,
                                      backgroundColor: getDataSourceConfig(dashboard.sourceType).bgColor,
                                      border: `1px solid ${getDataSourceConfig(dashboard.sourceType).borderColor}`,
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                      {searchResults.datasources.length > 0 && (
                        <Divider sx={{ my: 1, mx: 2, opacity: 0.3 }} />
                      )}
                    </>
                  )}

                  {/* Data Sources Section */}
                  {searchResults.datasources.length > 0 && (
                    <>
                      <ListItem sx={{ px: 2, py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StorageIcon sx={{ fontSize: 18, color: '#43e97b' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#43e97b' }}>
                            Data Sources ({searchResults.datasources.length})
                          </Typography>
                        </Box>
                      </ListItem>
                      {searchResults.datasources.map((dataSource, index) => {
                        const config = getDataSourceConfig(dataSource.type);
                        const IconComponent = config.icon;
                        
                        return (
                          <ListItem
                            key={dataSource._id}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              mb: 0.5,
                              transition: 'all 0.2s ease',
                              background: 'transparent',
                              '&:hover': {
                                background: `linear-gradient(135deg, ${config.bgColor}, rgba(255, 255, 255, 0.02))`,
                                transform: 'translateX(4px)',
                                border: `1px solid ${config.borderColor}`,
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
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
                                <IconComponent sx={{ fontSize: 16, color: config.color }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    {dataSource.name}
                                  </Typography>
                                  <Chip
                                    label={config.label}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.65rem',
                                      fontWeight: 600,
                                      color: config.color,
                                      backgroundColor: config.bgColor,
                                      border: `1px solid ${config.borderColor}`,
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                                  {dataSource.description || 'Connected data source'}
                                </Typography>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </>
                  )}

                  {/* No Results */}
                  {searchResults.datasources.length === 0 && searchResults.dashboards.length === 0 && (
                    <ListItem sx={{ py: 4, flexDirection: 'column', textAlign: 'center' }}>
                      <SearchRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                      <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                        No results found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search query or check for typos
                      </Typography>
                    </ListItem>
                  )}
                </List>

                {/* Clear Search Button */}
                {(searchResults.datasources.length > 0 || searchResults.dashboards.length > 0) && (
                  <Box sx={{ p: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        onClick={clearSearch}
                        sx={{ 
                          cursor: 'pointer',
                          fontWeight: 500,
                          '&:hover': {
                            color: 'primary.main',
                          },
                          transition: 'color 0.2s ease',
                        }}
                      >
                        Clear search
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
}
