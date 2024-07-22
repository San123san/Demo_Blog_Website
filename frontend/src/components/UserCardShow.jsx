// src/components/UserCardShow.jsx

import React from 'react'
import { Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';

function UserCardShow() {

    const setTransferDisplay = useSelector((state) => state.blog.transferDisplay)
    const blogs = useSelector((state) => state.blog.blogs)
    const showBlog = blogs.find((blog) => blog._id === setTransferDisplay)
    return (

        <>
           <Box sx={{
            margin: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Category: {showBlog.category}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                {showBlog.topic}
            </Typography>

            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {showBlog.description}
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                {showBlog.blogContent}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                    Author:
                </Typography>
                <Typography variant="subtitle1">{showBlog.author}</Typography>
            </Box>

            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Upload Date: {showBlog.uploadTime}
            </Typography>
        </Box>
        </>
    )
}

export default UserCardShow