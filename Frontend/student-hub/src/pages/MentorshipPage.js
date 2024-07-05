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

function MentorshipPage({ setOpen, setError, error }) {
  const [mentorships, setMentorships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

        const mentorshipData = await response.json();
        if (mentorshipData && mentorshipData.mentorships) {
          setMentorships(mentorshipData.mentorships);
        } else {
          setMentorships([]); // or setError('Failed to fetch mentorships');
        }
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch mentorships');
        setOpen(true);
      }
    };

    fetchMentorships();
  }, [setOpen, setError]);

  //search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

  };

  if (isLoading) {
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
