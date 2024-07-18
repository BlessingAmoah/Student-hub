import React, { useState, useEffect } from 'react';
import { Container, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper, InputBase, Button, Avatar} from '@mui/material'
import  Remove  from '@mui/icons-material/Remove'
import  Add  from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import getUserIDToken from '../components/utils';
import { useError } from '../components/ErrorContext'
import Skeleton from '@mui/material/Skeleton'


// search styling
const SearchContainer = styled(Paper)({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    marginBottom: '20px',
    marginTop: '20px'
});

const SearchInput = styled(InputBase)({
    marginLeft: '8px',
    flex: 1,
});

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [availableFriend, setAvailableFriend] = useState([]);
    const [recommendedFriends, setRecommendedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { setError } = useError();
    const [filteredData, setFilteredData] = useState({
        friends: [],
        recommendedFriends: [],
        availableFriend: []
    });
    const [isRecommendedFriends, setIsRecommendedFriends] = useState(false);
    const [isAvailableFriends, setIsAvailableFriends] = useState(false);

    // delay loading state to 1 minute
    const delayTime = 60000;
    //fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const friendsPromise = fetchFriends();
            const avaialableFriendsPromise = fetchAvailableFriend();
            const recommendedFriendsPromise = fetchRecommendedFriends();

            Promise.all([friendsPromise, avaialableFriendsPromise, recommendedFriendsPromise])
             .then(([friends, availableFriend, recommendedFriends]) => {
                const filteredAvailableFriend = availableFriend.filter(person => !recommendedFriends.some(friend => friend.id === person.id))
                setFilteredData({
                    friends,
                    recommendedFriends,
                    availableFriend: filteredAvailableFriend
                });
                setTimeout(() => {
                    setIsLoading(false)
                    }, delayTime);
             })
             .catch(error => {
                setError('Error fetching data:', error);
             });
        };
        fetchData();
    },[]);




// friends
const fetchFriends = async () => {
    setIsLoading(true)
    try {
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/friends/${userId}`,{
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`}
        });

        //update friends state
        const data = await response.json();
        const filteredFriends = data.filter(person => person.id !== userId);
        setFriends(filteredFriends)
        setIsLoading(false);
        return filteredFriends;
    }catch (error) {
        setError(error.message);
      }
      setIsLoading(false)
};

//recommended friends
const fetchRecommendedFriends = async () => {
    setIsLoading(true)
    try{
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/friends/recommendedFriends/${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`}
        });
            if (!response.ok) {
            const errorData = await response.json();
                setError(errorData.message );
                return;

            }
        //update recommended friends state
        const data = await response.json();
        const filteredRecommendedFriends = data.filter(friend => friend.id !== userId);
        setRecommendedFriends(filteredRecommendedFriends)
        setIsLoading(false);
        return filteredRecommendedFriends;
    } catch (error) {
        setError(error.message);
    }
    setIsLoading(false)
};

//Available friends
const fetchAvailableFriend = async () => {
    setIsLoading(true)
    try {
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/friends/available/${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`}
        });
        if (!response.ok) {
            const errorData = await response.json();
                setError(errorData.message );
                return;
        }
        //filter out the current user from the available friends
        //update available friends state
        const data = await response.json();
        const filteredAvailableFriend = data.filter(person => person.id !== parseInt(userId));
        setAvailableFriend(filteredAvailableFriend);
        setIsLoading(false);
        return filteredAvailableFriend;
    } catch (error) {
        setError(error.message);
    }
    setIsLoading(false)
};

//add a friend
const handleAddFriend = async (friendId) => {
    try{
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/friends/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, friendId}),
        });

        if (!response.ok) {
            const error= await response.json();
                setError(error.message );
                return;
        }

        //After successfully adding friend, fetch updated data
        const updatedFriends = await fetchFriends();
        const updatedAvailableFriend = await fetchAvailableFriend();
        const updatedRecommendedFriends = await fetchRecommendedFriends();

        setFilteredData({
            friends: updatedFriends,
            recommendedFriends: updatedRecommendedFriends,
            availableFriend: updatedAvailableFriend.filter(person => !updatedRecommendedFriends.some(friend => friend.id === person.id))
        });
    } catch (error) {
        setError(error.message);
    }
};

//remove a friend
const handleRemoveFriend = async (friendId) => {
    try{
        const { userId, token } = getUserIDToken();
        const response = await fetch(`${process.env.REACT_APP_API}/friends/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId, friendId })
        });

        if (!response.ok) {
            const error= await response.json();
                setError(error.message );
                return;
        }
        //After successfully removing friend, fetch updated data
        const updatedFriends = await fetchFriends();
        const updatedAvailableFriend = await fetchAvailableFriend();
        const updatedRecommendedFriends = await fetchRecommendedFriends();

        setFilteredData({
            friends: updatedFriends,
            recommendedFriends: updatedRecommendedFriends,
            availableFriend: updatedAvailableFriend.filter(person => !updatedRecommendedFriends.some(friend => friend.id === person.id))
        });
    } catch (error) {
        setError(error.message);
    }
};

// search
const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    //filter friends, recommeded friends and available friend based on search term
    const filteredFriends = friends.filter(person =>
        person.name?.toLowerCase().includes(searchTerm) ||
        person.interest?.toLowerCase().includes(searchTerm) ||
        person.school?.toLowerCase().includes(searchTerm) ||
        person.major?.toLowerCase().includes(searchTerm)
        );

    const filteredRecommendedFriends = recommendedFriends.filter(friend =>
        friend.name?.toLowerCase().includes(searchTerm)  ||
        friend.interest?.toLowerCase().includes(searchTerm) ||
        friend.school?.toLowerCase().includes(searchTerm) ||
        friend.major?.toLowerCase().includes(searchTerm)
        );

    const filteredAvailableFriend = availableFriend.filter(person =>
        person.name?.toLowerCase().includes(searchTerm) ||
        person.interest?.toLowerCase().includes(searchTerm) ||
        person.school?.toLowerCase().includes(searchTerm) ||
        person.major?.toLowerCase().includes(searchTerm)
        );

    //update filtered data
    setFilteredData({
        friends: filteredFriends,
        recommendedFriends: filteredRecommendedFriends,
        availableFriend: filteredAvailableFriend
    });
};

if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={3} alignItems="center" justify="center">
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rect" width="100%" height={150} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }


//rendering
return (
    <Container maxwidth="sm">
        <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '80vh'}}>

            {/*Search bar */}
            <Grid item xs={12}>
                <SearchContainer>
                    <SearchInput
                    placeholder="Search Friends"
                    inputProps={{ 'aria-label': 'search Friends'}}
                    value={searchTerm}
                    onChange={handleSearch}
                    />
                    <IconButton aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </SearchContainer>
            </Grid>
            {/* Friends List */}
            <Grid item xs={12}>
                <Typography variant="h5">Friends</Typography>
                <List>
                    {filteredData.friends?.map((person) => (
                        <ListItem key={person.id}>
                             <Avatar alt={person.name} src={person.profilePicture} sx={{ marginRight: 2 }} />
                            <ListItemText primary={person.name} secondary={`${person.interest}, ${person.school}, ${person.major}`} />
                            <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveFriend(person.id)}>
                                <Remove />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            {/*Avialable & recommended friends button */}
            <Grid container sx={{ justifyContent: 'space-between' }} item xs={12}>
                <Button variant="contained" onClick={() => setIsRecommendedFriends(!isRecommendedFriends)}>
                    { isRecommendedFriends ? "Hide Recommended Friends" : "Show Recommended Friends"}
                </Button>
                <Button variant="contained" onClick={() => setIsAvailableFriends(!isAvailableFriends)}>
                    {isAvailableFriends ? "Hide Available Friends" : " Show Available Friends"}
                </Button>
            </Grid>
            {/* Recommended Friends */}
            {isRecommendedFriends && (
            <Grid item xs={12}>
                <Typography variant="h6">Recommended Friends</Typography>
                <List>
                    {filteredData.recommendedFriends?.map((friend) => (
                        <ListItem key={friend.id}>
                             <Avatar alt={friend.name} src={friend.profilePicture} sx={{ marginRight: 2 }} />
                            <ListItemText primary={friend.name} secondary={`${friend.interest}, ${friend.school}, ${friend.major}`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label='add' onClick={() => handleAddFriend(friend.id)}>
                                    <Add />
                                </IconButton>
                                <IconButton end="end" aria-label='remove' onClick={() => handleRemoveFriend(friend.id)}>
                                    <Remove />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            )}
            {/* Available friend */}
            {isAvailableFriends && (
            <Grid item xs={12}>
                <Typography variant="h6">Available People</Typography>
                <List>
                    {filteredData.availableFriend?.map((person) => (
                        <ListItem key={person.id}>
                             <Avatar alt={person.name} src={person.profilePicture} sx={{ marginRight: 2 }}/>
                            <ListItemText primary={person.name} secondary={`${person.interest}, ${person.school}, ${person.major}`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label='add' onClick={() => handleAddFriend(person.id)}>
                                    <Add />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            )}
        </Grid>
    </Container>
);
};

export default FriendsList;
