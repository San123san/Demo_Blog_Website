// src/components/ShareBlogCardShowOther.jsx

import React from 'react'
import { Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

function ShareBlogCardShowOther() {
    const location = useLocation();
    const { blog } = location.state;
    console.log("location", blog)
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
                    Category: {blog.cardId.category}
                </Typography>

                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    {blog.cardId.topic}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {blog.cardId.description}
                </Typography>

                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    {blog.cardId.cardIdContent}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                        Author:
                    </Typography>
                    <Typography variant="subtitle1">{blog.cardId.author}</Typography>
                </Box>

                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    Upload Date: {blog.cardId.uploadTime}
                </Typography>
            </Box>
        </>
    )
}

export default ShareBlogCardShowOther