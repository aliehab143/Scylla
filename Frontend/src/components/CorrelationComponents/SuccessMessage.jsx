import { Box, Typography, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

export default function SuccessMessage({ message, onClose }) {
  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        bgcolor: 'success.light',
        color: 'success.contrastText',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon sx={{ mr: 1 }} />
        <Typography variant="body1">{message}</Typography>
      </Box>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{ color: 'success.contrastText' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
} 