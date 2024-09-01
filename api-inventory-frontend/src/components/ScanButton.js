import { Box, Button, LinearProgress, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const ScanButton = ({ apiId, customUrl }) => {
  const { callApi, loading } = useApi();
  const [scanResults, setScanResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const handleScan = async () => {
    try {
      const scanUrl = customUrl ? customUrl : `/apis/${apiId}/scan`;
      
      const initialResults = await callApi('post', scanUrl);
      setScanResults(initialResults);
      setProgress(10);
      setOpen(true);

    } catch (err) {
      console.error('Error scanning API:', err);
      setScanResults({ error: 'Failed to scan the API. Please try again.' });
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={handleScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan API'}
      </Button>

      {/* Display progress bar during scanning */}
      {/* {progress > 0 && progress < 100 && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />} */}

      {/* Display scan results in a modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 500,
            margin: 'auto',
            padding: 2,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Scan Results
          </Typography>
          {scanResults ? (
            scanResults.error ? (
              <Typography color="error">{scanResults.error}</Typography>
            ) : scanResults.length ? (
              scanResults.map((result, index) => (
                <Box key={index} mb={2} sx={{ borderBottom: '1px solid #ddd', pb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {result.name} - {result.risk}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Description:</strong> {result.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>URL:</strong> {result.url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Evidence:</strong> {result.evidence}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Solution:</strong> {result.solution}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No vulnerabilities found during the scan.</Typography>
            )
          ) : (
            <Typography>No scan results available.</Typography>
          )}
          <Button onClick={handleClose} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ScanButton;
