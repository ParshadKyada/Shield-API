const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

const zapOptions = {
  apiKey: '2k9ehc54vkgpcnmobgramd72d3',
  zapHost: '127.0.0.1',
  zapPort: 8080,
};

app.use(express.static('public'));

const buildZapUrl = (endpoint) => {
  return `http://${zapOptions.zapHost}:${zapOptions.zapPort}${endpoint}`;
};

app.get('/start-scan', async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get(buildZapUrl('/JSON/spider/action/scan/'), {
      params: {
        url: url,
        apikey: zapOptions.apiKey,
      },
      timeout: 60000,
    });
    res.json({ scanId: response.data.scan });
  } catch (error) {
    console.error('Error starting scan:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to start scan', details: error.message });
  }
});

app.get('/check-scan-status', async (req, res) => {
  const scanId = req.query.scanId;
  try {
    const statusResponse = await axios.get(buildZapUrl('/JSON/spider/view/status/'), {
      params: {
        scanId: scanId,
        apikey: zapOptions.apiKey,
      },
      timeout: 60000,
    });
    res.json({ status: parseInt(statusResponse.data.status, 10) });
  } catch (error) {
    console.error('Error checking scan status:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to check scan status', details: error.message });
  }
});


app.get('/generate-report', async (req, res) => {
  const format = req.query.format;
  const reportFileName = `zap_report.${format}`;

  try {
    const reportUrl = `http://${zapOptions.zapHost}:${zapOptions.zapPort}/OTHER/core/other/${format}report/`;

    const reportResponse = await axios.get(reportUrl, {
      params: {
        apikey: zapOptions.apiKey,
      },
      responseType: 'arraybuffer',
    });

    res.set('Content-Disposition', `attachment; filename=${reportFileName}`);
    res.set('Content-Type', format === 'html' ? 'text/html' : 'application/json');
    res.send(reportResponse.data);
    
  } catch (error) {
    console.error('Error generating or sending report:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate or download report', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
