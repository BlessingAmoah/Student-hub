import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { useError } from './ErrorContext'


function ResetPassword() {
    const [passwordResetEmail, setPasswordResetEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setError } = useError();
    const navigate = useNavigate();


    //request new code
    const handleRequestNewCode = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

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
        setIsLoading(false);
      };

      // reset password
      const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
          const response = await fetch(`${process.env.REACT_APP_API}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: passwordResetEmail, code, newPassword, confirmPassword }),
          });


          if (response.ok) {
            const data = await response.json();
            setMessage(data.message);
            navigate('/login')
          } else {
            const { error } = await response.json();
            setError(error);
          }
        } catch (error) {
          setError('Reset failed. please try again.');
        }
        setIsLoading(false);
      };

      // request password reset
      const handleRequestResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
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
          setError('Request failed. Please try again.');
        }
        setIsLoading(false);
      };

      return (
        <Container maxWidth="sm">
          <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
            <Grid item xs={12}>
              <h2>{message ? "Reset Password" : "Request Password Reset"}</h2>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={message ? handleResetPassword : handleRequestResetPassword}>
                <Grid container spacing={2}>
                  {!message && (
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
                  )}
                  {message && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="text"
                          label="Verification Code"
                          variant="outlined"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
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
                          label="Confirm Password"
                          variant="outlined"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </Grid>
                    </>
                  )}
                  <Grid container spacing={2} alignItems='center' justifyContent='center'>
                    <Grid item xs={4}>
                      <Button type="submit" variant="contained" color="primary">
                        {message ? "Reset Password" : "Request Reset"}
                      </Button>
                    </Grid>
                    {message && (
                      <Grid item xs={6}>
                        <Button onClick={handleRequestNewCode} variant="contained" color="primary">
                          Request New Code
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </form>
            </Grid>
            {isLoading && <CircularProgress color="inherit" />}
          </Grid>
        </Container>
      );
}

      export default ResetPassword;
