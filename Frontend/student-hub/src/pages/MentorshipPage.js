import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, IconButton, InputBase, Paper, Button, Card, CardContent, CardActions, Avatar, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useError } from '../components/ErrorContext'
import Skeleton from '@mui/material/Skeleton'
import getUserIDToken from '../components/utils';

//search styling
const SearchContainer = styled(Paper)({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    marginBottom: '20px'
  })

  const SearchInput = styled(InputBase)({
    marginLeft: '8px',
    flex: 1,
  })

  const SearchIconButton = styled(IconButton)({
    padding: 10,
  });
  const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {error, setError } = useError();
  const [isOpenRequestDialog, setIsOpenRequestDialog] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [note, setNote] = useState('');
  const [mentorshipRequest, setMentorshipRequest] = useState([]);
  const [filteredMentorshipRequest, setFilteredMentorshipRequest] = useState([]);
  const [isPendingRequestDialogOpen, setIsPendingRequestDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState(null)
  const [filteredMenteeList, setFilteredMenteeList] = useState([]);
  const [filteredMentorList, setFilteredMentorList] = useState([]);

  // fetch mentorship informations
  useEffect(() => {
    const fetchMentorships = async () => {
      setIsLoading(true)
      try {
        const { token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/mentorship/mentorship`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Failed to fetch mentorship')
        }

        const mentorshipData = await response.json();
        setIsLoading(false);
        setMentorships(mentorshipData.users || mentorshipData);
      } catch (error) {
        setError('Failed to fetch mentorships');
      }
      setIsLoading(false)
    };
    fetchMentorships();
  }, [setError]);

  // fetch requests received
  useEffect(() => {
    const fetchMentorshipRequest = async () => {
      try {
        const { token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/mentorship/mentor-requests`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Failed to fetch mentorship');
        }
        const requestData = await response.json();
        setMentorshipRequest(requestData);
      }
      catch (error) {
        setError('Fetch mentorshp requests error:', error)
      }
    };
    fetchMentorshipRequest();
  }, [setError])

  //search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //request mentor
  const handleRequestMentor = async () => {
    try {
      const { token } = getUserIDToken();
      const response = await fetch(`${process.env.REACT_APP_API}/mentorship/request-mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: selectedMentorId, note })
      });

      if (!response.ok) {
        setError('Failed to fetch mentorship');
      }
      alert('Mentor request sent successfuly');
      handleCloseRequestDialog();
    } catch (error) {
      setError('Error requesting mentor:', error)
    }
  };

  // respond to a mentorship request.
  const handleRespondMentorship = async (userId,mentorId, status) => {
    try{
      const { token } = getUserIDToken();
      const response = await fetch(`${process.env.REACT_APP_API}/mentorship/respond-mentorship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId,mentorId, status})
      });

      if (!response.ok) {
        setError('Failed to fetch mentorship');
      }
      const requestData = await response.json();
      setMentorshipRequest(requestData);
      alert(`Mentorship request ${status}`);
      setMentorshipRequest(mentorshipRequest.filter((request) => request.id !== userId))
    }
    catch (error){
      setError('Respond mentorship error', error)
    }
  };

  // fetch mentees information for a mentor
  const fetchMentees = async () => {
    try{
      const { userId, token } = getUserIDToken();

      const response = await fetch(`${process.env.REACT_APP_API}/mentorship/${userId}/mentees`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
        setFilteredMenteeList(data)
    } catch(error) {
      setError('Error fetching mentees')
    }
  }

  // fetch mentor information for mentee
    const fetchMentor = async () => {
      try {
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/mentorship/${userId}/mentor`,{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data= await response.json();
        setFilteredMentorList(data)
      } catch (error) {
        setError('Failed to fetch mentor')
      }
    };

  const handleOpenRequestDialog = (userId) => {
    setSelectedMentorId(userId);
    setIsOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setIsOpenRequestDialog(false);
    setSelectedMentorId(null);
    setNote('');
  }

  const handlePendingRequest = () => {
    const pendingRequest = mentorshipRequest.filter(
      (request) => request.mentorship === 'Mentee' && request.status === 'requested'
    );
    setFilteredMentorshipRequest(pendingRequest);
    setIsPendingRequestDialogOpen(true);
  }

  const handleOpenMenteeList = async () => {
    setUserRole('Mentee')
   await fetchMentees();
  }
  const handleClosePendingRequest = () => {
    setIsPendingRequestDialogOpen(false);
  }

  const handleCloseMenteeList = () => {
    setUserRole(null);
  }
  const handleOpenMentorList = async () => {
    setUserRole('Mentor');
    await fetchMentor();

   }
   const handleCloseMentorList = () => {
    setUserRole(null);
   }

  const filteredMentorship = mentorships.filter((mentorship) =>
  mentorship.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={3} alignItems="center" justify="center">
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rect" width="100%" height={150} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
          <Grid item xs={12}>
            <Typography variant="body1" color="error">{error}</Typography>
          </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
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

{userRole === 'Mentor' ? (
  <Grid container spacing={2} alignItems="center" justify="center">
    <Grid item xs={12}>
      <Button onClick={handleOpenMenteeList}>Mentee List</Button>
      <Button onClick={handlePendingRequest}>Pending Request</Button>
    </Grid>
  </Grid>
) : (
  <Grid container spacing={2} alignItems="center" justify="center">
    <Grid item xs={12}>
      <Button onClick={handleOpenMentorList}>Mentor</Button>
    </Grid>
  </Grid>
)}
        </Grid>
       {filteredMentorship.map((mentorship) => {
        if (mentorship.mentorship === 'Mentor') {
          return (
        <Grid item xs={12} sm={6} md={4} key={mentorship.id}>
          <CardHover>
            <Card>
              <CardContent>
                <Avatar alt={mentorship.name} src={mentorship.profilePicture} />
                <Typography variant="h6">{mentorship.name}</Typography>
                <Typography variant="body2">{mentorship.interest}</Typography>
                <Typography variant="body2">{mentorship.mentorship}</Typography>
              </CardContent>

                {mentorship.mentorship !== 'Mentee' && (
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenRequestDialog(mentorship.id)}
                    >
                      Request Mentor
                    </Button>
                  </CardActions>
                )}
            </Card>
          </CardHover>
          </Grid>
          );
                }
                return null;
              })}
      </Grid>

      {/* Request Mentor Dialog */}
      <Dialog open={isOpenRequestDialog} onClose={handleCloseRequestDialog}>
        <DialogTitle>Request Mentor</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To request this mentor, please add a note explaining why you want to be mentored by them.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Note"
            type="text"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRequestMentor} color="primary">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pending Request */}
      <Dialog open={isPendingRequestDialogOpen} onClose={handleClosePendingRequest}>
        <DialogTitle>Mentorship Requests</DialogTitle>
        <DialogContent>
          {filteredMentorshipRequest.length === 0 ? (
            <Typography variant="body1">No mentorship requests found.</Typography>
          ):(
            filteredMentorshipRequest.map((request)=> (
              <Card key={request.id} style={{ marginBottom: '10px'}}>
                <CardContent>
                <Avatar alt={request.name} src={request.profilePicture} />
                  <Typography variant="h6">{request.name}</Typography>
                  <Typography variant="body2">{request.interest}</Typography>
                  <Typography variant="body2">{request.school}</Typography>
                  <Typography variant="body2">{request.note}</Typography>
                  <Typography variant="body2">{request.mentorId}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRespondMentorship(request.id,request.mentorId, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRespondMentorship(request.id,request.mentorId,  'rejected')}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            ))
          )
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePendingRequest} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mentee informations */}
{ userRole === 'Mentee' && filteredMenteeList.length > 0 && (
  <Dialog open={true} onClose={handleCloseMenteeList}>
    <DialogTitle>Mentee List</DialogTitle>
    <DialogContent>
              {filteredMenteeList.length === 0 ? (
                <Typography variant="body1">No Mentees Found.</Typography>
              ) : (
                filteredMenteeList.map((mentee) => (
                  <Card key={mentee.id} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Avatar alt={mentee.name} src={mentee.profilePicture} />
                      <Typography variant="h6">{mentee.name}</Typography>
                      <Typography variant="body2">{mentee.interest}</Typography>
                      <Typography variant="body2">{mentee.school}</Typography>
                      <Typography variant="body2">{mentee.major}</Typography>
                      <Typography variant="body2">{mentee.email}</Typography>
                      <Typography variant="body2">{mentee.bio}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMenteeList} color="primary">
                Close
              </Button>
            </DialogActions>
  </Dialog>
)}
 {/* Mentor informations */}
{ userRole === 'Mentor' && filteredMentorList.length > 0 && (
  <Dialog open={true} onClose={handleCloseMentorList}>
    <DialogTitle>Mentor</DialogTitle>
            <DialogContent>
              {filteredMentorList.length === 0 ? (
                <Typography variant="body1">No Mentors Found.</Typography>
              ) : (
                filteredMentorList.map((mentor) => (
                  <Card key={mentor.id} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Avatar alt={mentor.name} src={mentor.profilePicture} />
                      <Typography variant="h6">{mentor.name}</Typography>
                      <Typography variant="body2">{mentor.interest}</Typography>
                      <Typography variant="body2">{mentor.email}</Typography>
                      <Typography variant="body2">{mentor.bio}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMentorList} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
)}
    </Container>
  );
}

export default MentorshipPage;
