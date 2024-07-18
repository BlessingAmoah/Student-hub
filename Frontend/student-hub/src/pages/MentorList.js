import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import UserCard from './UserCard';

const MentorList = ({ mentorships, handleOpenRequestDialog }) => {
    return (
        <div>
            <Typography variant="h6" component="h2" gutterBottom>
                Mentor
            </Typography>
            {mentorships.map((mentor) => (
                <UserCard
                key={mentor.id}
                user={mentor}
                buttonText="Request Mentorship"
                onButtonClick={() => handleOpenRequestDialog(mentor.id)}
                />
            ))}
        </div>
    );
};

export default MentorList;
