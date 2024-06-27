import React from 'react';
import { Container, Typography } from '@mui/material';

function Contact() {


  return (
    <Container>
      <Typography variant="h4" gutterBottom>Contact Me</Typography>
      <Typography variant="p">
       <p>Name: Blessing Amoah</p>
        <p>Email: bsa5@calvin.edu</p>
        <p>School: Calvin University</p>
        <p>Major: Computer Science</p>
        <a href='https://www.linkedin.com/in/blessingamoah/'>LinkedIn</a>
      </Typography>
    </Container>
  );
}

export default Contact;
