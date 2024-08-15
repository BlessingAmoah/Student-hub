import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Button, TextField, Card, CardContent, CardActions, IconButton, Paper, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useError } from '../components/ErrorContext';
import Skeleton from '@mui/material/Skeleton';
import getUserIDToken from '../components/utils';

// search styling
const SearchContainer = styled(Paper)({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    marginBottom: '20px'
});

const SearchInput = styled(InputBase)({
    marginLeft: '8px',
    flex: 1,
});

const SearchIconButton = styled(IconButton)({
    padding: 10,
});

function CoursePage() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenCommentsModal, setIsOpenCommentsModal] = useState(false);
    const [currentComments, setCurrentComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);
    const [media, setMedia] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojis, setEmojis] = useState([]);
    const { setError } = useError();

    // delay loading state to 1 minute
    const delayTime = 60000;

    useEffect(() => {
        const fetchEmojis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API}/emoji`);
                if (!response.ok) {
                    setError(response.statusText);
                }
                const emojisData = await response.json();
                setEmojis(emojisData);
            } catch (error) {
                setError(error.message);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, delayTime);
        };
        fetchEmojis();
    }, [setError]);

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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                setData(result);
                setFilteredData(result);
            } catch (error) {
                setError('Failed to fetch data:', error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [navigate, setError, currentPostId]);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('emojiId', selectedEmoji[currentPostId] || '');
            if (media) formData.append('media', media);

            const response = await fetch(`${process.env.REACT_APP_API}/post`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                setError('Failed to submit:', response.statusText);
            }
            const newPost = await response.json();
            setData(prevData => [newPost, ...prevData]);
            setFilteredData(prevFilteredData => [newPost, ...prevFilteredData]);
            setTitle('');
            setContent('');
            setMedia(null);
            setSelectedEmoji({ ...selectedEmoji, [newPost.id]: null });
            setIsOpenCreateModal(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCommentSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_API}/post/${currentPostId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });
            if (!response.ok) {
                setError('Failed to submit comment:', response.statusText);
            }
            const newCommentResponse = await response.json();
            const updatePostComments = (post, newComment, currentPostId) => {
                if (post.id === currentPostId) {
                    return { ...post, Comments: [...post.Comments, newComment] };
                }
                return post;
            };
            setCurrentComments(prevComments => [...prevComments, newCommentResponse]);
            setData(data.map(post => updatePostComments(post, newCommentResponse, currentPostId)));
            setFilteredData(filteredData.map(post => updatePostComments(post, newCommentResponse, currentPostId)));
            setNewComment('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLike = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API}/post/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ emojiId: selectedEmoji[postId] || '' }),
            });
            if (!response.ok) {
                setError('Failed to like:', response.statusText);
            }
            const newLike = await response.json();
            const updatePostLikes = (post, newLike, postId) => {
                if (post.id === postId) {
                    return { ...post, Likes: [...post.Likes, newLike] };
                }
                return post;
            };
            setData(data.map(post => updatePostLikes(post, newLike, postId)));
            setFilteredData(filteredData.map(post => updatePostLikes(post, newLike, postId)));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API}/post/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError('Failed to delete post:', response.statusText);
                return;
            }
            setData(prevData => prevData.filter(post => post.id !== postId));
            setFilteredData(prevFilteredData => prevFilteredData.filter(post => post.id !== postId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        const filteredPosts = data.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filteredPosts);
    };

    const handleOpenCreateModal = () => {
        setIsOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setIsOpenCreateModal(false);
    };

    const handleOpenCommentsModal = (postId, comments) => {
        setCurrentPostId(postId);
        setCurrentComments(comments);
        setIsOpenCommentsModal(true);
    };

    const handleCloseCommentsModal = () => {
        setIsOpenCommentsModal(false);
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setMedia(event.target.files[0]);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Course Page
            </Typography>
            <SearchContainer>
                <SearchIconButton>
                    <SearchIcon />
                </SearchIconButton>
                <SearchInput
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search..."
                />
            </SearchContainer>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
                Create Post
            </Button>
            {isLoading ? (
                <Skeleton variant="rectangular" width={210} height={118} />
            ) : (
                <Grid container spacing={2}>
                    {filteredData.map(post => (
                        <Grid item xs={12} md={6} key={post.id}>
                            <Card>
                                {post.media && (
                                    <img
                                        src={post.media} // Ensure this is the URL to the S3 bucket
                                        alt="Media"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2">{post.content}</Typography>
                                    <Typography variant="body2">Likes: {post.Likes.length}</Typography>
                                    <Typography variant="body2">Comments: {post.Comments.length}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleLike(post.id)}>Like</Button>
                                    <Button size="small" onClick={() => handleOpenCommentsModal(post.id, post.Comments)}>Comments</Button>
                                    <Button size="small" color="error" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Post Modal */}
            <Dialog open={isOpenCreateModal} onClose={handleCloseCreateModal}>
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Content"
                        multiline
                        rows={4}
                        fullWidth
                        margin="dense"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                    <Select
                        value={selectedEmoji[currentPostId] || ''}
                        onChange={(e) => setSelectedEmoji({ ...selectedEmoji, [currentPostId]: e.target.value })}
                    >
                        {emojis.map((emoji) => (
                            <MenuItem key={emoji.id} value={emoji.id}>
                                {emoji.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateModal}>Cancel</Button>
                    <Button onClick={handlePostSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Comments Modal */}
            <Dialog open={isOpenCommentsModal} onClose={handleCloseCommentsModal}>
                <DialogTitle>Comments</DialogTitle>
                <DialogContent>
                    {currentComments.map((comment) => (
                        <Typography key={comment.id}>{comment.content}</Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <TextField
                        label="New Comment"
                        fullWidth
                        margin="dense"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleCommentSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CoursePage;
