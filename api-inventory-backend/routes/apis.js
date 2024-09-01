const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Api = require('../models/Api');
const { scanApi, checkScanStatus, generateReport } = require('../services/zapScanner');

router.get('/', auth, async (req, res) => {
    try {
        const apis = await Api.find({ createdBy: req.user.id });
        res.json(apis);
    } catch (err) {
        console.error('Error fetching APIs:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { name, endpoint, method, description } = req.body;

    if (!name || !endpoint || !method) {
        return res.status(400).json({ msg: 'Please include all required fields: name, endpoint, and method.' });
    }

    try {
        const newApi = new Api({
            name,
            endpoint,
            method,
            description,
            createdBy: req.user.id,
        });

        const api = await newApi.save();
        res.json(api);
    } catch (err) {
        console.error('Error adding API:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { name, endpoint, method, description } = req.body;

    try {
        let api = await Api.findById(req.params.id);
        if (!api) return res.status(404).json({ msg: 'API not found' });

        if (api.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        api.name = name || api.name;
        api.endpoint = endpoint || api.endpoint;
        api.method = method || api.method;
        api.description = description || api.description;

        await api.save();
        res.json(api);
    } catch (err) {
        console.error('Error updating API:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        let api = await Api.findById(req.params.id);
        if (!api) return res.status(404).json({ msg: 'API not found' });

        // Check if the user is authorized to delete the API
        if (api.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Api.findByIdAndRemove(req.params.id);
        res.json({ msg: 'API removed' });
    } catch (err) {
        console.error('Error deleting API:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/:id/scan', auth, async (req, res) => {
    try {
        const api = await Api.findById(req.params.id);
        if (!api) {
            return res.status(404).json({ msg: 'API not found' });
        }

        const scanResults = await scanApi(api.endpoint);

        api.lastScan = {
            date: new Date(),
            results: scanResults,
        };
        await api.save();

        res.json(scanResults);
    } catch (err) {
        console.error('Error scanning API:', err.message);

        if (err.response && err.response.status === 404) {
            res.status(404).json({ msg: 'Scan endpoint not found' });
        } else {
            res.status(500).json({ msg: 'Error during scan' });
        }
    }
});

router.get('/check-scan-status', auth, async (req, res) => {
    const { scanId } = req.query;
    try {
        const status = await checkScanStatus(scanId);
        res.json({ status });
    } catch (err) {
        console.error('Error checking scan status:', err.message);
        res.status(500).json({ msg: 'Error checking scan status' });
    }
});

router.get('/generate-report', auth, async (req, res) => {
    const { scanId, format } = req.query;
    try {
        const report = await generateReport(scanId, format);
        res.json(report);
    } catch (err) {
        console.error('Error generating report:', err.message);
        res.status(500).json({ msg: 'Error generating report' });
    }
});

module.exports = router;
