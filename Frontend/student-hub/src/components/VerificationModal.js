import React from 'react';
import { CircularProgress, TextField } from '@mui/material';

const VerificationModal = ({ onSubmit, isLoading, verificationCode, handleVerificationCodeChange}) => {

        return (
            <div>
                <h2>Email Verification Code Has Been Sent To Your Email! Enter the verification Code in the Box!</h2>
                <form onSubmit={onSubmit}>
                    <div className="verification-container">
                        {[...Array(6)].map((_, num) => (
                            <TextField
                                key={num}
                                type="text"
                                className="verification-input"
                                maxLength="1"
                                value={verificationCode[num] || ''}
                                onChange={(e) => handleVerificationCodeChange(e, num)}
                                required
                            />
                        ))}
                    </div>
                </form>
                {isLoading && <CircularProgress color="inherit" />}
            </div>
        )

};

export default VerificationModal;
