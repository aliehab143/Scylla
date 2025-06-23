import React from 'react';
import {
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Timeline,
  Info,
  Download,
  Delete,
  DataUsage,
  Settings
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

export default function ModelManagementSection({ 
  trainedModels,
  onDownloadModel,
  onDeleteModel,
  onShowModelDetails,
  selectedModel,
  showModelDetails,
  onCloseModelDetails,
  title = "Trained Models"
}) {
  return (
    <>
      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline />
          {title} ({trainedModels.length})
        </Typography>
        
        {trainedModels.length === 0 ? (
          <Alert severity="info">
            No trained models found. Train your first model above!
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Model ID</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Threshold</TableCell>
                  <TableCell>Epochs</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainedModels.map((model) => (
                  <TableRow key={model.model_id}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {model.model_id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(model.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={model.threshold?.toFixed(4)} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {model.hyperparams?.epochs || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => onShowModelDetails(model)} size="small">
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton onClick={() => onDownloadModel(model.model_id)} size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => onDeleteModel(model.model_id)} 
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledPaper>

      {/* Model Details Dialog */}
      <Dialog open={showModelDetails} onClose={onCloseModelDetails} maxWidth="md" fullWidth>
        <DialogTitle>Model Details</DialogTitle>
        <DialogContent>
          {selectedModel && (
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon><DataUsage /></ListItemIcon>
                  <ListItemText 
                    primary="Model ID" 
                    secondary={selectedModel.model_id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Timeline /></ListItemIcon>
                  <ListItemText 
                    primary="Threshold" 
                    secondary={selectedModel.threshold?.toFixed(6)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Settings /></ListItemIcon>
                  <ListItemText 
                    primary="Hyperparameters" 
                    secondary={
                      <Box component="span">
                        {Object.entries(selectedModel.hyperparams || {}).map(([key, value]) => (
                          <Chip 
                            key={key} 
                            label={`${key}: ${value}`} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseModelDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 