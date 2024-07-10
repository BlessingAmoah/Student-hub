import React, { createContext, useState, useContext } from 'react';


const ErrorContext = createContext();

// provider conponent to wrap the entire application
export const ErrorProvider = ({ children }) => {
    const [ error, setError ] = useState('');

    const clearError =() => {
        setError('');
    }
    return (
        <ErrorContext.Provider value={{ error, setError, clearError }}>
            {children}
        </ErrorContext.Provider>
    )
};



export const useError = () => useContext(ErrorContext);
