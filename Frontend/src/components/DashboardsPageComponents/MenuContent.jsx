import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { alpha, styled } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ClickSpark from '../blocks/Animations/ClickSpark/ClickSpark';

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '12px',
  margin: '4px 0',
  padding: '12px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: active 
    ? (theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%)')
    : 'transparent',
  border: active 
    ? `1px solid ${alpha('#667eea', 0.3)}`
    : `1px solid transparent`,
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.04) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },

  '&:hover': {
    transform: 'translateX(4px)',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.06) 100%)',
    borderColor: alpha('#667eea', 0.4),
    boxShadow: `0 4px 20px ${alpha('#667eea', 0.2)}`,
    
    '&::before': {
      opacity: 1,
    },
    
    '& .MuiListItemIcon-root': {
      transform: 'scale(1.1)',
      color: '#667eea',
    },
    
    '& .menu-indicator': {
      transform: 'scaleX(1)',
    }
  },
  
  '&.Mui-selected': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderColor: alpha('#667eea', 0.5),
    
    '& .MuiListItemIcon-root': {
      color: '#667eea',
    }
  }
}));

const StyledSubListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  margin: '2px 0',
  padding: '8px 12px',
  paddingLeft: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active 
    ? alpha('#667eea', 0.1)
    : 'transparent',
  border: `1px solid transparent`,
  
  '&:hover': {
    transform: 'translateX(6px)',
    background: alpha('#667eea', 0.08),
    borderColor: alpha('#667eea', 0.2),
    
    '& .MuiListItemIcon-root': {
      transform: 'scale(1.05)',
      color: '#667eea',
    }
  }
}));

const MenuIndicator = styled(Box)(() => ({
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%) scaleX(0)',
  transformOrigin: 'left',
  width: '3px',
  height: '20px',
  background: 'linear-gradient(180deg, #667eea, #764ba2)',
  borderRadius: '0 2px 2px 0',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export default function MenuContent() {
  const [openDataSources, setOpenDataSources] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDataSources = () => {
    setOpenDataSources((prevOpen) => !prevOpen);
  };

  const toggleDashboards = () => {
    setOpenDashboards((prevOpen) => !prevOpen);
  };

  const handleNavigate = (route) => {
    navigate(route); 
  };

  const isActiveRoute = (route) => location.pathname === route;
  const isActiveParent = (routes) => routes.some(route => location.pathname.startsWith(route));

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeRoundedIcon />,
      route: '/main',
      badge: null
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: <DashboardRoundedIcon />,
      expandable: true,
      expanded: openDashboards,
      onToggle: toggleDashboards,
      badge: null,
      children: [
        {
          id: 'add-dashboard',
          label: 'Add New Dashboard',
          icon: <AddBoxRoundedIcon />,
          route: '/dashboards/add'
        },
        {
          id: 'view-dashboards',
          label: 'View Existing Dashboards',
          icon: <ViewListRoundedIcon />,
          route: '/dashboards'
        }
      ]
    },
    {
      id: 'datasources',
      label: 'Data Sources',
      icon: <StorageRoundedIcon />,
      expandable: true,
      expanded: openDataSources,
      onToggle: toggleDataSources,
      badge: null,
      children: [
        {
          id: 'add-datasource',
          label: 'Add New Data Source',
          icon: <AddBoxRoundedIcon />,
          route: '/datasources/add'
        },
        {
          id: 'view-datasources',
          label: 'View All Data Sources',
          icon: <ViewListRoundedIcon />,
          route: '/datasources/view'
        },
        {
          id: 'correlate-datasource',
          label: 'Correlate Data Source',
          icon: <LinkRoundedIcon />,
          route: '/datasources/correlate'
        },
        {
          id: 'view-correlations',
          label: 'View Correlations',
          icon: <ViewListRoundedIcon />,
          route: '/datasources/correlations'
        }
      ]
    }
  ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 1 }}>
            <ClickSpark
              sparkColor="#667eea"
              sparkCount={6}
              sparkSize={8}
              sparkRadius={15}
              duration={500}
            >
              <StyledListItemButton
                onClick={item.expandable ? item.onToggle : () => handleNavigate(item.route)}
                active={item.route ? isActiveRoute(item.route) : (item.children && isActiveParent(item.children.map(child => child.route)))}
                sx={{ position: 'relative' }}
              >
                <MenuIndicator className="menu-indicator" />
                
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: 'text.secondary',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {item.badge ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'text.primary',
                    }
                  }}
                />
                
                {item.expandable && (
                  <Box
                    sx={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: item.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'text.secondary',
                    }}
                  >
                    <ExpandMore sx={{ fontSize: 20 }} />
                  </Box>
                )}
              </StyledListItemButton>
            </ClickSpark>
            
            {item.expandable && (
              <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {item.children.map((child, index) => (
                    <ListItem key={child.id} disablePadding sx={{ display: 'block' }}>
                      <Box
                        sx={{
                          animation: item.expanded ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none',
                          '@keyframes slideIn': {
                            from: { opacity: 0, transform: 'translateX(-10px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                          }
                        }}
                      >
                        <ClickSpark
                          sparkColor="#764ba2"
                          sparkCount={4}
                          sparkSize={6}
                          sparkRadius={12}
                          duration={400}
                        >
                          <StyledSubListItemButton
                            onClick={() => handleNavigate(child.route)}
                            active={isActiveRoute(child.route)}
                            sx={{ position: 'relative' }}
                          >
                            <ListItemIcon 
                              sx={{ 
                                minWidth: 32,
                                color: 'text.secondary',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            
                            <ListItemText 
                              primary={child.label}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.85rem',
                                  fontWeight: 400,
                                  color: 'text.primary',
                                }
                              }}
                            />
                            
                            {/* Active indicator for sub-items */}
                            {isActiveRoute(child.route) && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  right: 8,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)',
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.6 }
                                  }
                                }}
                              />
                            )}
                          </StyledSubListItemButton>
                        </ClickSpark>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
