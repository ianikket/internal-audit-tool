import React from 'react';
import DocumentUpload from '../components/documents/DocumentUpload';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/assessments')}>
        View All Assessments
      </Button>
      <DocumentUpload />
    </Box>
  );
};

export default Dashboard; 