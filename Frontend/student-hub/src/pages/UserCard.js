import React from 'react';
import { Grid, Typography, Avatar, Button, Card, CardContent, Tooltip } from '@mui/material';
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

  const TooltipContent = styled('div')({
    padding: '8px',
  });

  const UserCard = ({ mentor, handleOpenRequestDialog }) => {
    return (
        <Tooltip
        title={
            <TooltipContent>
              <Typography variant="subtitle2">School: {mentor.school}</Typography>
              <Typography variant="body2"> Bio: {mentor.bio}</Typography>
            </TooltipContent>
          }
          placement="top"
          arrow
        >
            <CardHover>
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
                          {mentor.interest}
                        </Typography>
                        <Typography color="textSecondary">
                          {mentor.mentorship}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenRequestDialog(mentor.id)}
                        >
                          Request Mentorship
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>

                </CardHover>
        </Tooltip>
    )
  }

  export default UserCard;
