// src/components/Home.jsx

import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Button, Box, Modal, Paper } from '@mui/material';
import BlogCreateCard from '../Blog/BlogCreateCard';
import BlogAllCard from '../Blog/BlogAllCard';
import BlogYourCard from '../Blog/BlogYourCard';

function Home({ isLoggedIn }) {
  // const [selectedButton, setSelectedButton] = useState('all');
  const [selectedButton, setSelectedButton] = useState(() => {
    // Initialize with stored value or default to 'all'
    return localStorage.getItem('selectedButton') || 'all';
  });
  const [createCard, setCreateCard] = useState(false);

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  const createCardBlog = () => {
    setCreateCard(true);
  };

  const handleClose = () => {
    setCreateCard(false);
  };

  const handleCreateCardClose = () => {
    setCreateCard(false);
  };

  // Store selectedButton in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedButton', selectedButton);
  }, [selectedButton]);

  // Reset selectedButton when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedButton('all');
    }
  }, [isLoggedIn]);

  // Restore selectedButton from localStorage on component mount
  useEffect(() => {
    const storedSelectedButton = localStorage.getItem('selectedButton');
    if (storedSelectedButton) {
      setSelectedButton(storedSelectedButton);
    }
  }, []);

  return (
    <>
      <Container maxWidth="md" sx={{ paddingTop: '100px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Blog
            </Typography>
            <Typography variant="body1" paragraph>
              A blog is a type of website or a section of a website where individuals or groups of people (bloggers) regularly post content in the form of articles, opinions, reflections, or informational pieces. These entries, called blog posts, are typically displayed in reverse chronological order, with the newest post appearing first.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={createCardBlog}
            >
              Make Your Own Blog
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ display: 'flex', marginTop: '50px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px' }}>
        <Button
          variant="contained"
          color={selectedButton === 'all' ? 'secondary' : 'primary'}
          size="large"
          onClick={() => handleButtonClick('all')}
        >
          All Blog
        </Button>

        {isLoggedIn && (
          <Button
            variant="contained"
            color={selectedButton === 'yours' ? 'secondary' : 'primary'}
            size="large"
            onClick={() => handleButtonClick('yours')}
            sx={{ marginLeft: '8px' }}
          >
            Your Blog
          </Button>
        )}

      </Box>

      {/* Conditional rendering based on selectedButton */}
      {selectedButton === 'all' && <BlogAllCard />}

      {isLoggedIn && selectedButton === 'yours' && <BlogYourCard />}

      {/* Modal for BlogCreateCard */}
      <Modal
        open={createCard}
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
            <Typography id="create-blog-modal-title" variant="h6" component="h2" gutterBottom>
              Create Your Blog
            </Typography>
            <Typography id="create-blog-modal-description" variant="body1" gutterBottom>
              Fill out the details to create your blog.
            </Typography>
            <BlogCreateCard onClose={handleCreateCardClose}/>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}

export default Home;
