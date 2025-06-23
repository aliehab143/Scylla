import React from 'react';
import {
  Typography,
  Button,
  Box,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  ModelTraining
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '16px',
}));

export default function TrainingControlSection({ 
  isTraining, 
  onStartTraining, 
  selectedFile, 
  trainingProgress, 
  trainingStatus,
  buttonText = "Start Training",
  trainingButtonText = "Training..."
}) {
  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ModelTraining />
          Training Control
        </Typography>
        <Button
          variant="contained"
          startIcon={isTraining ? <Stop /> : <PlayArrow />}
          onClick={onStartTraining}
          disabled={!selectedFile || isTraining}
          sx={{
            background: (!selectedFile || isTraining) 
              ? (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: (!selectedFile || isTraining)
              ? (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.5)'
              : 'white',
            border: (!selectedFile || isTraining)
              ? (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(102, 126, 234, 0.5)'
                : '1px solid rgba(102, 126, 234, 0.3)'
              : 'none',
            '&:hover': {
              background: (!selectedFile || isTraining)
                ? (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
            '&.Mui-disabled': {
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
              color: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.7) !important'
                : 'rgba(0, 0, 0, 0.5) !important',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(102, 126, 234, 0.5)'
                : '1px solid rgba(102, 126, 234, 0.3)',
            }
          }}
        >
          {isTraining ? trainingButtonText : buttonText}
        </Button>
      </Box>

      {isTraining && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {trainingStatus}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={trainingProgress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            {Math.round(trainingProgress)}% Complete
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
} 