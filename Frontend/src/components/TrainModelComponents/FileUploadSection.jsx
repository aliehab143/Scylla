import React from 'react';
import {
  Typography,
  Alert,
  Box
} from '@mui/material';
import {
  CloudUpload
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ClickSpark from '../blocks/Animations/ClickSpark/ClickSpark';
import MagnetLines from '../blocks/Animations/MagnetLines/MagnetLines';
import Noise from '../blocks/Animations/Noise/Noise';
import AnimatedContent from '../blocks/Animations/AnimatedContent/AnimatedContent';

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

const UploadBox = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: '12px',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: isDragActive 
    ? theme.palette.action.hover 
    : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  }
}));

export default function FileUploadSection({ 
  selectedFile, 
  isDragActive, 
  onFileSelect, 
  onDragOver, 
  onDragLeave, 
  onDrop,
  title = "Upload Training Data",
  description = "CSV file with columns: uid, time, type",
  acceptedFileTypes = ".csv"
}) {
  return (
    <StyledPaper>
      <AnimatedContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload />
          {title}
        </Typography>
        
        <ClickSpark
          sparkColor="#667eea"
          sparkCount={8}
          sparkSize={10}
          sparkRadius={20}
          duration={600}
        >
          <UploadBox
            isDragActive={isDragActive}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            {/* Background Noise Effect */}
            <Noise
              className="upload-noise"
              opacity={0.05}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
            
            {/* Magnet Lines Background */}
            {isDragActive && (
              <MagnetLines
                rows={6}
                columns={6}
                containerSize="100%"
                lineColor="rgba(102, 126, 234, 0.3)"
                lineWidth="2px"
                lineHeight="30px"
                baseAngle={0}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
            )}
            
            <input
              id="file-input"
              type="file"
              accept={acceptedFileTypes}
              onChange={onFileSelect}
              style={{ display: 'none' }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <CloudUpload sx={{ 
                fontSize: 48, 
                mb: 2,
                background: selectedFile 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'none',
                backgroundClip: selectedFile ? 'text' : 'inherit',
                WebkitBackgroundClip: selectedFile ? 'text' : 'inherit',
                color: selectedFile ? 'transparent' : 'text.secondary',
                transition: 'all 0.3s ease'
              }} />
              
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  background: selectedFile 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'none',
                  backgroundClip: selectedFile ? 'text' : 'inherit',
                  WebkitBackgroundClip: selectedFile ? 'text' : 'inherit',
                  color: selectedFile ? 'transparent' : 'inherit',
                  transition: 'all 0.3s ease'
                }}
              >
                {selectedFile ? selectedFile.name : 'Select or drop CSV file'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
              
              {isDragActive && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 1, 
                    color: 'primary.main',
                    fontWeight: 'bold',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                >
                  Drop your file here!
                </Typography>
              )}
            </Box>
          </UploadBox>
        </ClickSpark>

        {selectedFile && (
          <AnimatedContent delay={0.2}>
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#4caf50'
                }
              }}
            >
              File selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Alert>
          </AnimatedContent>
        )}
      </AnimatedContent>
    </StyledPaper>
  );
} 