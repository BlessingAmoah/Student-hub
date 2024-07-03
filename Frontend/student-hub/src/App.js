import React, { useEffect, useState } from 'react'
import Footer from './components/Footer';
import { Grid, Button, Container } from '@mui/material'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ThemeProvider } from './components/ThemeContext'
import Navbar from './components/Navbar'
import Login from './components/Login';
import Signup from './components/Signup';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import About from './components/About';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import MentorshipPage from './pages/MentorshipPage';
import FriendsList from './pages/Friends';
import { Snackbar, Alert } from '@mui/material';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
// retrieves a value from sessionStorage
// !! converts the token value to a boolean
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token)
  }, []);

  return (
    <ThemeProvider>
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12}>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
              <Alert severity="error">{error}</Alert>
            </Snackbar>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/courses" element={<CoursePage />} />
      <Route path="/mentorship" element={<MentorshipPage  open={open} setOpen={setOpen}  setError={setError} error={error} />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/friends" element={<FriendsList open={open} setOpen={setOpen} error={error} setError={setError} />} />
      </Routes>
      </Grid>
      </Grid>
      </Container>
      <Footer />
    </Router>
    </ThemeProvider>
  );
}

// Landing Page
function Home() {
  return(
  <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <h1> Welcome To Student Hub!!!
        </h1>
        <p> Connect With Peers, Share Experiences, And Collaborate On Projects!</p>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" href="/signup">Sign Up</Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary" href="/login">Log In</Button>
      </Grid>
    </Grid>
  );
}

export default App;
