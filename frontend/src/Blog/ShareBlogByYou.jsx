// src/Blog/ShareBlogByYou

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton, Box, Grid, useTheme } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ShareBlogByYou({ updateShareBlogNumberDelete }) {

  const [retBlogs, setRetBlogs] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const theme = useTheme();


  const handleDelete = async (blogShareId) => {
    // Dispatch action to delete blog
    const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardByYouDelete/${blogShareId}`,

      null,
      {
        withCredentials: true
      });
    dispatch(updateBlog({ _id: blogShareId, shared: false }));
    updateShareBlogNumberDelete()
  };

  const blogs = useSelector(state => state.blog.blogs);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardInformation',

          null,
          {
            withCredentials: true
          });
        const sortedShareInformation = response.data.data.sort((a, b) => {
          const dateA = new Date(a.shareTime);
          const dateB = new Date(b.shareTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        setRetBlogs(sortedShareInformation);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  },
    [updateBlog]
  );

  const filterBlog = () => {
    // Iterate through blogs and update shared properties if match found in retBlogs
    blogs.forEach(blog => {
      const matchingRetBlog = retBlogs.find(retBlog => retBlog.shareBlogCard === blog._id);
      if (matchingRetBlog) {
        dispatch(updateBlog({
          _id: blog._id, // Ensure to include blog id in the update
          sharedViewOrEdit: matchingRetBlog.option,
          sharedId: matchingRetBlog._id,
          shared: true // Optionally, set shared to true if it's not already set in backend response
        }));
      }
    });
  };

  // Call filterBlog when blogs or retBlogs change, or as needed
  useEffect(() => {
    filterBlog();
  }, [retBlogs]);

  // Filter blogs that have shared set to true in Redux
  const filteredBlogs = blogs.filter(blog => blog.shared === true);

  const handleCardClickPreview = (blog) => {
    dispatch(setTransferDisplay(blog._id));
    navigate(`/User-Card-Show/${blog.topic}`);
  };

  const handleCardClick = (blogId) => {
    dispatch(setTransferDisplay(blogId));
    const selectedBlog = blogs.find(blog => blog._id === blogId);
    navigate(`/User-Card-Show/${selectedBlog.topic}`);
  };

  //navigate to view or edit
  const handleCardViewOrEdit = (blog) => {

    const updatedOption = blog.sharedViewOrEdit === 'View' ? 'Edit' : 'View';

    dispatch(updateBlog({
      _id: blog._id,
      sharedViewOrEdit: updatedOption,
      shared: true
    }));

    // Update backend API call
    axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardOptioEditView/${blog.shareId
      }`, { option: updatedOption },
      {
        withCredentials: true,
      })
      .then(response => {
        console.log('Option updated successfully:');
      })
      .catch(error => {
        console.error('Error updating option:', error);
      });
  };


  return (
    <>
      <Box>
        <Grid container spacing={2}>
          {filteredBlogs.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 3, mb: 5, color: '#757575', fontStyle: 'italic' }}>
              No blogs shared by you.
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
                      image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
                      sx={{
                        objectFit: 'contain'
                      }}
                    />
                    <CardContent sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff' }}>
                      <Typography gutterBottom variant="h5" component="div" sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {blog.topic}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: 'flex',
                        textAlign: 'center'
                      }}>
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
                    onClick={(event) => { event.stopPropagation() }}>

                    {/*Preview Button */}
                    <IconButton aria-label="preview"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleCardClickPreview(blog)
                      }}>
                      <PreviewIcon />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton aria-label="delete"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDelete(blog._id);
                      }}>
                      <DeleteIcon />
                    </IconButton>

                    {/* Share ViewOrEdit */}
                    <Typography
                      onClick={(event) => { event.stopPropagation(); handleCardViewOrEdit(blog); }}
                      style={{
                        cursor: 'pointer',
                        color: blog.sharedViewOrEdit === 'View' ? 'blue' : 'green',
                        fontWeight: 'bold'
                      }}
                    >
                      {blog.sharedViewOrEdit === 'View' ? 'View' : 'Edit'}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            )))}
        </Grid>
      </Box>
    </>
  )
}

export default ShareBlogByYou
