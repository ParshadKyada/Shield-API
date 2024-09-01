// RegisterForm.js
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { callApi, loading, error } = useApi();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi('post', '/auth/register', formData);
      alert('User registered successfully!');
      setFormData({ username: '', password: '' });
    } catch (err) {
      console.error('Error registering user:', err);
    }
  };

  return (
    <Box mt={3} maxWidth="400px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      {error && <Typography color="error" mt={2}>{error.message || 'An error occurred'}</Typography>}
    </Box>
  );
};

export default RegisterForm;
