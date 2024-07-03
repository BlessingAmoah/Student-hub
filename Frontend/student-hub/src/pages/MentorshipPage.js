import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';

//search styling
const SearchContainer = styled(Paper)({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    marginBottm: '20px'
  })

  const SearchInput = styled(InputBase)({
    marginLeft: '8px',
    flex: 1,
  })

  const SearchIconButton = styled(IconButton)({
    padding: 10,
  });

function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API}/auth/mentorship`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mentorships');
        }

        const mentorshipData = await response.json();
        setMentorships(mentorshipData.mentorships);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch mentorships');
        setLoading(false);
      }
    };

    fetchMentorships();
  }, []);

  //search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12}>
            <Typography variant="h4">Mentorship Page</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Loading mentorships...</Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12}>
            <Typography variant="h4" color="error">Mentorship Page</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="error">{error}</Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
        <Grid item xs={12}>
          <Typography variant="h4">Mentorship Page</Typography>
        </Grid>
        <Grid item xs={12}>
        <SearchContainer>
        <SearchInput
          placeholder="Search Boards"
          inputProps={{ 'aria-label': 'search boards' }}
          value={searchTerm}
          onChange={handleSearch}
        />
        <SearchIconButton type="submit"  aria-label="search">
          <SearchIcon />
        </SearchIconButton>
      </SearchContainer>
        </Grid>
        <Grid item xs={12}>
          {mentorships.length > 0 ? (
            mentorships.map(mentorship => (
              <Typography key={mentorship.id} variant="body1">{mentorship.title}</Typography>
            ))
          ) : (
            <Typography variant="body1">No mentorship programs available.</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MentorshipPage;
