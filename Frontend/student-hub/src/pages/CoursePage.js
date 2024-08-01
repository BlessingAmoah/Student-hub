import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Button, TextField, Card, CardContent, CardActions, IconButton, Paper, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useError } from '../components/ErrorContext'
import Skeleton from '@mui/material/Skeleton'
import getUserIDToken from '../components/utils';


// search styling
const SearchContainer = styled(Paper)({
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    marginBottom: '20px'
})

const SearchInput = styled(InputBase)({
    marginLeft: '8px',
    flex: 1,
})

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
    const [emojis, setEmojis] = useState([])
    const { setError } = useError();

// delay loading state to 1 minute
const delayTime = 60000;
// emoji
    useEffect(() => {
        const fetchEmojis = async () => {
            setIsLoading(true)
            try{
                const response = await fetch(`${process.env.REACT_APP_API}/emoji`);
                if (!response.ok) {
                    setError(error.message)
                }
                const emojistData = await response.json();
                setEmojis(emojistData);
            } catch (error) {
                setError(error.message)
            }
            setTimeout(() => {
                setIsLoading(false)
                }, delayTime);
        };
        fetchEmojis();
    }, []);
//fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
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
            setIsLoading(false)
        };
        fetchData();
    }, [navigate,currentPostId, setError]);

//post fetching
    const handlePostSubmit = async (event ) => {
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
                setError('Failed to submit:', error);

            }
            const newPost = await response.json();
            setData(prevData => [newPost, ...prevData]);
            setFilteredData(prevFilteredData => [newPost, ...prevFilteredData]);
            setTitle('');
            setContent('');
            setMedia(null);
            setSelectedEmoji({ ...selectedEmoji, [newPost.id]: null })
            setIsOpenCreateModal(false);
        } catch (error) {
            setError(error.message);
        }
    };
//comment fetching
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
                setError('Failed to submit comment:', error);
            }
            const updatePostComments = (post, newComment, currentPostId) => {
                if (post.id === currentPostId) {
                    return { ...post, Comments: [...post.Comments, newComment]};
                }
                return post;
            };
            const newCommentResponse = await response.json();
            // Update currentComments state
            setCurrentComments(prevComments => [...prevComments, newCommentResponse]);
            setCurrentComments(currentComments)
            setData(data.map(post => updatePostComments(post, newCommentResponse, currentPostId)));
            setFilteredData(filteredData.map(post =>updatePostComments(post, newCommentResponse, currentPostId)));
            setNewComment('');
        } catch (error) {
            setError(error.message);
        }
    };
//like button
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
            setError('Failed to like:', error);
        }
        const updatePostLikes = (post, newLike, postId) => {
            if (post.id === postId) {
                return {...post, Likes: [...post.Likes, newLike]}
            }
            return post;
        }
        const newLike = await response.json();
        setData(data.map(post => updatePostLikes(post, newLike)));
        setFilteredData(filteredData.map(post => updatePostLikes(post, newLike)));
    } catch (error) {
        setError(error.message);
    }
};
//delete a post
const handleDeletePost = async(postId) => {
    try {
        const token = getUserIDToken();
        if (!token) {
        navigate('/login');
        return;
        }

        const response = await fetch (`${process.env.REACT_APP_API}/post/post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            setError('Failed to delete post');
            return;
        }
        setData(prevData => prevData.filter(post => post.id !== postId));
        setFilteredData(prevFilteredData => prevFilteredData.filter(post => post.id !== postId));
    } catch(error) {
        setError(error.message);
    }
};
//search
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

    // file change
    const handleFileChange = (event) => {
        setMedia(event.target.files[0])
    };

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
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

    if (error) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="error">
                            Course Page
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" color="error">
                            {error}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container>

            <SearchContainer>
                <SearchInput
                    placeholder="Search Posts"
                    inputProps={{ 'aria-label': 'search posts' }}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <SearchIconButton aria-label="search">
                    <SearchIcon />
                </SearchIconButton>
            </SearchContainer>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
                Create Post
            </Button>
            <Grid container spacing={3}>
                {filteredData.map(post => (
                    <Grid item xs={12} key={post.id}>
                        <Card>
                        <CardContent>
                            <Typography variant="h5">{post.title}</Typography>
                            {post.mediaPath && (
                            <>
                                {/\.(mp4|mov|avi)$/i.test(post.mediaPath) ? (
                                <video controls style={{ maxWidth: '100%' }}>
                                    <source src={`${process.env.REACT_APP_API}/${post.mediaPath}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                ) : (
                                <img
                                    src={`${process.env.REACT_APP_API}/${post.mediaPath}`}
                                    alt="Post media"
                                    style={{ maxWidth: '100%' }}
                                />
                                )}
                            </>
                            )}
                            <Typography>{post.content}</Typography>
                            {post.User && (
                                <Typography>By: {post.User?.name}</Typography>
                            )}
                            <Typography>{post.Comments?.length} Comments</Typography>
                            <Typography>{post.Likes?.length} Likes</Typography>
                            </CardContent>
                            <CardActions>
                            <IconButton onClick={() => handleLike(post.id)}>
                                    <Select
                                        value={selectedEmoji[post.id] || ''}
                                        onChange={(e) => setSelectedEmoji({ ...selectedEmoji, [post.id]: e.target.value })}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Select Emoji' }}
                                    >
                                         <MenuItem value=""><span role="img" aria-label="default emoji">👍🏻</span></MenuItem>
                                        {emojis.map((emoji, id) => (
                                            <MenuItem key={id} value={emoji.character}>
                                                {emoji.character}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </IconButton>
                                <Button onClick={() => handleOpenCommentsModal(post.id, post.Comments)}>
                                    View Comments
                                </Button>
                                <Button color="error" onClick={() => handleDeletePost(post.id)}>
                                    Delete Post
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={isOpenCreateModal} onClose={handleCloseCreateModal}>
                <form onSubmit={handlePostSubmit}>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="content"
                        label="Content"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <input type="file" onChange={handleFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePostSubmit} color="primary">
                        Create
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
            <Dialog open={isOpenCommentsModal} onClose={handleCloseCommentsModal}>
            <DialogTitle>Comments</DialogTitle>
                <DialogContent>
                    {currentComments.map(comment => (
                        <div key={comment.id}>
                            <Typography>{comment.content}</Typography>
                            <Typography>By: {comment.User?.name}</Typography>
                            <Typography>Date: {new Date(comment.createdAt).toLocaleString()}</Typography>
                            <br />
                        </div>
                    ))}
                    <form onSubmit={handleCommentSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Add Comment"
                            type="text"
                            fullWidth
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                        <DialogActions>
                            <Button onClick={handleCloseCommentsModal} color="primary">
                                Close
                            </Button>
                            <Button type="submit" color="primary">
                                Comment
                            </Button>
                        </DialogActions>
                    </form>
    </DialogContent>

</Dialog>

        </Container>
    );
}

export default CoursePage;
