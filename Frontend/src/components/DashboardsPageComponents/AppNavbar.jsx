import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import GradientText from '../blocks/TextAnimations/GradientText/GradientText';
import ClickSpark from '../blocks/Animations/ClickSpark/ClickSpark';

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
    borderBottomColor: alpha(theme.palette.primary.main, 0.3),
  }
}));

const LogoContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  spacing: 1,
  justifyContent: 'center',
  marginRight: 'auto',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'scale(1.02)',
    '& img': {
      transform: 'scale(1.1) rotate(3deg)',
    }
  }
}));

const EnhancedMenuButton = styled(MenuButton)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'scale(1.05)',
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  }
}));

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 'none',
        bgcolor: 'transparent',
        backgroundImage: 'none',
        borderBottom: 'none',
        top: 'var(--template-frame-height, 0px)',
        zIndex: 1300,
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 2,
          }}
        >
          <LogoContainer>
            <Box
              component="img"
              src="/siteLogo.png"
              alt="Scylla Logo"
              sx={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
              }}
            />
            <GradientText
              colors={["#667eea", "#764ba2", "#f093fb"]}
              animationSpeed={3}
              showBorder={false}
              className="text-xl font-bold"
            >
              Scylla
            </GradientText>
          </LogoContainer>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ml: 'auto',
            }}
          >
            <ColorModeIconDropdown />
            <ClickSpark>
              <EnhancedMenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuRoundedIcon />
              </EnhancedMenuButton>
            </ClickSpark>
          </Box>
          
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
