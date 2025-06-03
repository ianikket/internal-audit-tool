import React, { useState } from 'react';
import { Button, LinearProgress, Typography, Box, Alert, Paper, List, ListItem, ListItemText, TextField } from '@mui/material';

const SUPPORTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [product, setProduct] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (!SUPPORTED_TYPES.includes(selected.type)) {
        setError('Unsupported file type. Please upload a PDF or Word document.');
        setFile(null);
        return;
      }
      setFile(selected);
      setSuccess(null);
      setError(null);
      setAiResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !product) {
      setError('Please select a file and enter a product name.');
      return;
    }
    setUploading(true);
    setProgress(0);
    setSuccess(null);
    setError(null);
    setAiResult(null);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('product', product);
    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        setError(data.message || 'Upload failed.');
        return;
      }
      setSuccess('File uploaded and analyzed successfully!');
      setFile(null);
      setProduct('');
      if (data.ai) {
        setAiResult(data.ai);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload or analyze file.');
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        New Assessment
      </Typography>
      <TextField
        label="Product Name"
        value={product}
        onChange={e => setProduct(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        disabled={uploading}
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ marginBottom: 16 }}
      />
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || !product || uploading}
        >
          Upload
        </Button>
      </Box>
      {uploading && <LinearProgress variant="determinate" value={progress} />}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {aiResult && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>AI Summary</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{aiResult.summary || 'No summary available.'}</Typography>
          <Typography variant="subtitle1" gutterBottom>Controls</Typography>
          <List dense>
            {(aiResult.controls && aiResult.controls.length > 0) ? aiResult.controls.map((ctrl: any, idx: number) => (
              <ListItem key={idx}><ListItemText primary={ctrl} /></ListItem>
            )) : <ListItem><ListItemText primary="No controls found." /></ListItem>}
          </List>
          <Typography variant="subtitle1" gutterBottom>Risks</Typography>
          <List dense>
            {(aiResult.risks && aiResult.risks.length > 0) ? aiResult.risks.map((risk: any, idx: number) => (
              <ListItem key={idx}><ListItemText primary={risk} /></ListItem>
            )) : <ListItem><ListItemText primary="No risks found." /></ListItem>}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentUpload; 