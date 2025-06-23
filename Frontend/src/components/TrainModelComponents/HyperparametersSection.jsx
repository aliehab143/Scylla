import React from 'react';
import {
  Typography,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Settings,
  ExpandMore
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

export default function HyperparametersSection({ 
  hyperparams, 
  onHyperparamChange,
  parameterConfig = [
    { key: 'time_step', label: 'Time Step', type: 'number' },
    { key: 'lstm_h_dim', label: 'LSTM Hidden Dim', type: 'number' },
    { key: 'z_dim', label: 'Z Dimension', type: 'number' },
    { key: 'batch_size', label: 'Batch Size', type: 'number' },
    { key: 'epochs', label: 'Epochs', type: 'number' },
    { key: 'learning_rate', label: 'Learning Rate', type: 'number', step: '0.0001' }
  ]
}) {
  return (
    <StyledPaper>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings />
            Hyperparameters
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {parameterConfig.map(({ key, label, type, step }) => (
              <Grid item xs={6} key={key}>
                <TextField
                  label={label}
                  type={type}
                  value={hyperparams[key]}
                  onChange={(e) => onHyperparamChange(key, e.target.value)}
                  fullWidth
                  size="small"
                  step={step}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </StyledPaper>
  );
} 