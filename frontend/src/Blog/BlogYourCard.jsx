// frontend/src/Blog/BlogYourCard.jsx

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { 
  Button, 
  CardActionArea, 
  CardActions, 
  IconButton, 
  Modal, 
  Box, 
  Paper, 
  TextField, 
  MenuItem, 
  Snackbar, 
  Alert,
  Grid,
  useTheme 
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import BlogEditCard from './BlogEditCard';
import { deleteBlog, setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../reduxstore/blogSlice'

function BlogYourCard({updateShareBlog}) {

  const [editCard, setEditeCard] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // State to store the selected blog for editing
  const [retBlogs, setRetBlogs] = useState([])
  const [currentBlogId, setCurrentBlogId] = useState(null)
  const [shareMessage, setShareMessage] = useState(null)
  const [shareError, setShareError] = useState(null)
  const theme = useTheme();
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareOption, setShareOption] = useState('View');
  const [shareInput, setShareInput] = useState('');
  const openShareModal = (blogId) => {
    setCurrentBlogId(blogId)
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    updateShareBlog()
  };

  //share to the recipient
  const handleShareSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardToOther/${currentBlogId}`, {
        usernameOremail: shareInput,
        option: shareOption
      },
      {
        withCredentials: true, // Send cookies with the request
    });

      const { _id } = response.data.data;

      if (response.data.message === "This card is already shared.") {
        setShareMessage("This card is already shared.");
        
      } else if (response.data.message === "Card shared successfully") {
        setShareMessage("Card shared successfully");
        dispatch(updateBlog({
          _id: currentBlogId,
          shareId: _id,
          shared: true, // Add shared field to indicate shared status
          shareOption: shareOption, // Add shareOption to indicate view or edit
          sharedViewOrEdit: shareOption 
        }));
      }

      closeShareModal();
      
    } catch (error) {
      console.error('Error sharing card:', error);
    }
  };

  const EditCardBlog = (blog) => {
    setSelectedBlog(blog);
    setEditeCard(true);
  };

  const handleClose = () => {
    setSelectedBlog(null);
    setEditeCard(false);
  };

  const handleEditCardClose = () => {
    setSelectedBlog(null);
    setEditeCard(false);
  };


  const handleDelete = async (blogId) => {
    // Dispatch action to delete blog
    const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/upload/cardDelete/${blogId}`,
      
      null,  // no data payload for POST request
      {
        withCredentials: true  // Send cookies with the request
      }
    );
    dispatch(deleteBlog({ _id: blogId }));
  };

  const blogs = useSelector(state => state.blog.blogs);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/upload/yourCard',
          null,  // no data payload for POST request
          {
            withCredentials: true  // Send cookies with the request
          });
        const sortedImages = response.data.data.sort((a, b) => {
          // Convert uploadTime to Date objects
          const dateA = new Date(a.uploadTime);
          const dateB = new Date(b.uploadTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        setRetBlogs(sortedImages);
      } catch (error) {
        if (error.response.status === 401) {
          // Handle unauthorized access
          localStorage.setItem('isLoggedIn', 'false'); // Update local storage
          navigate('/'); 
          localStorage.setItem('selectedButton', 'all');
          alert("Your session has expired. Please log in again."); // Show alert to user
          dispatch(resetState())
          window.location.reload();
          
        } else {
          // Handle other errors
          console.error('Error fetching blogs:', error);
        }
      }
    };

    fetchAllBlogs();
  },
    []
  );


  
  const filterBlog = () => {
    // Iterate through blogs and update shared properties if match found in retBlogs
    blogs.forEach(blog => {
      const matchingRetBlog = retBlogs.find(retBlog => retBlog._id === blog._id);
      if (matchingRetBlog) {
        dispatch(updateBlog({
          _id: blog._id,
          newCard: true
        }));
      }
    });
  };

  // Call filterBlog when blogs or retBlogs change, or as needed
  useEffect(() => {
    filterBlog();
  }, [retBlogs]);

  // Filter blogs that have shared set to true in Redux
  const filteredReduxBlogs = blogs.filter(blog => blog.newCard === true);
  console.log("Filtered", filteredReduxBlogs)


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
    <Box>
      <Grid container spacing={2}>
      {filteredReduxBlogs.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 3, mb: 5, color: '#757575', fontStyle: 'italic' }}>
            No blogs Blogs Upload By You.
          </Typography>
        ) : (
          filteredReduxBlogs.map((blog) => (
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
                  image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
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
                disableSpacing>

                {/*Preview Button */}
                <IconButton aria-label="preview"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleCardClickPreview(blog)
                  }}>
                  <PreviewIcon />
                </IconButton>

                {/* Edit Button */}
                <IconButton aria-label="edit"
                  onClick={(event) => {
                    event.stopPropagation()
                    EditCardBlog(blog)
                  }}>
                  <EditIcon />
                </IconButton>

                {/* Delete Button */}
                <IconButton aria-label="delete"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDelete(blog._id);
                  }}>
                  <DeleteIcon />
                </IconButton>

                {/* Share Button */}
                <Button size="small" color="primary"
                  onClick={(event) => {
                    event.stopPropagation()
                    openShareModal(blog._id)
                  }}
                >
                  Share
                </Button>
              </CardActions>
            </Card>
            </Grid>
          )))}
          </Grid>

      {/* Display success or error messages */}
      {shareMessage && (
        <Snackbar open={true} autoHideDuration={6000}
          onClose={() => setShareMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={shareMessage === "Card shared successfully" ? "success" : "info"} onClose={() => setShareMessage(null)}>
            {shareMessage}
          </Alert>
        </Snackbar>
      )}

      {shareError && (
        <Snackbar open={true} autoHideDuration={6000}
          onClose={() => setShareError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setShareError(null)}>
            {shareError}
          </Alert>
        </Snackbar>
      )}

      {/* Modal for Share */}
      <Modal
        open={shareModalOpen}
        onClose={closeShareModal}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <Paper sx={{ p: 4, overflowY: 'auto', maxHeight: '90vh', borderRadius: '8px' }}>
            <Typography id="share-modal-title" variant="h6" component="h2" gutterBottom sx={{
              marginBottom: 3
            }}>
              Share Options
            </Typography>
            <form onSubmit={handleShareSubmit}>
              <TextField
                label="UserName or Email"
                value={shareInput}
                onChange={(e) => setShareInput(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                select
                label="Select Option"
                value={shareOption}
                onChange={(e) => setShareOption(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2, minWidth: 200 }}
              >
                <MenuItem value="View">View</MenuItem>
                <MenuItem value="Edit">Edit</MenuItem>
              </TextField>

              <Button type="submit" variant="contained" color="primary">
                Share
              </Button>
            </form>
          </Paper>
        </Box>
      </Modal>

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
            {selectedBlog && <BlogEditCard blog={selectedBlog} onClose={handleEditCardClose} />}
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}

export default BlogYourCard;
