// src/Blog/BlogAllCard.jsx

import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, useTheme, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setBlogs, setTransferDisplay } from '../reduxstore/blogSlice';
import { useNavigate } from 'react-router-dom';

function BlogAllCard() {
  const blogs = useSelector(state => state.blog.blogs);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const theme = useTheme();

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/upload/allCard',
          null,  // no data payload for POST request
          {
            withCredentials: true  // Send cookies with the request
          }
        );
        const blogBackendIformation = response.data.data.sort((a, b) => {
          // Convert uploadTime to Date objects
          const dateA = new Date(a.uploadTime);
          const dateB = new Date(b.uploadTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        dispatch(setBlogs(blogBackendIformation))
      }
      catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  }, []);

  // Combine Redux and Backend blogs
  const combinedBlogs = [...blogs];

  const handleCardClick = (blogId) => {
    dispatch(setTransferDisplay(blogId))
    const selectedBlog = blogs.find(blog => blog._id === blogId);
    navigate(`/All-Card-Show/${selectedBlog.topic}`);
  };


  return (
    <Box>
      <Grid container spacing={2}>
        {combinedBlogs.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 3, mb: 5, color: '#757575', fontStyle: 'italic' }}>
            No blogs Blogs Upload By You.
          </Typography>
        ) : (
          combinedBlogs.map((blog) => (
            <Grid item key={blog._id} xs={12} sm={6} md={4}
            >
              <Card
                sx={{
                  backgroundColor: '#f0f0f0',
                  padding: '20px',
                  margin: '10px',
                  borderRadius: '10px',
                  '@media (min-width: 1290px)': {
                    width: 345
                  },
                }}
                onClick={() => handleCardClick(blog._id)}
              >
                <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff' }}>
                    <Typography gutterBottom variant="h5" component="div"
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {blog.topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        display: 'flex',
                        textAlign: 'center'
                    }}>
                      {blog.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                      Category: {blog.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Author: {blog.author}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )))}
      </Grid>
    </Box>
  );
}

export default BlogAllCard;
