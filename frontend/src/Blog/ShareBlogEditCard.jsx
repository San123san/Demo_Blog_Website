// src/Blog/ShareBlogEditCard.jsx

import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    Container,
    Grid,
    Button,
    TextField,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';

import { useDispatch } from 'react-redux';
import '../Blog/style.css';
import axios from 'axios';

function ShareBlogEditCard({ blog, onClose, handleBlogUpdate}) {

    const [image, setImage] = useState(
        `data:${blog.cardId.cardImage.contentType};base64,${blog.cardId.cardImage.data}`);
    const [selectedImage, setSelectedImage] = useState(null);
    const [topic, setTopic] = useState(blog.cardId.topic || '');
    const [description, setDescription] = useState(
        EditorState.createWithContent(ContentState.createFromText(blog.cardId.description || ''))
    );
    const [blogContent, setBlogContent] = useState(
        EditorState.createWithContent(ContentState.createFromText(blog.cardId.blogContent || ''))
    );
    const [category, setCategory] = useState(blog.cardId.category || '');
    const [author, setAuthor] = useState(blog.cardId.author || '')

    useEffect(() => {
        if (blog.cardId.image) setImage(blog.cardId.cardImage);
        if (blog.cardId.topic) setTopic(blog.cardId.topic);
        if (blog.cardId.author) setAuthor(blog.cardId.author);
        if (blog.cardId.description)
            setDescription(EditorState.createWithContent(ContentState.createFromText(blog.cardId.description)));
        if (blog.cardId.blogContent)
            setBlogContent(EditorState.createWithContent(ContentState.createFromText(blog.cardId.blogContent)));
        if (blog.cardId.category) setCategory(blog.cardId.category);
    }, [blog]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        setSelectedImage(file);
        setImage(URL.createObjectURL(file));
    };

    const handleDescriptionChange = (newEditorState) => {
        setDescription(newEditorState);
    };

    const handleBlogContentChange = (newEditorState) => {
        setBlogContent(newEditorState);
    };

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async () => {
        // Convert EditorState to plain text for saving in Redux
        const rawDescription = convertToRaw(description.getCurrentContent());
        const rawBlogContent = convertToRaw(blogContent.getCurrentContent());

        // Extract plain text from ContentState
        const descriptionText = rawDescription.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        const blogContentText = rawBlogContent.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');

        // Prepare the data to be sent
        const formData = new FormData();
        formData.append('description', descriptionText);
        formData.append('topic', topic);
        formData.append('author', author); // Ensure you have blog.cardId.author available in state
        formData.append('blogContent', blogContentText);
        formData.append('category', category);
        formData.append('cardImage', selectedImage); // Ensure 'image' is the updated image data

        try {
            const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/share/shareOtherEditCard/${blog.cardId._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {  // Include recipientId, senderId, and cardViewEdit as query parameters
                    shareId: blog._id,
                    senderId: blog.senderId,
                    cardViewEdit: blog.cardViewOrEdit
                },
                withCredentials: true
            });
        handleBlogUpdate(formData, blog._id);
        } catch (error) {
            console.error('Error updating blog:', error);
        }
        onClose();
    };


    const handleCancel = () => {
        console.log('Form cancelled');
        onClose();
    };

    return (
        <Container>
            <Grid container spacing={3}>

                {/* Image Update */}
                <Grid item xs={12}>

                    <img src={image}
                        style={{
                            width: '220px',
                            height: '220px',
                            objectFit: 'contain'
                        }}
                        alt="Uploaded"
                    />
                </Grid>

                {/* Upload Image Button */}
                <Grid item xs={12}>
                    <input
                        accept="image/*"
                        id="image-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                        <Button
                            variant="contained"
                            component="span"
                            color="primary"
                            style={{
                                marginBottom: '20px',
                                width: '220px',
                            }}
                        >
                            Upload Image
                        </Button>

                    </label>
                </Grid>

                {/* Topic */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Topic Here"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                </Grid>

                {/* Select Category */}
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 400 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                label="Select Category"
                                onChange={handleChange}
                            >
                                <MenuItem value="Technology">Technology</MenuItem>
                                <MenuItem value="Travel">Travel</MenuItem>
                                <MenuItem value="Food">Food</MenuItem>
                                <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Description Editor */}
                <Grid item xs={12}>
                    <Editor
                        editorState={description}
                        onEditorStateChange={handleDescriptionChange}
                        wrapperClassName="draft-wrapper"
                        editorClassName="draft-editor"
                        toolbarClassName="toolbar-class"
                        placeholder="Enter Description Here"
                    />
                </Grid>

                {/* Blog Content Editor */}
                <Grid item xs={12}>
                    <Editor
                        editorState={blogContent}
                        onEditorStateChange={handleBlogContentChange}
                        wrapperClassName="draft-wrapper"
                        editorClassName="draft-editor"
                        toolbarClassName="toolbar-class"
                        placeholder="Enter Blog Content Here"
                    />
                </Grid>

                {/* Author */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Author Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{ marginBottom: '20px', width: '100%' }}
                    />
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{ marginRight: '10px' }}
                    >
                        Submit
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: 'red',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#8b0000', // Dark red color on hover
                            },
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Container>
  )
}

export default ShareBlogEditCard