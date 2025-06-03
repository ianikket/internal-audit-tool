import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Assessment {
  id: number;
  product: string;
  filename: string;
  summary: string;
  controls: string[];
  risks: string[];
  createdAt: string;
}

const AssessmentsList: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [edit, setEdit] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAssessments = async () => {
    const res = await fetch('/api/assessments');
    const data = await res.json();
    setAssessments(data.data);
  };

  useEffect(() => { fetchAssessments(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this assessment?')) return;
    const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSuccess('Assessment deleted.');
      setAssessments(assessments.filter(a => a.id !== id));
    } else {
      setError('Failed to delete assessment.');
    }
  };

  const handleEditSave = async () => {
    if (!edit) return;
    const res = await fetch(`/api/assessments/${edit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    });
    if (res.ok) {
      setSuccess('Assessment updated.');
      setEdit(null);
      fetchAssessments();
    } else {
      setError('Failed to update assessment.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>All Assessments</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Filename</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.product}</TableCell>
                <TableCell>{a.filename}</TableCell>
                <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setSelected(a)}>View</Button>
                  <IconButton size="small" onClick={() => setEdit(a)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(a.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>Assessment Details</DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography variant="subtitle1">Product: {selected.product}</Typography>
              <Typography variant="subtitle2">Summary</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{selected.summary}</Typography>
              <Typography variant="subtitle2">Controls</Typography>
              <List dense>
                {selected.controls && selected.controls.length > 0 ? selected.controls.map((ctrl, idx) => (
                  <ListItem key={idx}><ListItemText primary={ctrl} /></ListItem>
                )) : <ListItem><ListItemText primary="No controls found." /></ListItem>}
              </List>
              <Typography variant="subtitle2">Risks</Typography>
              <List dense>
                {selected.risks && selected.risks.length > 0 ? selected.risks.map((risk, idx) => (
                  <ListItem key={idx}><ListItemText primary={risk} /></ListItem>
                )) : <ListItem><ListItemText primary="No risks found." /></ListItem>}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Assessment</DialogTitle>
        <DialogContent>
          {edit && (
            <>
              <TextField
                label="Product"
                value={edit.product}
                onChange={e => setEdit({ ...edit, product: e.target.value })}
                fullWidth sx={{ mb: 2 }}
              />
              <TextField
                label="Summary"
                value={edit.summary}
                onChange={e => setEdit({ ...edit, summary: e.target.value })}
                fullWidth multiline sx={{ mb: 2 }}
              />
              <TextField
                label="Controls (comma separated)"
                value={edit.controls.join(', ')}
                onChange={e => setEdit({ ...edit, controls: e.target.value.split(',').map(s => s.trim()) })}
                fullWidth sx={{ mb: 2 }}
              />
              <TextField
                label="Risks (comma separated)"
                value={edit.risks.join(', ')}
                onChange={e => setEdit({ ...edit, risks: e.target.value.split(',').map(s => s.trim()) })}
                fullWidth sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentsList; 