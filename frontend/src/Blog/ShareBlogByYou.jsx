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

function ShareBlogByYou({updateShareBlogNumberDelete}) {

  const [retBlogs, setRetBlogs] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const theme = useTheme();


  const handleDelete = async (blogShareId) => {
    console.log(blogShareId)
    // Dispatch action to delete blog
    const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardByYouDelete/${blogShareId}`,
      
      null,  // no data payload for POST request
      {
        withCredentials: true  // Send cookies with the request
      });
    console.log(response)
    dispatch(updateBlog({ _id: blogShareId, shared: false }));
    updateShareBlogNumberDelete()
  };

  const blogs = useSelector(state => state.blog.blogs);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardInformation',
      
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
        // dispatch(resetState())
        console.log("Share response", response.data.data)
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
  },
    [updateBlog]
  );

  const filterBlog = () => {
    console.log('Redux Blogs:', blogs);
    console.log('Retrieved Blogs:', retBlogs);

    // Iterate through blogs and update shared properties if match found in retBlogs
    blogs.forEach(blog => {
      const matchingRetBlog = retBlogs.find(retBlog => retBlog.shareBlogCard === blog._id);
      // const matchingRetBlog = retBlogs.find(retBlog => retBlog.shareBlogCard === blog._id);
      if (matchingRetBlog) {
        dispatch(updateBlog({
          _id: blog._id, // Ensure to include blog id in the update
          sharedViewOrEdit: matchingRetBlog.option,
          sharedId: matchingRetBlog._id,
          shared: true // Optionally, set shared to true if it's not already set in backend response
        }));
      }
      // If no matching retBlog found, do nothing for this blog
    });
  };

  // Call filterBlog when blogs or retBlogs change, or as needed
  useEffect(() => {
    filterBlog();
  }, [retBlogs]);

  // Filter blogs that have shared set to true in Redux
  const filteredBlogs = blogs.filter(blog => blog.shared === true);
  console.log("Filtered123", filteredBlogs)

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

  //navigate to view or edit
  const handleCardViewOrEdit = (blog) => {
  
    const updatedOption = blog.sharedViewOrEdit === 'View' ? 'Edit' : 'View';
  
    dispatch(updateBlog({
      _id: blog._id,
      sharedViewOrEdit: updatedOption,
      shared: true
    }));

    console.log(blog.sharedId)
  
    // Update backend API call
    axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareCardOptioEditView/${
      blog.shareId
      // blog.sharedId
    }`, { option: updatedOption },
    {
      withCredentials: true, // Send cookies with the request
  })
      .then(response => {
        console.log('Option updated successfully:', response.data);
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
                borderRadius: '10px' ,
                '@media (min-width: 1290px)':{
                  width: 345
                }
              }}
              onClick={() => handleCardClick(blog._id)}
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
                // image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
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



// import React, { useState, useEffect } from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions, IconButton, Modal, Box, Paper, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
// import PreviewIcon from '@mui/icons-material/Preview';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useSelector, useDispatch } from 'react-redux';
// import BlogEditCard from './BlogEditCard';
// import { deleteBlog, setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function ShareBlogByYou() {

//   const [editCard, setEditeCard] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null); // State to store the selected blog for editing
//   const [retBlogs, setRetBlogs] = useState([])
//   const navigate = useNavigate()

//   const dispatch = useDispatch();

//   const handleClose = () => {
//     setSelectedBlog(null);
//     setEditeCard(false);
//   };

//   const handleEditCardClose = () => {
//     setSelectedBlog(null);
//     setEditeCard(false);
//   };


//   const handleDelete = async (blogShareId) => {
//     console.log(blogShareId)
//     // Dispatch action to delete blog
//     const response = await axios.post(`/api/v1/share/shareCardByYouDelete/${blogShareId}`);
//     console.log(response)
//     dispatch(updateBlog({ _id: blogShareId, shared: false }));
//   };

//   const blogs = useSelector(state => state.blog.blogs);

//   useEffect(() => {
//     const fetchAllBlogs = async () => {
//       try {
//         const response = await axios.post('/api/v1/share/shareCardInformation');
//         const sortedShareInformation = response.data.data.sort((a, b) => {
//           const dateA = new Date(a.shareTime);
//           const dateB = new Date(b.shareTime);
//           // Compare the dates
//           return dateB - dateA; // Latest dates first
//         });
//         setRetBlogs(sortedShareInformation);
//         // dispatch(resetState())
//         console.log("Share response", response.data.data)
//       } catch (error) {
//         console.error('Error fetching blogs:', error);
//       }
//     };

//     fetchAllBlogs();
//   },
//     []
//   );

//   const filterBlog = () => {
//     console.log('Redux Blogs:', blogs);
//     console.log('Retrieved Blogs:', retBlogs);

//     // Iterate through blogs and update shared properties if match found in retBlogs
//     blogs.forEach(blog => {
//       const matchingRetBlog = retBlogs.find(retBlog => retBlog.shareBlogCard === blog._id);
//       if (matchingRetBlog) {
//         dispatch(updateBlog({
//           _id: blog._id, // Ensure to include blog id in the update
//           sharedViewOrEdit: matchingRetBlog.option,
//           sharedId: matchingRetBlog._id,
//           shared: true // Optionally, set shared to true if it's not already set in backend response
//         }));
//       }
//       // If no matching retBlog found, do nothing for this blog
//     });
//   };

//   // Call filterBlog when blogs or retBlogs change, or as needed
//   useEffect(() => {
//     filterBlog();
//   }, [retBlogs]);

//   // Filter blogs that have shared set to true in Redux
//   const filteredBlogs = blogs.filter(blog => blog.shared === true);
//   console.log("Filtered", filteredBlogs)

//   const handleCardClickPreview = (blog) => {
//     console.log('Clicked blog:', blog);
//     console.log('Clicked blogId:', blog._id);
//     dispatch(setTransferDisplay(blog._id));
//     navigate(`/User-Card-Show/${blog.topic}`);
//   };

//   const handleCardClick = (blogId) => {
//     console.log('Clicked blog:', blogId);
//     dispatch(setTransferDisplay(blogId));
//     const selectedBlog = blogs.find(blog => blog._id === blogId);
//     navigate(`/User-Card-Show/${selectedBlog.topic}`);
//   };

//   //navigate to view or edit
//   const handleCardViewOrEdit = (blog) => {
  
//     const updatedOption = blog.sharedViewOrEdit === 'View' ? 'Edit' : 'View';
  
//     dispatch(updateBlog({
//       _id: blog._id,
//       sharedViewOrEdit: updatedOption,
//       shared: true
//     }));

//     console.log(blog.sharedId)
  
//     // Update backend API call
//     axios.post(`/api/v1/share/shareCardOptioEditView/${blog.sharedId}`, { option: updatedOption })
//       .then(response => {
//         console.log('Option updated successfully:', response.data);
//       })
//       .catch(error => {
//         console.error('Error updating option:', error);
//       });
//   };
  

//   return (
//     <>
//       <Box>
//         {filteredBlogs.map((blog, index) => (
//           <Card
//             key={blog._id}
//             sx={{ width: 345, backgroundColor: '#f0f0f0', padding: '20px', margin: '10px', borderRadius: '10px' }}
//             onClick={() => handleCardClick(blog._id)}
//           >
//             <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
//               <CardMedia
//                 component="img"
//                 height="140"
//                 // image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
//                 image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
//                 sx={{
//                   objectFit: 'contain'
//                 }}
//               />
//               <CardContent sx={{ backgroundColor: '#ffffff' }}>
//                 <Typography gutterBottom variant="h5" component="div">
//                   {blog.topic}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {blog.description}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary"
//                   sx={{
//                     marginTop: 1
//                   }}>
//                   {blog.category}
//                 </Typography>
//               </CardContent>
//             </CardActionArea>
//             <CardActions
//               sx={{
//                 backgroundColor: '#ffffff'
//               }}
//               disableSpacing>

//               {/*Preview Button */}
//               <IconButton aria-label="preview"
//                 onClick={(event) => {
//                   event.stopPropagation()
//                   handleCardClickPreview(blog)
//                 }}>
//                 <PreviewIcon />
//               </IconButton>

//               {/* Delete Button */}
//               <IconButton aria-label="delete"
//                 onClick={(event) => {
//                   event.stopPropagation()
//                   handleDelete(blog._id);
//                 }}>
//                 <DeleteIcon />
//               </IconButton>

//               {/* Share ViewOrEdit */}
//               <Typography
//                 onClick={(event) => { event.stopPropagation(); handleCardViewOrEdit(blog); }}
//                 style={{
//                   cursor: 'pointer',
//                   color: blog.sharedViewOrEdit === 'View' ? 'blue' : 'green',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 {blog.sharedViewOrEdit === 'View' ? 'View' : 'Edit'}
//               </Typography>
//             </CardActions>
//           </Card>
//         ))}


//         {/* Modal for BlogEditCard */}
//         <Modal
//           open={editCard}
//           onClose={handleClose}
//           aria-labelledby="create-blog-modal-title"
//           aria-describedby="create-blog-modal-description"
//         >
//           <Box sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}>
//             <Paper sx={{ p: 4, overflowY: 'auto', maxHeight: '90vh', borderRadius: '8px' }}>
//               <Typography id="create-blog-modal-title" variant="h6" component="h2" gutterBottom sx={{
//                 marginBottom: 3
//               }}>
//                 Edit Your Blog
//               </Typography>
//               {selectedBlog && <BlogEditCard blog={selectedBlog} onClose={handleEditCardClose} />}
//             </Paper>
//           </Box>
//         </Modal>
//       </Box>
//     </>
//   )
// }

// export default ShareBlogByYou


// import React, { useState, useEffect } from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions, IconButton, Modal, Box, Paper, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
// import PreviewIcon from '@mui/icons-material/Preview';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useSelector, useDispatch } from 'react-redux';
// import BlogEditCard from './BlogEditCard';
// import { deleteBlog, setTransferDisplay, updateBlog } from '../reduxstore/blogSlice';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function ShareBlogByYou() {

//   const [editCard, setEditeCard] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null); // State to store the selected blog for editing
//   const [retBlogs, setRetBlogs] = useState([])
//   const navigate = useNavigate()

//   const dispatch = useDispatch();

//   const handleClose = () => {
//     setSelectedBlog(null);
//     setEditeCard(false);
//   };

//   const handleEditCardClose = () => {
//     setSelectedBlog(null);
//     setEditeCard(false);
//   };


//   const handleDelete = async (blogShareId) => {
//     console.log(blogShareId)
//     // Dispatch action to delete blog
//     const response = await axios.post(`/api/v1/share/shareCardByYouDelete/${blogShareId}`);
//     console.log(response)
//     dispatch(updateBlog({ _id: blogShareId, shared: false }));
//   };

//   const blogs = useSelector(state => state.blog.blogs);

//   useEffect(() => {
//     const fetchAllBlogs = async () => {
//       try {
//         const response = await axios.post('/api/v1/share/shareCardInformation');
//         const sortedShareInformation = response.data.data.sort((a, b) => {
//           const dateA = new Date(a.shareTime);
//           const dateB = new Date(b.shareTime);
//           // Compare the dates
//           return dateB - dateA; // Latest dates first
//         });
//         setRetBlogs(sortedShareInformation);
//         // dispatch(resetState())
//         console.log("Share response", response.data.data)
//       } catch (error) {
//         console.error('Error fetching blogs:', error);
//       }
//     };

//     fetchAllBlogs();
//   },
//     []
//   );

//   const filterBlog = () => {
//     console.log('Redux Blogs:', blogs);
//     console.log('Retrieved Blogs:', retBlogs);

//     // Iterate through blogs and update shared properties if match found in retBlogs
//     blogs.forEach(blog => {
//       const matchingRetBlog = retBlogs.find(retBlog => retBlog.shareBlogCard === blog._id);
//       if (matchingRetBlog) {
//         dispatch(updateBlog({
//           _id: blog._id, // Ensure to include blog id in the update
//           sharedViewOrEdit: matchingRetBlog.option,
//           sharedId: matchingRetBlog._id,
//           shared: true // Optionally, set shared to true if it's not already set in backend response
//         }));
//       }
//       // If no matching retBlog found, do nothing for this blog
//     });
//   };

//   // Call filterBlog when blogs or retBlogs change, or as needed
//   useEffect(() => {
//     filterBlog();
//   }, [retBlogs]);

//   // Filter blogs that have shared set to true in Redux
//   const filteredBlogs = blogs.filter(blog => blog.shared === true);
//   console.log("Filtered", filteredBlogs)

//   // Generate grid layout for combined blogs
//   // const generateGrid = (blogs) => {
//   //   const grid = [];
//   //   for (let i = 0; i < blogs.length; i += 3) {
//   //     grid.push(blogs.slice(i, i + 3));
//   //   }
//   //   return grid;
//   // };

//   // const gridLayout = generateGrid(filteredBlogs);

//   const handleCardClickPreview = (blog) => {
//     console.log('Clicked blog:', blog);
//     console.log('Clicked blogId:', blog._id);
//     dispatch(setTransferDisplay(blog._id));
//     navigate(`/User-Card-Show/${blog.topic}`);
//   };

//   const handleCardClick = (blogId) => {
//     console.log('Clicked blog:', blogId);
//     dispatch(setTransferDisplay(blogId));
//     const selectedBlog = blogs.find(blog => blog._id === blogId);
//     navigate(`/User-Card-Show/${selectedBlog.topic}`);
//   };

//   //navigate to view or edit
//   const handleCardViewOrEdit = (blogId) => {
//     const selectedBlog = blogs.find(blog => blog._id === blogId);
//     const updatedOption = selectedBlog.sharedViewOrEdit === 'View' ? 'Edit' : 'View';

//     dispatch(updateBlog({
//       _id: blogId,
//       sharedViewOrEdit: updatedOption,
//       shared: true
//     }));
//     // Update backend API call
//     axios.post(`/api/v1/share/yourOptionEdit/${blogId}`, { option: updatedOption })
//       .then(response => {
//         console.log('Option updated successfully:', response.data);
//       })
//       .catch(error => {
//         console.error('Error updating option:', error);
//       });
//   };

//   return (
//     <>
//       <Box>
//         {gridLayout.map((row, rowIndex) => (
//           <div key={rowIndex} style={{ display: 'flex' }}>
//             {row.map((blog) => (
//               <Card
//                 key={
//                   blog._id
//                   // || 
//                   // blog.id
//                 } // Ensure each card has a unique key based on blog.id
//                 sx={{ width: 345, backgroundColor: '#f0f0f0', padding: '20px', margin: '10px', borderRadius: '10px' }}
//                 onClick={() => handleCardClick(blog._id)}
//               >
//                 <CardActionArea sx={{ backgroundColor: '#ffffff' }}>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     // image={blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`}
//                     image={blog.cardImage ? `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}` : blog.image}
//                     sx={{
//                       objectFit: 'contain'
//                     }}
//                   />
//                   <CardContent sx={{ backgroundColor: '#ffffff' }}>
//                     <Typography gutterBottom variant="h5" component="div">
//                       {blog.topic}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {blog.description}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary"
//                       sx={{
//                         marginTop: 1
//                       }}>
//                       {blog.category}
//                     </Typography>
//                   </CardContent>
//                 </CardActionArea>
//                 <CardActions
//                   sx={{
//                     backgroundColor: '#ffffff'
//                   }}
//                   disableSpacing>

//                   {/*Preview Button */}
//                   <IconButton aria-label="preview"
//                     onClick={(event) => {
//                       event.stopPropagation()
//                       handleCardClickPreview(blog)
//                     }}>
//                     <PreviewIcon />
//                   </IconButton>

//                   {/* Delete Button */}
//                   <IconButton aria-label="delete"
//                     onClick={(event) => {
//                       event.stopPropagation()
//                       handleDelete(blog._id);
//                     }}>
//                     <DeleteIcon />
//                   </IconButton>

//                   {/* Share ViewOrEdit */}
//                   <Typography
//                     onClick={(event) => { event.stopPropagation(); handleCardViewOrEdit(blog._id); }}
//                     style={{
//                       cursor: 'pointer',
//                       color: blog.sharedViewOrEdit === 'View' ? 'blue' : 'green',
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     {blog.sharedViewOrEdit === 'View' ? 'Edit' : 'View'}
//                   </Typography>
//                 </CardActions>
//               </Card>
//             ))}
//           </div>
//         ))}


//         {/* Modal for BlogEditCard */}
//         <Modal
//           open={editCard}
//           onClose={handleClose}
//           aria-labelledby="create-blog-modal-title"
//           aria-describedby="create-blog-modal-description"
//         >
//           <Box sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}>
//             <Paper sx={{ p: 4, overflowY: 'auto', maxHeight: '90vh', borderRadius: '8px' }}>
//               <Typography id="create-blog-modal-title" variant="h6" component="h2" gutterBottom sx={{
//                 marginBottom: 3
//               }}>
//                 Edit Your Blog
//               </Typography>
//               {selectedBlog && <BlogEditCard blog={selectedBlog} onClose={handleEditCardClose} />}
//             </Paper>
//           </Box>
//         </Modal>
//       </Box>
//     </>
//   )
// }

// export default ShareBlogByYou