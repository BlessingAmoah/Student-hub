import React from 'react';
import { Typography } from '@mui/material';
import UserCard from './UserCard';

const MenteeList = ({ mentees}) => {
    return (
        <div>
            <Typography variant="h6" component="h2" gutterBottom>
                Mentees List
            </Typography>
            { mentees.map((mentee) => (
                <UserCard key={mentee.id} user={mentee} buttonText="View Details" />
            ))}
        </div>
    );
};

export default MenteeList;
