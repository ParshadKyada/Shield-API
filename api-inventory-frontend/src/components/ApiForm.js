import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const ApiForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        endpoint: '',
        method: '',
        description: ''
    });
    const { callApi, error } = useApi();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await callApi('post', '/apis', formData);
            alert('API added successfully');
            setFormData({ name: '', endpoint: '', method: '', description: '' });
        } catch (error) {
            console.error('Error adding API:', error);
        }
    };

    return (
        <Box mt={3}>
            <Typography variant="h4" gutterBottom>Add New API</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="name"
                    label="API Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="endpoint"
                    label="Endpoint"
                    value={formData.endpoint}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Method</InputLabel>
                    <Select
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
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
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add API
                </Button>
            </form>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default ApiForm;