// // src/Blog/BlogAllCard.jsx

// import React, { useState, useEffect } from 'react'
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { CardActionArea } from '@mui/material';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
// // import { addBlog } from '../reduxstore/blogSlice';


// function BlogAllCard() {

//   // const dispatch = useDispatch();
//   const blogs = useSelector(state => state.blog.blogs);
//   const [retBlogs, setretBlogs] = useState([])

//   useEffect(() => {
//     // Function to fetch all blogs
//     const fetchAllBlogs = async () => {
//       try {
//         const response = await axios.post('/api/v1/upload/allCard');
//         console.log(response)
//         setretBlogs(response.data.data)
//         // dispatch(addBlog(response.data.data));
//       } catch (error) {
//         console.error('Error fetching blogs:', error);
//       }
//     };

//     fetchAllBlogs();
//   },
//     // [dispatch]
//     []
//   );

//   const generateGrid = (blogs) => {
//     const grid = [];
//     for (let i = 0; i < blogs.length; i += 3) {
//       grid.push(blogs.slice(i, i + 3));
//     }
//     return grid;
//   };

//   const gridLayout = generateGrid(blogs);


//   // Backend Information
//   // Function to chunk the array into rows of size n
//   const chunkArray = (array, size) => {
//     return array.reduce((chunks, item, index) => {
//       if (index % size === 0) {
//         chunks.push([item]);
//       } else {
//         chunks[chunks.length - 1].push(item);
//       }
//       return chunks;
//     }, []);
//   };

//   const rowsOfCards = chunkArray(retBlogs, 3);

//   return (
//     <div>
//       {gridLayout.map((row, rowIndex) => (
//         <div key={rowIndex} style={{ display: 'flex' }}>
//           {row.map((blog) => (
//             <Card
//               key={blog.id} // Unique key for each card
//               sx={{ width: 345, backgroundColor: '#f0f0f0', padding: '20px', margin: '10px', borderRadius: '10px' }}
//             >
//               <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   // image={blog.image || '/static/images/cards/placeholder.png'}
//                   image={blog.image}
//                   sx={{
//                     objectFit: 'contain'

//                   }}
//                 />
//                 <CardContent sx={{ backgroundColor: '#ffffff' }}>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {blog.topic}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {blog.description}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary"
//                     sx={{
//                       marginTop: 1
//                     }}>
//                     {blog.category}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           ))}
//         </div>
//       ))}

//       {/* //without dispatch */}
//       {rowsOfCards.map((row, rowIndex) => (
//         <div key={rowIndex} style={{ display: 'flex' }}>
//           {row.map((blog, index) => (
//             <Card
//               key={index}
//               sx={{ width: 345, backgroundColor: '#f0f0f0', padding: '20px', margin: '10px', borderRadius: '10px' }}
//             >
//               <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   image={`data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
//                   sx={{
//                     objectFit: 'contain'
//                   }}
//                 />
//                 <CardContent sx={{ backgroundColor: '#ffffff' }}>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {blog.topic}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {blog.description}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
//                     {blog.category}
//                   </Typography>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default BlogAllCard


// src/Blog/BlogAllCard.jsx

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, useTheme, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { resetState, setBlogs, setTransferDisplay } from '../reduxstore/blogSlice';
import AllCardShow from '../components/AllCardShow'
import { useNavigate } from 'react-router-dom';

function BlogAllCard({ isLoggedIn }) {
  const blogs = useSelector(state => state.blog.blogs);
  const [retBlogs, setRetBlogs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const theme = useTheme();

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/upload/allCard');
        console.log(response.data.data)
        const blogBackendIformation = response.data.data.sort((a, b) => {
          // Convert uploadTime to Date objects
          const dateA = new Date(a.uploadTime);
          const dateB = new Date(b.uploadTime);
          // Compare the dates
          return dateB - dateA; // Latest dates first
        });
        // setRetBlogs(sortedImages);
        console.log(blogBackendIformation)
        //store in the reudx
        dispatch(setBlogs(blogBackendIformation))
        console.log(dispatch(setBlogs(blogBackendIformation)))
        
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  }, []);

  // Combine Redux and Backend blogs
  const combinedBlogs = [...blogs];
  // const combinedBlogs = [...blogs, ...retBlogs];

  // Generate grid layout for combined blogs
  // const generateGrid = (blogs) => {
  //   const grid = [];
  //   for (let i = 0; i < blogs.length; i += 3) {
  //     grid.push(blogs.slice(i, i + 3));
  //   }
  //   return grid;
  // };

  // const gridLayout = generateGrid(combinedBlogs);

  const handleCardClick = (blogId) => {
    console.log('Clicked blogId:', blogId);
    dispatch(setTransferDisplay(blogId))
    const selectedBlog = blogs.find(blog => blog._id === blogId);
    navigate(`/All-Card-Show/${selectedBlog.topic}`);
    // navigate(`/All-Card-Show/${blogId}`)
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
          {/* combinedBlogs.map((row, rowIndex) => (
            <Box key={rowIndex} style={{ display: 'flex' }}>
              {row.map((blog, index) => (
                <Card
                  key={blog._id} // Use a unique key for each card
                  sx={{
                    width: 345,
                    backgroundColor: theme.palette.mode === 'dark' ? '#111' : '#f0f0f0',
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                    margin: '10px',
                    borderRadius: '10px'
                  }}
                  onClick={() => handleCardClick(blog._id)}
                > */}
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
                      // sx={{ color: theme.palette.mode === 'dark' ? '#ffcc00' : '#000' }}
                      >
                        {blog.topic}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
              {/* ))} */}
            {/* </Box> */}
            </Grid>
          )))}
      </Grid>
    </Box>
  );
}

export default BlogAllCard;
