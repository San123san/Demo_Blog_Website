// src/Blog/BlogEditCard.jsx

import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    Typography,
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
import { updateBlog } from '../reduxstore/blogSlice';
import NoImage from '../images/NoImage.png';
import '../Blog/style.css';
import axios from 'axios';

function BlogEditCard({ blog, onClose }) {
    const dispatch = useDispatch();

    const [image, setImage] = useState(blog.image || `data:${blog.cardImage.contentType};base64,${blog.cardImage.data}`);
    const [selectedImage, setSelectedImage] = useState(null);
    const [topic, setTopic] = useState(blog.topic || '');
    const [description, setDescription] = useState(
        EditorState.createWithContent(ContentState.createFromText(blog.description || ''))
    );
    const [blogContent, setBlogContent] = useState(
        EditorState.createWithContent(ContentState.createFromText(blog.blogContent || ''))
    );
    const [category, setCategory] = useState(blog.category || '');
    const [author, setAuthor] = useState(blog.author || '')

    useEffect(() => {
        if (blog.image) setImage(blog.image);
        if (blog.topic) setTopic(blog.topic);
        if (blog.author) setAuthor(blog.author);
        if (blog.description)
            setDescription(EditorState.createWithContent(ContentState.createFromText(blog.description)));
        if (blog.blogContent)
            setBlogContent(EditorState.createWithContent(ContentState.createFromText(blog.blogContent)));
        if (blog.category) setCategory(blog.category);
    }, [blog]);

    const handleImageUpload = (event) => {
        // const reader = new FileReader();
        // const file = event.target.files[0];

        // reader.onloadend = () => {
        //     setImage(reader.result);
        // };

        // if (file) {
        //     reader.readAsDataURL(file);
        // }
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
        formData.append('author', author); // Ensure you have blog.author available in state
        formData.append('blogContent', blogContentText);
        formData.append('category', category);
        formData.append('cardImage', selectedImage); // Ensure 'image' is the updated image data

        try {
            // const response = await axios.post(`/api/v1/upload/cardEdit/${blog._id || blog.id}`, formData, {
            const response = await axios.post(`https://demo-blog-website-dwt4.onrender.com/api/v1/upload/cardEdit/${blog._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Blog updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating blog:', error);
            // Handle error state or feedback to the user
        }




        // Dispatch action to update blog in Redux store
        if (selectedImage) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedImage);
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
    
                dispatch(
                    updateBlog({
                        ...blog,
                        image: imageDataUrl,
                        topic,
                        description: description.getCurrentContent().getPlainText('\u0001'),
                        blogContent: blogContent.getCurrentContent().getPlainText('\u0001'),
                        category,
                        author
                    })
                );
            };
        } else {
            dispatch(
                updateBlog({
                    ...blog,
                    topic,
                    description: description.getCurrentContent().getPlainText('\u0001'),
                    blogContent: blogContent.getCurrentContent().getPlainText('\u0001'),
                    category,
                    author
                })
            );
        }
        // dispatch(
        //     updateBlog({
        //         ...blog,
        //         image,
        //         topic,
        //         description: descriptionText, // Store plain text instead of JSON stringified
        //         blogContent: blogContentText, // Store plain text instead of JSON stringified
        //         category,
        //         author
        //     })
        // );

        onClose();
    };


    const handleCancel = () => {
        // Handle cancellation logic here
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
                {/* <Grid item xs={12}>
                    <img
                        src={image}
                        style={{
                            width: '220px',
                            height: '220px',
                        }}
                        alt="Uploaded"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        style={{
                            marginBottom: '20px',
                            width: '220px',
                        }}
                    >
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </Button>
                </Grid> */}

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
    );
}

export default BlogEditCard;
