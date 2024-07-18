import React from 'react';
import { Grid, Card } from '@mui/material';
import UserCard from './UserCard';
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

const MentorList = ({ mentors, handleOpenRequestDialog }) => {
  return (
    <Grid container spacing={2}>
      {mentors.map((mentor) => (
        <Grid item xs={12} key={mentor.id}>
          <CardHover>
            <UserCard mentor={mentor} handleOpenRequestDialog={handleOpenRequestDialog} />
          </CardHover>
        </Grid>
      ))}
    </Grid>
  );
};

export default MentorList;
