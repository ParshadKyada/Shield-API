const ZapClient = require('zaproxy');
const { emitScanProgress } = require('./server');

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
        const params = {
            url: apiUrl,
            maxChildren: 10,
            recurse: true,
            contextName: '',
            subtreeOnly: false,
        };

        const spiderScan = await zaproxy.spider.scan(params);

        const spiderInterval = setInterval(async () => {
            const spiderStatus = await zaproxy.spider.status(spiderScan.scan);
            emitScanProgress(`Spider Scan Progress: ${spiderStatus.status}%`);

            if (spiderStatus.status === '100') {
                clearInterval(spiderInterval);
                emitScanProgress('Spider Scan Completed. Starting Active Scan...');

                const activeScan = await zaproxy.ascan.scan(params);

                const activeInterval = setInterval(async () => {
                    const activeStatus = await zaproxy.ascan.status(activeScan.scan);
                    emitScanProgress(`Active Scan Progress: ${activeStatus.status}%`);

                    if (activeStatus.status === '100') {
                        clearInterval(activeInterval);
                        emitScanProgress('Active Scan Completed. Fetching Results...');

                        const alerts = await zaproxy.core.alerts({ baseurl: apiUrl });
                        const results = processAlerts(alerts);
                        emitScanProgress('Scan Completed.');
                        return results;
                    }
                }, 5000);
            }
        }, 5000);

    } catch (error) {
        console.error('Error during ZAP scan:', error);
        emitScanProgress('Error during scan. Please check the server logs.');
        throw error;
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
