import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { useError } from './ErrorContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }

      const data = await response.json();
      if (!data.userId) {
        setError('Invalid server response. Please try again.');
        return;
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userId', data.userId);

      const isValidUser = await checkUserId(data.userId);
      if (!isValidUser) {
        setError('Invalid user credentials.');
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserId = async (userId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setIsLoading(false);

      if (response.ok) {
        await response.json();
        return true;
      } else {
        setError('UserId not a match!');
        return false;
      }
    } catch (error) {
      setError('Error checking user.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {isLoading && <CircularProgress color="inherit" />}
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12}>
          <h2>Please Login Into Your Account</h2>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid container spacing={2} alignItems="center" justifyContent="center" padding={1}>
                <Grid item xs={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Button onClick={() => navigate('/reset-password')} variant="contained" color="primary">
                    Forgot Password
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
