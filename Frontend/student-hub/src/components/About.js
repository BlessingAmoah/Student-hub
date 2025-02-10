import React from 'react';
import { Container, Typography } from '@mui/material';

function About() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>About Us</Typography>
      <Typography variant="body1">
        Welcome to Student Hub! We provide various resources and programs to help students achieve their academic and career goals.
      </Typography>
      <Typography variant="body1">
      Student hub serves as a tool for collaborative learning and project work, as well as a platform for sharing experiences related to internships, summer plans and student organizations. You will be able to post information about your classes, projects that you are interested in or working on and other students  with the same interests can comment on your posts to collaborate or give feedback.
      </Typography>
    </Container>
  );
}

export default About;
