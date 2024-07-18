import React from 'react';
import { Grid, Card, Typography, CardContent, Avatar, Button } from '@mui/material'
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

  const MenteeList = ({ mentee, handleCloseMenteeList}) => {
    return (
        <CardHover key={mentee.id}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={3}>
                        <Avatar alt={mentee.name} src={mentee.profilePicture} />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" component="h3">
                          {mentee.name}
                        </Typography>
                        <Typography variant="body2">
                          Interest: {mentee.interest}
                          </Typography>
                      <Typography variant="body2">
                        School: {mentee.school}
                        </Typography>
                      <Typography variant="body2">
                       Major:  {mentee.major}
                        </Typography>
                      <Typography variant="body2">
                       Email: {mentee.email}
                        </Typography>
                        <Typography color="textSecondary">
                        Bio:  {mentee.bio}
                        </Typography>
                      </Grid>
                    </Grid>
              <Button onClick={handleCloseMenteeList} color="primary">
                Close
              </Button>

                  </CardContent>
                </CardHover>
    )
  }

  export default MenteeList;
