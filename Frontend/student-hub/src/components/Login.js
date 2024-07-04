import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'

function Login({ setOpen, setError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //handles the submit when logged in.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/auth/login`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            // checks if the log-in details are correct
            // if correct navigate to the dashboard
            if (response.ok) {
                const data = await response.json();
                // check for userId in the data and not undefined
                if (data.userId !== undefined){

                  //store token and userId in sessionstorgae
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('userId', data.userId)
                // Check if the userId exist in the database
                const isValidUser = await checkUserId(data.userId);
                if (isValidUser) {
                  navigate('/dashboard');
                  setLoading(false);
                } else {
                  setError('Invalid user credentials.');
                  setOpen(true);
                }
              } else {
                setError('Invalid server response. Please try again.');
                setOpen(true);
              }
              } else {
                const { error } = await response.json();
                setError(error);
                setOpen(true);
              }
            } catch (error) {
                setOpen(true);
                setError(error.message);
              }
        };
        // check database for userId
        const checkUserId = async (userId) => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API}/auth/user/${userId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
            });

            if (response.ok) {
              await response.json();
              return true;
            } else {
              setError('UserId not a match!');
              setOpen(true);
            }
          } catch (error) {
            setOpen(true);
            setError('Error checking user.');
          }
        };
            // rendering state
            return (
                <Container maxWidth="sm">
                  <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
                    <Grid item xs={12}>
                      <h2> Please Login Into Your Account</h2>
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
                          <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">Login</Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Grid>
                  </Grid>
                  {loading && <CircularProgress color="inherit" />}
                </Container>
              );
            }

            export default Login;
