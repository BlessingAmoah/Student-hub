
 // util function to fetch userId & token
 const getUserIDToken = () => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    return { userId, token };
}

export default getUserIDToken;
