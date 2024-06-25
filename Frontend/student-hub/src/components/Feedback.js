import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';


// User can submit a feedback about the website.
function Feedback() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Feedback</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Container>
  );
}

export default Feedback;
