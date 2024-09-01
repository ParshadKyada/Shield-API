const ZapClient = require('zaproxy');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const zapOptions = {
  apiKey: 'cfsea0s2k05van9v2scks3cn56',
  proxy: {
    host: '127.0.0.1',
    port: 8080,
  },
};

const zaproxy = new ZapClient(zapOptions);

async function checkScanStatus(scanId) {
  try {
    const status = await zaproxy.spider.status({ scanId });
    return parseInt(status.status, 10);
  } catch (error) {
    console.error('Error checking scan status:', error.message);
    throw error;
  }
}

async function generateReport(format) {
  try {
    const reportUrl = `http://127.0.0.1:8080/OTHER/core/other/${format}report/?apikey=${zapOptions.apiKey}`;
    
    const reportResponse = await axios.get(reportUrl, {
      responseType: 'arraybuffer',
    });
    const reportContent = reportResponse.data;

    const reportFileName = `zap_report.${format}`;
    fs.writeFileSync(path.join(__dirname, reportFileName), reportContent);
    console.log(`Report saved as ${reportFileName}`);

  } catch (error) {
    console.error('Error generating or saving report:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Body:', error.response.data);
    }
  }
}

async function runScan() {
  const url = 'https://www.pdpu.ac.in/';

  const params = {
    url,
    maxChildren: 5,
    recurse: true,
    subtreeOnly: false,
  };

  console.log('Parameters:', params);

  try {
    const response = await zaproxy.spider.scan(params);
    console.log('Scan initiated:', response);

    const scanId = response.scan;

    let status;
    do {
      status = await checkScanStatus(scanId);
      if (status < 100) {
        console.log(`Scan progress: ${status}%`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } while (status < 100);

    console.log('Scan completed!');

    await generateReport('html');
    await generateReport('json');

  } catch (error) {
    console.error('Error initiating scan:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Body:', error.response.data);
    }
  }
}

runScan();
