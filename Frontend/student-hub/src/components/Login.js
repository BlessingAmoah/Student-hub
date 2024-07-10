import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import { useError } from './ErrorContext'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setError } = useError();
    const [passwordResetEmail, setPasswordResetEmail] = useState('');
    const [ code, setCode ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ isResetMode, setIsResetMode ] = useState(false);
    const [resetStep, setResetStep] = useState(1);

    //handles the submit when logged in.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try{
            const response = await fetch(`${process.env.REACT_APP_API}/auth/login`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
               },
                body: JSON.stringify({ email, password }),
            });

            // checks if the log-in details are correct
            // if correct navigate to the dashboard
            if (!response.ok) {
              const { error } = await response.json();
              setError(error);
              return;
            }
            const data = await response.json();
            if (data.userId === undefined) {
              setError('Invalid server response. Please try again.');
              return;
            }
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userId', data.userId)

            const isValidUser = await checkUserId(data.userId);
            if (!isValidUser) {
              setError('Invalid user credentials.');
              return;
            }
            navigate('/dashboard');
            setIsLoading(false);
        }
        catch (error) {
          setError('An unexpected error occurred. Please try again.');
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
            }
          } catch (error) {
            setError('Error checking user.');
          }
        };

        //request new code
        const handleRequestNewCode = async () => {
          setError('');
          setMessage('');

          try {
            const response = await fetch(`${process.env.REACT_APP_API}/auth/password-resetcode`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({ email: passwordResetEmail }),
            });

            if (response.ok) {
              const data = await response.json();
              setMessage(data.message);
            } else {
              const { error } = await response.json();
              setError(error);
            }
          } catch (error) {
            setError('Request failed. Please try again.')
          }
        };

        // reset password
        const handleResetPassword = async (e) => {
          e.preventDefault();
          setError('');
          setMessage('');

          try {
            const response = await fetch(`${process.env.REACT_APP_API}/auth/reset-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: passwordResetEmail, code, newPassword, confirmPassword }),
            });


            if (response.ok) {
              const data = await response.json();
              setMessage(data.message);
              setIsResetMode(false);
              setResetStep(2)
              navigate('/login')
            } else {
              const { error } = await response.json();
              setError(error);
            }
          } catch (error) {
            setError('Reset failed. please try again.');
          }
        };

        // request password reset
        const handleRequestResetPassword = async (e) => {
          e.preventDefault();
          setError('');
          setMessage('');

          try {
            const response = await fetch(`${process.env.REACT_APP_API}/auth/password-resetcode`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({ email: passwordResetEmail }),
            });

            if (response.ok) {
              const data = await response.json();
              setMessage(data.message);
              setResetStep(2);
              navigate('/reset-password');
            } else {
              const { error } = await response.json();
              setError(error);
            }
          } catch (error) {
            setError('Request failed. Please try again.');
          }
        };

            // rendering state
            return (
                <Container maxWidth="sm">
                  {!isResetMode ? (
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
                          <Grid container spacing={2} alignItems='center'justifyContent='center'padding={1}>
                            <Grid item xs={2}>
                              <Button type="submit" variant="contained" color="primary" >Login</Button>
                            </Grid>
                            <Grid item xs={8}>
                              <Button onClick={() => setIsResetMode(true)} variant="contained" color="primary">Forgot Password</Button>
                            </Grid>
                          </Grid>



                        </Grid>
                      </form>
                    </Grid>
                    </Grid>
                    ) : (
                      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
                        { resetStep === 1 ? (
                            <>
                            <Grid item xs={12}>
                              <h2>Request Password Reset</h2>
                            </Grid>
                            <Grid item xs={12}>
                              <form onSubmit={handleRequestResetPassword}>
                                <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <TextField
                                  fullWidth
                                  type="email"
                                  label="Email"
                                  variant="outlined"
                                  value={passwordResetEmail}
                                  onChange={(e) => setPasswordResetEmail(e.target.value)}
                                  required
                                  />
                                </Grid>
                                <Grid container spacing={2} alignItems='center'justifyContent='center'padding={1}>
                                <Grid item xs={4}>
                                  <Button type="submit" variant="contained" color="primary">Request Reset</Button>
                                </Grid>
                                </Grid>
                                </Grid>
                              </form>
                            </Grid>
                            { message && (
                              <Grid item xs={12}>
                                <p style={{ color: 'green' }}>{message}</p>
                              </Grid>
                            )}
                            </>
                        ) : (
                            <>
                            <Grid item xs={12}>
                              <h2> Reset Password</h2>
                            </Grid>
                            <Grid item xs={12}>
                              <form onSubmit={handleResetPassword}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    label="Verification code"
                                    variant="outlined"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required/>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                    fullWidth
                                    type="password"
                                    label="New Password"
                                    variant="outlined"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm Passowrd"
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required/>
                                  </Grid>
                                  <Grid container spacing={2} alignItems='center'justifyContent='center'padding={1}>
                                  <Grid item xs={4}>
                                    <Button type="submit" variant="contained" color="primary">Reset Password</Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                  <Button onClick={handleRequestNewCode} variant="contained" color="primary">
                                    Request New code
                                  </Button>
                                  </Grid>
                                  </Grid>
                                </Grid>
                              </form>
                            </Grid>
                            {message && (
                              <Grid item xs={12}>
                                <p style={{ color: 'green' }}>{message}</p>
                              </Grid>
                            )}
                            </>
                        )}
                      </Grid>
                    )}
                  {isLoading && <CircularProgress color="inherit" />}
                </Container>
              );
            }

            export default Login;
