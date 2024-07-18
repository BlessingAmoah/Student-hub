import React from 'react';
import { Grid, Card,CardContent, Avatar, Typography, Button} from '@mui/material';
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

  const MentorList = ({ mentor, handleCloseMentorList}) => {
    return (
        <CardHover key={mentor.id}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={3}>
                        <Avatar alt={mentor.name} src={mentor.profilePicture} />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" component="h3">
                          {mentor.name}
                        </Typography>
                        <Typography color="textSecondary">
                         Bio: {mentor.bio}
                        </Typography>
                        <Typography variant="body2">
                         Interest: {mentor.interest}
                          </Typography>
                      <Typography variant="body2">
                       Email: {mentor.email}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button onClick={handleCloseMentorList} color="primary">
                Close
              </Button>
                  </CardContent>
                </CardHover>
    )
  }

  export default MentorList;
