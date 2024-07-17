import React from 'react';
import { Modal, Button, CircularProgress, TextField } from '@mui/material';

const VerificationModal = ({ isOpen, onClose, onSubmit, onResend, isLoading, verificationCode, handleVerificationCodeChange, modalMode }) => {
    if (modalMode === 'ResetPassword') {
        return (
            <div>
                <h2>Email Verification Code Has Been Sent To Your Email! Enter the verification Code in the Box and Your New Password!</h2>
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
        );
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
        >
            <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxWidth: 400, margin: 'auto', marginTop: '20vh' }}>
                <h2>Email Verification Code Has Been Sent To Your Email</h2>
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
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">Verify</Button>
                    </div>
                </form>
                <p style={{ textAlign: 'center' }}>
                    Didn't receive a code?{' '}
                    <Button component="a" href="#" onClick={onResend}>
                        Resend Verification Code
                    </Button>
                </p>
                {isLoading && <CircularProgress color="inherit" />}
            </div>
        </Modal>
    );
};

export default VerificationModal;
