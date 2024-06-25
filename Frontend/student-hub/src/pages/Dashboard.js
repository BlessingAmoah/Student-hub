import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Button, TextField, Card, CardContent, CardActions, IconButton, Paper, InputBase, Dialog, DialogTitle, DialogContent, DialogActions  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';


// Search bar and button sttyling
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

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const token = sessionStorage.getItem('token');
                console.log('Token:', token);
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await fetch(`http://localhost:8080/post`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const result = await response.json();
                setData(result);
                setFilteredData(result);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);
//handles the post submission which connects with the server
    const handlePostSubmit = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:8080/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            const newPost = await response.json();
            setData(prevData => [newPost, ...prevData]);
            setFilteredData(prevFilteredData => [newPost, ...prevFilteredData]);
            setTitle('');
            setContent('');
            setOpenCreateModal(false);
        } catch (error) {
            setError(error.message);
        }
    };
// comment submit
    const handleCommentSubmit = async (postId, commentContent) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:8080/post/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: commentContent }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const newComment = await response.json();
            setData(data.map(post => post.id === postId ? { ...post, Comments: [...post.Comments, newComment] } : post));
            setFilteredData(filteredData.map(post => post.id === postId ? { ...post, Comments: [...post.Comments, newComment] } : post));
        } catch (error) {
            setError(error.message);
        }
    };
//like button
    const handleLike = async (postId, e) => {

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:8080/post/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to like post');
            }
            const newLike = await response.json();
            setData(data.map(post => post.id === postId ? { ...post, Likes: [...post.Likes, newLike] } : post));
            setFilteredData(filteredData.map(post => post.id === postId ? { ...post, Likes: [...post.Likes, newLike] } : post));
        } catch (error) {
            setError(error.message);
        }
    };

//handle search

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        // Filter data based on searchTerm
        const filteredPosts = data.filter(post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filteredPosts);
      };

      const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Dashboard page</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Loading...</Typography>
                    </Grid>
                </Grid>
            </Container>
        );
    }
    if (error) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Dashboard page</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">{error}</Typography>
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
                            <Typography>{post.content}</Typography>
                            <Typography>By: {post.User.name}</Typography>
                            <Typography>{post.Comments.length} Comments</Typography>
                            <Typography>{post.Likes.length} Likes</Typography>
                        </CardContent>
                        <CardActions>
                            <IconButton onClick={() => handleLike(post.id)}>
                                <ThumbUpIcon />
                            </IconButton>
                            <TextField
                                label="Comment"
                                fullWidth
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleCommentSubmit(post.id, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
        <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseCreateModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={handlePostSubmit} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    </Container>
);
}
export default Dashboard;
