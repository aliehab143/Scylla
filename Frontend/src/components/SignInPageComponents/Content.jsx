import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  boxShadow: theme.palette.mode === 'dark'
    ? "0 8px 32px rgba(0, 0, 0, 0.3)"
    : "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(51, 65, 85, 0.2) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.3) 100%)",
  backdropFilter: "blur(10px)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    transform: "translateY(-4px)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 12px 40px rgba(0, 0, 0, 0.4)"
      : "0 12px 40px rgba(0, 0, 0, 0.1)",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  '&:hover': {
    transform: "translateY(-2px)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 8px 25px rgba(0, 0, 0, 0.3)"
      : "0 8px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const items = [
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'AI-Driven Insights',
    description: 'Leverage advanced AI algorithms to uncover actionable insights from complex user behavior patterns and trends.',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'Enterprise Security',
    description: 'Protect your sensitive data with bank-grade encryption and compliance standards that exceed industry requirements.',
    gradient: 'linear-gradient(135deg, #43e97b, #52ffb8)',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'Infinite Scalability',
    description: 'Built to handle massive datasets and high-traffic environments while maintaining lightning-fast performance.',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
  },
  {
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'Innovation at Core',
    description: 'Stay ahead with cutting-edge features and continuous updates designed for evolving analytics needs.',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
];

export default function Content() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Stack
      sx={{ 
        flexDirection: 'column', 
        alignSelf: 'center', 
        gap: 4, 
        maxWidth: 500,
        position: 'relative',
      }}
    >
      {/* Logo Section */}
      <Fade in={true} timeout={600}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, mb: 2 }}>
          <LogoContainer onClick={handleLogoClick}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/siteLogo.png"
                alt="Scylla Logo"
                style={{ 
                  width: '80px', 
                  height: 'auto',
                }}
              />
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  Scylla
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Analytics Platform
                </Typography>
              </Box>
            </Box>
          </LogoContainer>
        </Box>
      </Fade>

      {/* Tagline */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.3,
            }}
          >
            Transform Data Into Intelligent Decisions
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Discover the power of advanced user behavior analytics with enterprise-grade features designed for modern businesses.
          </Typography>
        </Box>
      </Fade>

      {/* Features */}
      <Stack spacing={3}>
        {items.map((item, index) => (
          <Fade key={index} in={true} timeout={1000 + index * 200}>
            <FeatureCard>
              <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2 }}>
                <StyledAvatar
                  sx={{
                    background: item.gradient,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </StyledAvatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            </FeatureCard>
          </Fade>
        ))}
      </Stack>


    </Stack>
  );
}
