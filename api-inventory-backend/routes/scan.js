// routes/scan.js
const express = require('express');
const router = express.Router();
const { scanAndReport } = require('../services/zapScanner');

router.post('/scan', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ msg: 'URL is required' });
    }

    try {
        const report = await scanAndReport(url);
        res.json({ msg: 'Scan completed successfully', report });
    } catch (err) {
        console.error('Error scanning URL:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
