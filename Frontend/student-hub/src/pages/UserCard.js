import React from 'react';
import { Grid, Typography, Avatar, Button, styled } from '@mui/material';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

const UserCard = ({ user, buttonText, onButtonClick }) => {
    return (
        <CardHover>
            <Grid container alignItems="center">
                <Grid item xs={3}>
                    <Avatar alt={user.name} src={user.profilePicture} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" component="h3">
                        {user.name}
                    </Typography>
                    <Typography color="textSecondary">
                        {user.bio}
                    </Typography>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={onButtonClick}>
                            {buttonText}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </CardHover>
    )
}

export default UserCard;
