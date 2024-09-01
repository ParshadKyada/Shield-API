// ApiList.js
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import ScanButton from './ScanButton';

const ApiList = () => {
    const [apis, setApis] = useState([]);
    const { callApi, error, loading } = useApi();

    useEffect(() => {
        fetchApis();
    }, []);

    const fetchApis = async () => {
        try {
            const data = await callApi('get', '/apis');
            setApis(data);
        } catch (error) {
            console.error('Error fetching APIs:', error);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress />
        </div>
    );

    if (error) return (
        <Typography color="error" align="center" style={{ marginTop: '20px' }}>
            Error: {error.message || 'An error occurred while fetching APIs'}
        </Typography>
    );

    return (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Method</strong></TableCell>
                        <TableCell><strong>Endpoint</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell> {/* Added Actions Column */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {apis.length > 0 ? (
                        apis.map((api) => (
                            <TableRow key={api._id}>
                                <TableCell>{api.name}</TableCell>
                                <TableCell>{api.method}</TableCell>
                                <TableCell>{api.endpoint}</TableCell>
                                <TableCell>{api.description}</TableCell>
                                <TableCell>
                                    <ScanButton apiId={api._id} /> {/* Added ScanButton */}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography>No APIs available. Please add some APIs.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ApiList;
