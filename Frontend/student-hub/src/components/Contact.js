import React from 'react';
import { Container, Typography } from '@mui/material';

function Contact() {


  return (
    <Container>
      <Typography variant="h4" gutterBottom>Contact Me</Typography>
      <Typography variant="p">
        Name: Blessing Amoah
        Email: bsa5@calvin.edu
        School: Calvin University
        Major: Computer Science
        <a href='https://www.linkedin.com/in/blessingamoah/'>LinkedIn</a>
      </Typography>
    </Container>
  );
}

export default Contact;
