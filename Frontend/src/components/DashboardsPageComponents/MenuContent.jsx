import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function MenuContent() {
  const [openDataSources, setOpenDataSources] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);
  const navigate = useNavigate(); // Initialize the navigation hook

  const toggleDataSources = () => {
    setOpenDataSources((prevOpen) => !prevOpen);
  };

  const toggleDashboards = () => {
    setOpenDashboards((prevOpen) => !prevOpen);
  };

  const handleNavigate = (route) => {
    navigate(route); 
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {/* Home List Item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => handleNavigate('/main')}>
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton >
        </ListItem>

        {/* Dashboards List Item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={toggleDashboards}>
            <ListItemIcon>
              <AnalyticsRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
            {openDashboards ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDashboards} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/dashboards/add')}>
                <ListItemIcon>
                  <AddBoxRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Add New Dashboard" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/dashboards')}>
                <ListItemIcon>
                  <ViewListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="View Existing Dashboards" />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>

        {/* DataSources List Item */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={toggleDataSources}>
            <ListItemIcon>
              <PeopleRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="DataSources" />
            {openDataSources ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDataSources} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/datasources/add')}>
                <ListItemIcon>
                  <AddBoxRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Add New Data Source" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/datasources/view')}>
                <ListItemIcon>
                  <ViewListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="View All Data Sources" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/datasources/correlate')}>
                <ListItemIcon>
                  <LinkRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Correlate Data Source" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/datasources/correlations')}>
                <ListItemIcon>
                  <ViewListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="View Correlations" />
              </ListItemButton>
            </List>
          </Collapse>
        </ListItem>
      </List>
    </Stack>
  );
}
