import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Button, TextField, Card, CardContent, CardActions, IconButton, Paper, InputBase, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { styled } from '@mui/system';

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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openCommentsModal, setOpenCommentsModal] = useState(false);
    const [currentComments, setCurrentComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const token = sessionStorage.getItem('token');
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
//post fetching
    const handlePostSubmit = async (event ) => {
        event.preventDefault();
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
//comment fetching
    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:8080/post/${currentPostId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const newCommentResponse = await response.json();
            // Update currentComments state
            setCurrentComments(prevComments => [...prevComments, newCommentResponse]);
            setCurrentComments(currentComments)
            setData(data.map(post => post.id === currentPostId ? { ...post, Comments: [...post.Comments, newCommentResponse] } : post));
            setFilteredData(filteredData.map(post => post.id === currentPostId ? { ...post, Comments: [...post.Comments, newCommentResponse] } : post));

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
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const handleOpenCommentsModal = (postId, comments) => {
        setCurrentPostId(postId);
        setCurrentComments(comments);
        setOpenCommentsModal(true);
    };

    const handleCloseCommentsModal = () => {
        setOpenCommentsModal(false);
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Course Page</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Loading courses...</Typography>
                    </Grid>
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
                                <Typography>{post.content}</Typography>
                                <Typography>By: {post.User.name}</Typography>
                                <Typography>{post.Comments.length} Comments</Typography>
                                <Typography>{post.Likes.length} Likes</Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleLike(post.id)}>
                                    <ThumbUpIcon />
                                </IconButton>
                                <Button onClick={() => handleOpenCommentsModal(post.id, post.Comments)}>
                                    View/Add Comments
                                </Button>
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
            <Dialog open={openCommentsModal} onClose={handleCloseCommentsModal}>
    <DialogTitle>Comments</DialogTitle>
    <DialogContent>
        {currentComments.map(comment => (
            <Typography key={comment.id} variant="body2" gutterBottom>
                {comment.content} - {comment.User.name}
            </Typography>
        ))}
        <TextField
            margin="dense"
            id="newComment"
            label="Add a comment"
            type="text"
            fullWidth
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    handleCommentSubmit();
                }
            }}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCommentSubmit} color="primary">
            Add
        </Button>
        <Button onClick={handleCloseCommentsModal} color="primary">
            Close
        </Button>
    </DialogActions>

</Dialog>

        </Container>
    );
}

export default CoursePage;
