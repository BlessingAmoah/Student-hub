import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button, Modal, TextField, Input } from '@mui/material';

function Profile({ setOpen, setError, error }) {
  const [profile, setProfile] = useState({
    name: '',
    profilePicture: '',
    bio: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    school: '',
    major: '',
    interest: '',
    mentorship: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
         setError('Token not found in sessionStorage');
         setOpen(true)
        }
// profile page fetch from the server
        const response = await fetch(`${process.env.REACT_APP_API}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          const error = await response.json();
          setError('Failed to fetch profile.', error);
          setOpen(true)
        }
      } catch (error) {
        setError('Failed to fetch profile.');
        setOpen(true)
      }
    };

    fetchProfile();
  },[setOpen, setError]);
//request to submit profile page update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        handleClose();
      } else {
        setError('Failed to update profile.');
        setOpen(true)
      }
    } catch (error) {
      setError('Failed to update profile.');
      setOpen(true)
    }
  };
//profile change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value !== undefined) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };
// upload a profile picture
// connects with the server using multer to upload and save in uploads file which is in the backend
  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/profile/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: `${process.env.REACT_APP_API}/${data.profilePicture}`,
        }));
      } else {
        const error = await response.json();
        setError('Failed to upload profile picture.', error);
        setOpen(true)
      }
    } catch (error) {
      setError('Failed to upload profile picture.');
      setOpen(true)
    }
  };


  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12}>
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12}>
            <Typography variant="h5">
              Loading profile...
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Profile Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
              {profile.profilePicture && (
                <img src={profile.profilePicture} alt="Profile" style={{ maxWidth: '20%', marginTop: 20 }} />
              )}
            </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Name: {profile.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Bio: {profile.bio}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Email: {profile.email}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Phone number: {profile.phone}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Address: {profile.address}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            City: {profile.city}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            State: {profile.state}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            School: {profile.school}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Major: {profile.major}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Interest: {profile.interest}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Mentorship status: {profile.mentorship}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Edit
          </Button>
        </Grid>

        {profile && (
      <Modal
      open={isModalOpen}
      onClose={handleClose}
      style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
    >

    <div style={{  padding: 5, borderRadius: 10, backgroundColor: 'white' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} columns={2}>
                <Grid item xs={12}>
                      {profile.profilePicture && (
                        <img src={profile.profilePicture} alt="Profile" style={{ maxWidth: '20%', marginTop: 20 }} />
                      )}
                    </Grid>

                    <Grid item xs={12}>
          <Input type="file" onChange={handlePictureUpload} />
          </Grid>
          <Grid item xs={1}>
          <TextField
              fullWidth
              type="text"
              label="Name"
              variant="outlined"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Bio"
              variant="outlined"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Phone"
              variant="outlined"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Address"
              variant="outlined"
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="City"
              variant="outlined"
              name="city"
              value={profile.city || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="State"
              variant="outlined"
              name="state"
              value={profile.state || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="School"
              variant="outlined"
              name="school"
              value={profile.school || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Major"
              variant="outlined"
              name="major"
              value={profile.major || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Interest"
              variant="outlined"
              name="interest"
              value={profile.interest || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              type="text"
              label="Mentorship"
              variant="outlined"
              name="mentorship"
              value={profile.mentorship || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={1}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
</Modal>
)}
      </Grid>
    </Container>
  );
}
export default Profile;
