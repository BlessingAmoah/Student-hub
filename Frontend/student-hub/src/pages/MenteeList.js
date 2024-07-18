import React from 'react';
import { Grid, Card} from '@mui/material';
import UserCard from './UserCard';
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

const MenteeList = ({ mentees, handleCloseMenteeList }) => {
  return (
    <Grid container spacing={2}>
      {mentees.map((mentee) => (
        <Grid item xs={12} key={mentee.id}>
          <CardHover>
            <UserCard mentee={mentee} handleCloseMenteeList={handleCloseMenteeList} />
          </CardHover>
        </Grid>
      ))}
    </Grid>
  );
};

export default MenteeList;
