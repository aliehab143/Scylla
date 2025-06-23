import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle
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

const MetricCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%)'
    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.04) 100%)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  height: '100%',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

export default function TrainingResultsSection({ 
  trainingResults, 
  showResults,
  metricsConfig = [
    { key: 'threshold', label: 'Anomaly Threshold', formatter: (val) => val?.toFixed(4) },
    { key: 'training_sequences', label: 'Training Sequences', formatter: (val) => val },
    { key: 'validation_sequences', label: 'Validation Sequences', formatter: (val) => val },
    { key: 'event_types_count', label: 'Event Types', formatter: (val) => val }
  ]
}) {
  if (!showResults || !trainingResults) return null;

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle color="success" />
        Training Results
      </Typography>
      
      <Grid container spacing={2}>
        {metricsConfig.map(({ key, label, formatter }) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <MetricCard>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {formatter(trainingResults[key])}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </CardContent>
            </MetricCard>
          </Grid>
        ))}
      </Grid>
    </StyledPaper>
  );
} 