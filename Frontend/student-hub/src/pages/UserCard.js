import React from 'react';
import { Grid, Typography, Avatar, Button } from '@mui/material';

const UserCard = ({ mentor, mentee, handleOpenRequestDialog, handleCloseMenteeList }) => {
  return (
    <Grid container alignItems="center">
      <Grid item xs={3}>
        <Avatar alt={mentor?.name || mentee?.name} src={mentor?.profilePicture || mentee?.profilePicture} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" component="h3">
          {mentor?.name || mentee?.name}
        </Typography>
        {mentor && (
          <>
            <Typography color="textSecondary">{mentor.interest}</Typography>
            <Typography color="textSecondary">{mentor.mentorship}</Typography>
          </>
        )}
        {mentee && (
          <>
            <Typography variant="body2">Interest: {mentee.interest}</Typography>
            <Typography variant="body2">School: {mentee.school}</Typography>
            <Typography variant="body2">Major: {mentee.major}</Typography>
            <Typography variant="body2">Email: {mentee.email}</Typography>
          </>
        )}
        <Typography color="textSecondary">Bio: {mentor?.bio || mentee?.bio}</Typography>
      </Grid>
      <Grid item xs={3}>
        {handleOpenRequestDialog && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenRequestDialog(mentor?.id || mentee?.id)}
          >
            Request Mentorship
          </Button>
        )}
        {handleCloseMenteeList && (
          <Button onClick={handleCloseMenteeList} color="primary">
            Close
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default UserCard;
