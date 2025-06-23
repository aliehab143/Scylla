import { Card, CardContent, Typography, TextField, Box, InputAdornment } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(102, 126, 234, 0.2)'
    : '1px solid rgba(226, 232, 240, 0.8)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 12px 32px rgba(0, 0, 0, 0.3)'
    : '0 12px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(102, 126, 234, 0.4)'
      : '0 20px 40px rgba(102, 126, 234, 0.2)',
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(102, 126, 234, 0.4)'
      : 'rgba(102, 126, 234, 0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 0.8,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: theme.palette.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.6)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(102, 126, 234, 0.3)'
        : 'rgba(102, 126, 234, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(102, 126, 234, 0.6)'
        : 'rgba(102, 126, 234, 0.4)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 0 20px rgba(102, 126, 234, 0.3)'
        : '0 0 20px rgba(102, 126, 234, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 0 25px rgba(102, 126, 234, 0.5)'
        : '0 0 25px rgba(102, 126, 234, 0.3)',
    },
    '&.Mui-focused': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(15, 23, 42, 0.8)'
        : 'rgba(255, 255, 255, 0.95)',
    }
  },
  '& .MuiInputBase-input': {
    padding: '16px 14px',
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b',
    '&::placeholder': {
      color: theme.palette.mode === 'dark' 
        ? 'rgba(226, 232, 240, 0.6)' 
        : 'rgba(30, 41, 59, 0.6)',
      opacity: 1,
    }
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
    fontWeight: 600,
    '&.Mui-focused': {
      color: '#667eea',
    }
  }
}));

export default function CorrelationNameField({ correlationName, setCorrelationName }) {
  return (
    <StyledCard>
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          opacity: 0.7,
        }}
      />
      
      <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
            }}
          >
            <LinkIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 0.5
              }}
            >
              Correlation Name
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              Give your correlation a descriptive name
            </Typography>
          </Box>
        </Box>
        
        <StyledTextField
          fullWidth
          label="Correlation Name"
          placeholder="e.g., Logs-Metrics Analysis, System Monitoring, Error Tracking"
          value={correlationName}
          onChange={(e) => setCorrelationName(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon 
                  sx={{ 
                    color: correlationName ? '#667eea' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }} 
                />
              </InputAdornment>
            ),
          }}
        />
        
        {correlationName && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 2,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.03) 100%)',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(102, 126, 234, 0.2)'
                : '1px solid rgba(102, 126, 234, 0.15)',
              animation: 'fadeIn 0.3s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#667eea',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              ✓ Correlation name: "{correlationName}"
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
} 