// App.js
import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ApiForm from './components/ApiForm';
import ApiList from './components/ApiList';
import CommandWindow from './components/CommandWindow';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import theme from './theme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  function ExternalRedirect() {
    useEffect(() => {
      window.location.href = 'http://localhost:3001/';
    }, []);

    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: '#0fc6c2', padding: '0 16px' }}>
          <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
            <Typography
              variant="h4"
              style={{
                color: '#000',
                fontWeight: 'normal',
                marginRight: '8px'
              }}
            >
              🔰 Shield API
            </Typography>
            <Typography
              variant="h6"
              style={{
                color: '#000',
                fontWeight: 'normal'
              }}
            >
              By CipherX
            </Typography>
          </div>
          <div style={{ display: 'flex' }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/">Dashboard</Button>
                <Button color="inherit" component={Link} to="/apis">API List</Button>
                <Button color="inherit" component={Link} to="/add-api">Add API</Button>
                <Button color="inherit" component={Link} to="/command">Command Window</Button>
                <Button color="inherit" component={Link} to="/commands">Advanced Scan</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <RegisterForm />
              )
            }
          />

          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/apis"
            element={isAuthenticated ? <ApiList /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-api"
            element={isAuthenticated ? <ApiForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/command"
            element={isAuthenticated ? <CommandWindow /> : <Navigate to="/login" />}
          />
          <Route
            path="/commands"
            element={<ExternalRedirect />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
