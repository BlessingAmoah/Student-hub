import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useError } from './ErrorContext'
import '../styling/signup.css'

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const navigate = useNavigate();
  const { setError } = useError();


  //handles the submit button when signing up.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      setIsLoading(false);
      if (response.ok) {
        setIsModalOpen(true);
      } else {
        const { error } = await response.json();
        setError(error);

      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };
// handles the verification of the email to make sure the user is not a robot
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsVerificationLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode.join('') }),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const { error } = await response.json();
        setError(error);
      }
    } catch (error) {
    setError('Failed to verify email.');
    }finally {
      setIsVerificationLoading(false);
    }
  };


 // handle verification code resend
 const handleVerificationCodeResend = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API}/auth/resendverification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setVerificationCode('Verification code has been resent successfully');
    } else {
      const errorData = await response.json();
      setError(errorData.error );
    }
  } catch (error) {
    setError('Failed to resend verification code');
  }
};

  // Handle individual input changes for the verification code
  const handleVerificationCodeChange = (e, num) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      let newCode = [...verificationCode];
      newCode[num] = value;
      setVerificationCode(newCode);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12}>
          <h2>Sign Up</h2>
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
                <TextField
                  fullWidth
                  type="text"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">Sign Up</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
        >

            <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxWidth: 400, margin: 'auto', marginTop: '20vh' }}>
              <h2>Email Verification Code Has Been Sent To Your Email</h2>
              <form onSubmit={handleVerificationSubmit}>
              <div className="verification-container">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className="verification-input"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleVerificationCodeChange(e, index)}
                    required
                  />
                ))}
              </div>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button type="submit" variant="contained" color="primary">Verify</Button>
              </div>
              </form>
              <p style={{ textAlign: 'center' }}>
                Didn't receive a code?{' '}
                <Button component="a" href="#" onClick={handleVerificationCodeResend}>
                Resend Verification Code
              </Button>
              </p>
              {isVerificationLoading && <CircularProgress color="inherit" />}
            </div>
        </Modal>
        {isLoading && <CircularProgress color="inherit" />}
      </Grid>
    </Container>
  );
}

export default Signup;
