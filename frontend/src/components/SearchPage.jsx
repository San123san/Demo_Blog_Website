// src/components/SearchPage.jsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton, Box, Grid } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { useSelector, useDispatch } from 'react-redux';
import { setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
import { useNavigate, useParams } from 'react-router-dom';


function SearchPage() {
    const { searchQuery } = useParams();
    const navigate = useNavigate()

    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blog.blogs);

    // Filter blogs that have shared set to true in Redux
    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.category.toLowerCase().includes(searchQuery.toLowerCase())
            // blog.category.toLowerCase() === searchQuery.toLowerCase()
    );
    console.log("Filtered", filteredBlogs)

    const handleCardClickPreview = (blog) => {
        console.log('Clicked blog:', blog);
        console.log('Clicked blogId:', blog._id);
        dispatch(setTransferDisplay(blog._id));
        navigate(`/User-Card-Show/${blog.topic}`);
    };

    const handleCardClick = (blogId) => {
        console.log('Clicked blog:', blogId);
        dispatch(setTransferDisplay(blogId));
        const selectedBlog = blogs.find(blog => blog._id === blogId);
        navigate(`/User-Card-Show/${selectedBlog.topic}`);
    };

    return (
        <>
            <Box sx={{
                mt: 5
            }}>
                <Typography variant="h6" sx={{ mt: 10, mb: 5, color: '#757575', fontStyle: 'italic', display: 'flex', justifyContent: 'center' }}>
                    Search Results for: {searchQuery}
                </Typography>
                <Grid container spacing={2}>
                    {filteredBlogs.length === 0 ? (
                        <Typography variant="h6" sx={{
                            width: '100%',
                            mt: 10,
                            mb: 5,
                            color: '#757575',
                            fontStyle: 'italic',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            No blogs found matching the search query.
                        </Typography>
                    ) : (
                        filteredBlogs.map((blog) => (
                            <Grid item key={blog._id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        backgroundColor: '#f0f0f0',
                                        padding: '20px',
                                        margin: '10px',
                                        borderRadius: '10px',
                                        '@media (min-width: 1290px)': {
                                            width: 345
                                        }
                                    }}
                                    onClick={() => handleCardClick(blog._id)}
                                >
                                    <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            // image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
                                            image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
                                            sx={{
                                                objectFit: 'contain'
                                            }}
                                        />
                                        <CardContent sx={{ backgroundColor: '#ffffff' }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {blog.topic}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {blog.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary"
                                                sx={{
                                                    marginTop: 1
                                                }}>
                                                {blog.category}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions
                                        sx={{
                                            backgroundColor: '#ffffff'
                                        }}
                                        disableSpacing
                                        onClick={(event) => { event.stopPropagation() }}>

                                        {/*Preview Button */}
                                        <IconButton aria-label="preview"
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleCardClickPreview(blog)
                                            }}>
                                            <PreviewIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )))}
                </Grid>
            </Box>
        </>
    )
}

export default SearchPage