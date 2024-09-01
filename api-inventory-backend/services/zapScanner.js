// services/zapScanner.js
const ZapClient = require('zaproxy');

const zapOptions = {
    apiKey: process.env.ZAP_API_KEY,
    proxy: {
        host: process.env.ZAP_HOST || '127.0.0.1',
        port: parseInt(process.env.ZAP_PORT) || 8080,
    },
};

const zaproxy = new ZapClient(zapOptions);

async function scanApi(apiUrl) {
    try {
        if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
            throw new Error('Invalid URL format. Make sure the URL starts with http:// or https://');
        }

        const params = {
            url: apiUrl,
            maxChildren: 10,
            recurse: true,
            contextName: '',
            subtreeOnly: false,
        };

        console.log(`Starting spider scan for ${apiUrl}`);
        const spiderScan = await zaproxy.spider.scan(params);

        await waitForSpiderCompletion(spiderScan.scan);
        console.log(`Spider scan completed for ${apiUrl}`);
        const alerts = await zaproxy.core.alerts({ baseurl: apiUrl });
        console.log(`Scan results for ${apiUrl}:`, alerts); 

        return processAlerts(alerts);
    } catch (error) {
        console.error('Error during ZAP scan:', error.message);
        throw new Error('Failed to scan the API. Please try again.');
    }
}

async function waitForSpiderCompletion(scanId) {
    while (true) {
        const status = await zaproxy.spider.status(scanId);
        if (status.status === '100') break;
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

function processAlerts(alerts) {
    const owaspTop10Mapping = {
    };

    return alerts.alerts.map((alert) => ({
        risk: alert.risk,
        name: alert.name,
        description: alert.description,
        owaspCategory: owaspTop10Mapping[alert.name] || 'Other',
        url: alert.url,
        parameter: alert.param,
        evidence: alert.evidence,
        solution: alert.solution,
    }));
}

module.exports = { scanApi };
