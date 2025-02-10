import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../components/ErrorContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SSEContext = createContext();

export const SSEProvider = ({ children }) => {
  const eventSourceRef = useRef(null);
  const navigate = useNavigate();
  const { setError } = useError();
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      eventSourceRef.current = new EventSource(`${process.env.REACT_APP_API}/events?userId=${userId}`);

      eventSourceRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'RESET_SUCCESS':
            setMessage(data.payload.message);
            setIsOpen(true);
            break;
          case 'FRIEND_REQUEST':
          case 'MENTORSHIP_REQUEST':
          case 'COMMENT':
          case 'LIKE':
          case 'MENTORSHIP_RESPONSE':
            break;
          default:
            console.warn('Unhandled message type:', data.type);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        setError('SSE error:', error);
        eventSourceRef.current.close();
      };

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }
  }, [navigate]);

  return (
    <SSEContext.Provider value={{ eventSource: eventSourceRef.current }}>
      {children}
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SSEContext.Provider>
  );
};

export const useSSE = () => useContext(SSEContext);
