import { Card, CardContent, Typography, TextField } from '@mui/material';

export default function CorrelationNameField({ correlationName, setCorrelationName }) {
  return (
    <Card 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[2],
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
        transition: 'box-shadow 0.3s ease-in-out'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          Correlation Name
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter a name for this correlation"
          value={correlationName}
          onChange={(e) => setCorrelationName(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
} 