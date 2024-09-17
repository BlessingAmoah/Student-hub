import React, { useState, useEffect } from 'react';
import {
    Grid, Typography, Container, Button, Card, CardContent, CardActions, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useError } from '../components/ErrorContext';
import Skeleton from '@mui/material/Skeleton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function CoursePage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isOpenEmojiModal, setIsOpenEmojiModal] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojis, setEmojis] = useState([]);
    const { setError } = useError();
    
    // Fetch emojis
    useEffect(() => {
        const fetchEmojis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API}/emoji`);
                const emojiData = await response.json();
                setEmojis(emojiData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmojis();
    }, [setError]);

    // Fetch posts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await fetch(`${process.env.REACT_APP_API}/post`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setData(result);
                setFilteredData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate, setError]);

    // Handle like button click
    const handleOpenEmojiModal = (postId) => {
        setCurrentPostId(postId);
        setIsOpenEmojiModal(true);
    };

    const handleCloseEmojiModal = () => {
        setIsOpenEmojiModal(false);
    };

    const handleEmojiSelect = async (emoji) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_API}/post/${currentPostId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ emojiId: emoji.id }),
            });
            const newLike = await response.json();
            setSelectedEmoji({ ...selectedEmoji, [currentPostId]: emoji });
            setIsOpenEmojiModal(false);
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return (
            <Container>
                <Grid container spacing={2}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Skeleton variant="rect" width="100%" height={150} />
                            <Skeleton variant="text" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Container>
            <Grid container spacing={3}>
                {filteredData.map(post => (
                    <Grid item xs={12} key={post.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">{post.title}</Typography>
                                <Typography>{post.content}</Typography>
                                <Typography>{post.Likes?.length} Likes</Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleOpenEmojiModal(post.id)}>
                                    <EmojiEmotionsIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Emoji Selection Modal */}
            <Dialog open={isOpenEmojiModal} onClose={handleCloseEmojiModal}>
                <DialogTitle>Select an Emoji</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {emojis.map((emoji) => (
                            <Grid item key={emoji.id}>
                                <Button onClick={() => handleEmojiSelect(emoji)}>
                                    <span role="img" aria-label={emoji.name}>{emoji.character}</span>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEmojiModal} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CoursePage;
