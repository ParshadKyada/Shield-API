import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const CommandWindow = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [response, setResponse] = useState('');
    const { callApi, error } = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await callApi(method.toLowerCase(), url);
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponse(JSON.stringify(error, null, 2));
        }
    };

    return (
        <Box mt={3}>
            <Typography variant="h4" gutterBottom>Command Window</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Method</InputLabel>
                    <Select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Send Request
                </Button>
            </form>
            {error && <Typography color="error">{error}</Typography>}
            {response && (
                <Paper style={{ marginTop: 16, padding: 16 }}>
                    <Typography variant="h6" gutterBottom>Response:</Typography>
                    <pre>{response}</pre>
                </Paper>
            )}
        </Box>
    );
};

export default CommandWindow;