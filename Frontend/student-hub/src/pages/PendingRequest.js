import React from 'react';
import { Button, Grid, Avatar, Typography, Card, CardContent} from "@mui/material";
import { styled } from '@mui/system';

const CardHover = styled(Card)({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  });

  const PendingRequest = ({ handleRespondMentorship, request}) => {
    return(
        <Grid item xs={12} key={request.id}>
        <CardHover>
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Avatar alt={request.name} src={request.profilePicture} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" component="h3">
                  {request.name}
                </Typography>
                <Typography color="textSecondary">{request.bio}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleRespondMentorship(request.userId, request.mentorId, 'accepted')
                  }
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    handleRespondMentorship(request.userId, request.mentorId, 'rejected')
                  }
                >
                  Reject
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </CardHover>
      </Grid>
    )
  }

  export default PendingRequest;
