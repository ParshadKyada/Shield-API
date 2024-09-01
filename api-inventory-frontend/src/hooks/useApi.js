import axios from 'axios';
import { useState } from 'react';

const useApi = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const callApi = async (method, url, data = null) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios({
                method,
                url: `http://localhost:5000/api${url}`,
                data,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setError(err.response ? err.response.data : 'An error occurred');
            throw err;
        }
    };

    return { callApi, error, loading };
};

export default useApi;