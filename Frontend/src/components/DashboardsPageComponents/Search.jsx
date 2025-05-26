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
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useSearch } from '../../context/Search/SearchContext';

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
    }
    // For datasources, we don't navigate anywhere
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative' }}>
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <OutlinedInput
          size="small"
          id="search"
          placeholder="Search datasources and dashboards…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          sx={{ flexGrow: 1 }}
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
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Please try again or check your connection
              </Typography>
            </Box>
          ) : (
            <List dense>
              {searchResults.datasources.length > 0 && (
                <>
                  <ListItem>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data Sources
                    </Typography>
                  </ListItem>
                  {searchResults.datasources.map((ds) => (
                    <ListItem
                      key={ds._id}
                    >
                      <ListItemIcon>
                        <StorageIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={ds.name}
                        secondary={ds.description || 'No description'}
                      />
                    </ListItem>
                  ))}
                </>
              )}

              {searchResults.dashboards.length > 0 && (
                <>
                  <ListItem>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dashboards
                    </Typography>
                  </ListItem>
                  {searchResults.dashboards.map((db) => (
                    <ListItem
                      key={db._id}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={db.name}
                        secondary={db.description || 'No description'}
                      />
                    </ListItem>
                  ))}
                </>
              )}

              {searchResults.datasources.length === 0 &&
                searchResults.dashboards.length === 0 && (
                  <ListItem>
                    <Typography color="text.secondary">
                      No results found
                    </Typography>
                  </ListItem>
                )}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}
