// src/components/Food.jsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton, Box, Grid, useTheme } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { useSelector, useDispatch } from 'react-redux';
import { setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
import { useNavigate } from 'react-router-dom';

function Food() {
  const theme = useTheme();
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blog.blogs);

  // Filter blogs that have shared set to true in Redux
  const filteredBlogs = blogs.filter(blog => blog.category === 'Food');

  const handleCardClickPreview = (blog) => {
    dispatch(setTransferDisplay(blog._id));
    navigate(`/User-Card-Show/${blog.topic}`);
  };

  const handleCardClick = (blogId) => {
    dispatch(setTransferDisplay(blogId));
    const selectedBlog = blogs.find(blog => blog._id === blogId);
    navigate(`/User-Card-Show/${selectedBlog.topic}`);
  };

  return (
    <>
      <Box sx={{
        mt: 5
      }}>
      <Grid container spacing={2}>
        {filteredBlogs.length === 0 ? (
          <Typography variant="h6" sx={{ 
            width: '100%',
            mt: 10, 
            mb: 5, 
            color: '#757575', 
            fontStyle: 'italic', 
            display: 'flex' ,
            justifyContent: 'center',
            }}>
          No blogs Related To Food.
        </Typography>
        ) : (
          filteredBlogs.map((blog) => (
            <Grid item key={blog._id} xs={12} sm={6} md={4}>
            <Card
              sx={{ 
                backgroundColor: '#f0f0f0', 
                padding: '20px', 
                margin: '10px', 
                borderRadius: '10px' ,
                '@media (min-width: 1290px)':{
                  width: 345
                }
              }}
              onClick={() => handleCardClick(blog._id)}
            >
            <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
              <CardMedia
                component="img"
                height="140"
                image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
                sx={{
                  objectFit: 'contain'
                }}
              />
              <CardContent sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff' }}>
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
                backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
                borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'white'}`, 
              }}
              disableSpacing
              onClick={(event) => {event.stopPropagation()}}>

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

export default Food