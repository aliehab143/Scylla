import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

// Animation keyframes
const lineGrow = keyframes`
  0% {
    height: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    height: 100px;
    opacity: 0.8;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const ScrollConnector = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          '& .scroll-line': {
            background: 'linear-gradient(180deg, #667eea, #764ba2, #f093fb)',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
          },
          '& .scroll-text': {
            color: 'primary.main',
            transform: 'translateY(-2px)',
          },
          '& .scroll-arrow': {
            color: 'primary.main',
            transform: 'translateY(4px) scale(1.1)',
          }
        }
      }}
      onClick={scrollToFeatures}
    >
      {/* Animated Line */}
      <Box
        className="scroll-line"
        sx={{
          width: '2px',
          background: 'linear-gradient(180deg, #667eea40, #764ba240, #f093fb40)',
          borderRadius: '2px',
          position: 'relative',
          animation: `${lineGrow} 2s ease-out`,
          backgroundSize: '200% 200%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            animation: `${pulse} 2s ease-in-out infinite`,
            boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #764ba2, #f093fb)',
            animation: `${pulse} 2s ease-in-out infinite 0.5s`,
            boxShadow: '0 0 8px rgba(240, 147, 251, 0.5)',
          }
        }}
      />

      {/* Scroll Text */}
      <Typography
        className="scroll-text"
        variant="body2"
        sx={{
          mt: 2,
          mb: 1,
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.875rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          letterSpacing: '0.5px',
        }}
      >
        Discover Why Scylla
      </Typography>

      {/* Animated Arrow */}
      <KeyboardArrowDownRoundedIcon
        className="scroll-arrow"
        sx={{
          color: 'text.secondary',
          fontSize: 28,
          animation: `${bounce} 2s ease-in-out infinite`,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Subtle glow effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          animation: `${pulse} 3s ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default ScrollConnector; 