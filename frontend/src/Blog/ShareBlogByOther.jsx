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
import { setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AllCardShow from '../components/AllCardShow.jsx'

function ShareBlogByOther() {
  const [editCard, setEditeCard] = useState(false);
  const [selectedShareBlog, setSelectedShareBlog] = useState(null); // State to store the selected blog for editing
  const [retBlogs, setRetBlogs] = useState([])
  const navigate = useNavigate()
  const theme = useTheme();

  const dispatch = useDispatch();

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
      console.log(blogId)
        const response = await axios.post(`/api/v1/share/shareRecipient`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // Add other necessary parameters
        });
        console.log('Blog updated successfully:', response.data.data);

        // Update UI immediately without reload
        setRetBlogs(response.data.data);

        // Close modal or reset form if needed
        setSelectedShareBlog(null);
        setEditeCard(false);
    } catch (error) {
        console.error('Error updating blog:', error);
        // Handle error state or feedback to the user
    }
};

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('/api/v1/share/shareRecipient');
        const sortedShareInformation = response.data.data.sort((a, b) => {
          const dateA = new Date(a.shareTime);
          const dateB = new Date(b.shareTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        setRetBlogs(sortedShareInformation);
        console.log("recipient", retBlogs)
        // dispatch(resetState())
        console.log("Share response", response.data.data)
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  },
    []
  );

  // const filterBlog = () => {
  //   console.log('Redux Blogs:', blogs);
  //   console.log('Retrieved Blogs Recipient:', retBlogs);

  //   // Iterate through blogs and update shared properties if match found in retBlogs
  //   blogs.forEach(blog => {
  //     const matchingRetBlog = retBlogs.find(retBlog => retBlog.cardId === blog._id);
  //     if (matchingRetBlog) {
  //       dispatch(updateBlog({
  //         _id: blog._id, // Ensure to include blog id in the update
  //         cardViewOrEdit: matchingRetBlog.cardViewOrEdit,
  //         shareId: matchingRetBlog._id,
  //         senderId: matchingRetBlog.senderId,
  //         recipient: true
  //       }));
  //     }
  //     // If no matching retBlog found, do nothing for this blog
  //   });
  // };

  // // Call filterBlog when blogs or retBlogs change, or as needed
  // useEffect(() => {
  //   filterBlog();
  // }, [retBlogs]);

  // Filter blogs that have shared set to true in Redux
  // const filteredBlogs = blogs.filter(blog => blog.recipient === true);
  // console.log("Filtered", filteredBlogs)

  const handleCardClickPreview = (blog) => {
    console.log('Clicked blog:', blog);
    console.log('Clicked blogId:', blog._id);
    navigate(`/share-blog-Card-show-other/${blog.cardId.topic}`, { state: { blog } });
  };

  const handleCardClick = (blog) => {
    console.log('Clicked blog:', blog);
    console.log('Clicked blogId.cardId:', blog.cardId);
    // navigate(`/share-blog-Card-show-other/${blog.cardId.topic}`);
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
          {/* // filteredBlogs.map((blog, index) => (
          //   <Card
          //     key={blog._id}
          //     sx={{ width: 345, backgroundColor: '#f0f0f0', padding: '20px', margin: '10px', borderRadius: '10px' }}
          //     onClick={() => handleCardClick(blog._id)}
          //   > */}
              <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    // blog.cardId.image || 
                    `data:${blog.cardId.cardImage.contentType};base64,${blog.cardId.cardImage.data}`}
                  // image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
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
                // disableSpacing
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
                  {/* {blog.sharedViewOrEdit === 'View' ? 'View' : 'Edit'} */}
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