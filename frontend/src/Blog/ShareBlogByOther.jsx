// src/Blog/ShareBlogByOther.jsx

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, IconButton, Modal, Box, Paper, Grid, useTheme  } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector, useDispatch } from 'react-redux';
import ShareBlogEditCard from './ShareBlogEditCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ShareBlogByOther() {
  const [editCard, setEditeCard] = useState(false);
  const [selectedShareBlog, setSelectedShareBlog] = useState(null); // State to store the selected blog for editing
  const [retBlogs, setRetBlogs] = useState([])
  const navigate = useNavigate()
  const theme = useTheme();

  const handleClose = () => {
    setSelectedShareBlog(null);
    setEditeCard(false);
  };

  const handleEditCardClose = () => {
    setSelectedShareBlog(null);
    setEditeCard(false);
  };

  const EditCardBlog = (blog) => {
    setSelectedShareBlog(blog);
    setEditeCard(true);
  };

  const blogs = useSelector(state => state.blog.blogs);

  // Function to handle blog update
  const handleBlogUpdate = async (formData, blogId) => {
    try {
        const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareRecipient`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            
            withCredentials: true  // Send cookies with the request
        });

        setRetBlogs(response.data.data);

        setSelectedShareBlog(null);
        setEditeCard(false);
    } catch (error) {
        console.error('Error updating blog:', error);
    }
};

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareRecipient',
          null,  // no data payload for POST request
          {
            withCredentials: true  // Send cookies with the request
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
    []
  );

  const handleCardClickPreview = (blog) => {
    navigate(`/share-blog-Card-show-other/${blog.cardId.topic}`, { state: { blog } });
  };

  const handleCardClick = (blog) => {
    navigate(`/share-blog-Card-show-other/${blog.cardId.topic}`, { state: { blog } });
  };
  return (
    <>
      <Box>
      <Grid container spacing={2}>
        {retBlogs.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 3, mb: 5, color: '#757575', fontStyle: 'italic' }}>
            No blogs shared by Other.
          </Typography>
        ) : (
          retBlogs.map((blog) => (
            <Grid item key={blog.cardId._id} xs={12} sm={6} md={4}>
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
              onClick={() => handleCardClick(blog)}
            >
              <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    `data:${blog.cardId.cardImage.contentType};base64,${blog.cardId.cardImage.data}`}
                  sx={{
                    objectFit: 'contain'
                  }}
                />
                <CardContent sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.cardId.topic}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.cardId.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"
                    sx={{
                      marginTop: 1
                    }}>
                    {blog.cardId.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
               sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
                borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'white' : 'white'}`, 
              }}
                onClick={(event) => { event.stopPropagation() }}>

                {/*Preview Button */}
                <IconButton aria-label="preview"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleCardClickPreview(blog)
                  }}>
                  <PreviewIcon />
                </IconButton>

                {/* Edit Button */}

                <Box>
                  <IconButton
                    aria-label="edit"
                    disabled={blog.cardViewOrEdit === 'View'}
                    onClick={(event) => {
                      event.stopPropagation();
                      EditCardBlog(blog);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                  
                

                {/* Share ViewOrEdit */}
                <Box
                  style={{
                    color: blog.sharedViewOrEdit === 'View' ? 'blue' : 'green',
                    display: 'flex'
                  }}
                >
                  <Typography sx={{ color: 'black' }}>You can&nbsp;</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{blog.cardViewOrEdit === 'View' ? 'View' : 'Edit'}</Typography>
                </Box>
              </CardActions>
            </Card>
            </Grid>
          )))}


        {/* Modal for BlogEditCard */}
        <Modal
          open={editCard}
          onClose={handleClose}
          aria-labelledby="create-blog-modal-title"
          aria-describedby="create-blog-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <Paper sx={{ p: 4, overflowY: 'auto', maxHeight: '90vh', borderRadius: '8px' }}>
              <Typography id="create-blog-modal-title" variant="h6" component="h2" gutterBottom sx={{
                marginBottom: 3
              }}>
                Edit Your Blog
              </Typography>
              {selectedShareBlog && <ShareBlogEditCard blog={selectedShareBlog} onClose={handleEditCardClose} 
              handleBlogUpdate={handleBlogUpdate}/>}
            </Paper>
          </Box>
        </Modal>
        </Grid>
      </Box>
    </>
  )
}

export default ShareBlogByOther