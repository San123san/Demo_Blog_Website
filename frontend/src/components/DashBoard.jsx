// src/components/DashBoard.jsx
import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, useTheme } from '@mui/material'
import BlogYourCard from '../Blog/BlogYourCard'
import ShareBlogByYou from '../Blog/ShareBlogByYou'
import ShareBlogByOther from '../Blog/ShareBlogByOther'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

function DashBoard() {
  const [showTotalNumber, setShowTotalNumber] = useState('')
  const theme = useTheme();
  const dispatch = useDispatch
  const blogs = useSelector(state => state.blog.blogs);

  const updateShareBlog = async () => {
    const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/total/totalCardCount',
      null,  // no data payload for POST request
      {
        withCredentials: true  // Send cookies with the request
      });
    setShowTotalNumber(response.data.data)
  }

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/total/totalCardCount',
          null,  
          {
            withCredentials: true  
          });
        setShowTotalNumber(response.data.data)
      } catch (error) {
          console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  }, [dispatch]);

  return (
    <>
      <Box
        sx={{
          margin: 5
        }}>
        {/* //Total Numbers */}
        <Container>
          <Typography>Total Number of Blog Create: {showTotalNumber.userCount}</Typography>
          <Typography>Total Number of Blog Share by You: {showTotalNumber.senderCount}</Typography>
          <Typography>Total Number of Blog Share by Other: {showTotalNumber.recipientCount}</Typography>
        </Container>

        {/* //Share By You */}
        <Container>
          <Typography sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
            padding: '10px', borderRadius: '10px', fontWeight: 'Bold', fontSize: 30,
            '@media (min-width: 1290px)': {
              width: 1160
            }
          }}> Blog - Share By You</Typography>
          <Box>
            <ShareBlogByYou updateShareBlogNumberDelete={updateShareBlog}/>
          </Box>
        </Container>

        {/* Share By other */}
        <Box>
          <Container>
            <Typography sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0', padding: '10px', borderRadius: '10px',
              fontWeight: 'Bold', fontSize: 30,
              '@media (min-width: 1290px)': {
                width: 1160
              }
            }}> Blog - Share By Other</Typography>
            <Box>
              <ShareBlogByOther />
            </Box>
          </Container>
        </Box>


        {/* Your Blog */}
        <Container>
          <Typography sx={{
            padding: '10px', borderRadius: '10px', fontWeight: 'Bold', fontSize: 30,
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
            '@media (min-width: 1290px)': {
              width: 1160
            }
          }}> Your Blog</Typography>
          <Box>
            <BlogYourCard updateShareBlog={updateShareBlog}/>
          </Box>
        </Container>

      </Box>
    </>
  )
}

export default DashBoard