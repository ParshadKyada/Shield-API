import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { scaleLinear } from 'd3-scale';
import React, { useEffect, useState } from 'react';
import { Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import io from 'socket.io-client';

const colorScale = scaleLinear().domain([0, 1000]).range(["#ffedea", "#ff5233"]);

const Container = styled(Grid)({
    padding: '20px',
});

const CustomPaper = styled(Paper)({
    padding: '15px',
    textAlign: 'center',
    color: '#444',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
});

const Title = styled(Typography)({
    marginBottom: '10px',
    fontWeight: 'bold',
});

const MapContainer = styled(Paper)({
    height: '500px',
    width: '100%',
    borderRadius: '10px',
});

const missingCountries = [
    { name: "Singapore", latLng: [1.3521, 103.8198] },
    { name: "BouvetIsland", latLng: [54.4208, 3.3464] },
    { name: "Bermuda", latLng: [32.3078, 64.7505] },
    { name: "Andorra", latLng: [42.5063, 1.5218] },
    { name: "AmericanSamoa", latLng: [14.271, 170.1322] },
    { name: "Bengaluru, Karnataka, India", latLng: [12.9716, 77.5946] },
];

const countries = {
    IN: 88,
    CN: 33,
    RU: 79,
    MY: 2,
    GB: 100,
    FK: 10,
    AR: 50,
    VE: 90,
};

const colorRange = ["#E2AEFF", "#5E32CA"];

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.on('dashboardUpdate', (data) => {
            setDashboardData(data);
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        const getRandomIncrement = () => Math.floor(Math.random() * 6);

        const updateData = () => {
            if (dashboardData) {
                setDashboardData(prevData => ({
                    ...prevData,
                    requests: prevData.requests + getRandomIncrement(),
                    visitors: prevData.visitors + getRandomIncrement(),
                    requestIP: prevData.requestIP + getRandomIncrement(),
                    blocked: prevData.blocked + getRandomIncrement(),
                    ipAddress: prevData.ipAddress + getRandomIncrement(),
                    error4XX: prevData.error4XX + getRandomIncrement(),
                    error5XX: prevData.error5XX + getRandomIncrement(),

                    geoData: prevData.geoData.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                    requestsStatus: prevData.requestsStatus.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                    blockingStatus: prevData.blockingStatus.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                    queryPerSecond: prevData.queryPerSecond.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                    userClients: prevData.userClients.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                    responseStatus: prevData.responseStatus.map(item => ({
                        ...item,
                        value: item.value + getRandomIncrement()
                    })),
                }));
            }
        };

        const intervalId = setInterval(updateData, 10000);

        return () => clearInterval(intervalId);
    }, [dashboardData]);

    const data = dashboardData || {
        requests: 4900,
        visitors: 4200,
        requestIP: 150,
        blocked: 23,
        ipAddress: 172,
        error4XX: 12,
        error5XX: 7,
        geoData: [
            { country: 'India', value: 1000 },
            { country: 'China', value: 3100 },
            { country: 'USA', value: 2000 },
            { country: 'Brazil', value: 1200 },
            { country: 'Australia', value: 900 },
        ],
        requestsStatus: Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i + 1}`, value: Math.floor(Math.random() * 1000) })),
        blockingStatus: Array.from({ length: 10 }, (_, i) => ({ name: `Block ${i + 1}`, value: Math.floor(Math.random() * 100) })),
        queryPerSecond: Array.from({ length: 10 }, (_, i) => ({ name: `QPS ${i + 1}`, value: Math.floor(Math.random() * 100) })),
        userClients: [
            { name: 'Windows', value: 1800 },
            { name: 'Linux', value: 69 },
            { name: 'Mac', value: 300 },
        ],
        responseStatus: [
            { status: '200', value: 3500 },
            { status: '404', value: 800 },
            { status: '500', value: 600 },
        ],
    };

    return (
        <Container container spacing={3}>
            {/* Top Stats */}
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">Requests</Title>
                    <Typography variant="h4">{data.requests}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">Visitors</Title>
                    <Typography variant="h4">{data.visitors}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">Request IP</Title>
                    <Typography variant="h4">{data.requestIP}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">Blocked</Title>
                    <Typography variant="h4">{data.blocked}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">IP Address</Title>
                    <Typography variant="h4">{data.ipAddress}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">4XX Error</Title>
                    <Typography variant="h4">{data.error4XX}</Typography>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <CustomPaper>
                    <Title variant="h6">5XX Error</Title>
                    <Typography variant="h4">{data.error5XX}</Typography>
                </CustomPaper>
            </Grid>

            {/* Geo Location */}
            <Grid item xs={12} md={12}>
                <MapContainer>
                    <Typography variant="h6" className={Title}>Geo Location</Typography>
                    <VectorMap
                        map={worldMill}
                        containerStyle={{
                            width: '100%',
                            height: '500px',
                        }}
                        backgroundColor="#282c34"
                        markers={missingCountries}
                        markerStyle={{
                            initial: {
                                fill: 'red',
                            },
                        }}
                        series={{
                            regions: [
                                {
                                    scale: colorScale,
                                    values: countries,
                                    min: 0,
                                    max: 100,
                                },
                            ],
                        }}
                        onRegionTipShow={(event, label, code) => {
                            const value = countries[code] || "No data";
                            label.html(`
                                <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white; padding-left: 10px">
                                    <p><b>${label.html()}</b></p>
                                    <p>${value}</p>
                                </div>`);
                        }}
                        onMarkerTipShow={(event, label, code) => {
                            label.html(`
                                <div style="background-color: white; border-radius: 6px; min-height: 50px; width: 125px; color: black; padding-left: 10px">
                                    <p><b>${label.html()}</b></p>
                                </div>`);
                        }}
                    />
                </MapContainer>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={6}>
                <CustomPaper>
                    <Title variant="h6">Requests Status</Title>
                    <LineChart width={400} height={200} data={data.requestsStatus}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <CustomPaper>
                    <Title variant="h6">Blocking Status</Title>
                    <LineChart width={400} height={200} data={data.blockingStatus}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#ff5233" />
                    </LineChart>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <CustomPaper>
                    <Title variant="h6">Query Per Second</Title>
                    <LineChart width={400} height={200} data={data.queryPerSecond}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <CustomPaper>
                    <Title variant="h6">User Clients</Title>
                    <PieChart width={400} height={200}>
                        <Pie
                            data={data.userClients}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            label
                        >
                            {data.userClients.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                    </PieChart>
                </CustomPaper>
            </Grid>
            <Grid item xs={12} md={6}>
                <CustomPaper>
                    <Title variant="h6">Response Status</Title>
                    <PieChart width={400} height={200}>
                        <Pie
                            data={data.responseStatus}
                            dataKey="value"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#82ca9d"
                            label
                        >
                            {data.responseStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))}
                        </Pie>
                    </PieChart>
                </CustomPaper>
            </Grid>
        </Container>
    );
};

export default Dashboard;
