
// src/Blog/BlogCreateCard.jsx

import React, { useState } from 'react'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
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
    Select,
    Snackbar
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reduxstore/blogSlice'
import user_image from '../images/NoImage.png'
import axios from 'axios'
import '../Blog/style.css'

function BlogCreateCard({ onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImage, setShowImage] = useState(user_image);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState(EditorState.createEmpty());
    const [blogContent, setblogContent] = useState(EditorState.createEmpty());
    const maxCharacters = 300;
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('')
    const [errors, setErrors] = useState({
        topic: '',
        description: '',
        blogContent: '',
        author: '',
        category: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        
            setSelectedImage(file);
            setShowImage(URL.createObjectURL(file));
        
    };    


    const handleDescriptionChange = (newEditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText('');
        const totalCharacters = plainText.length;

        if (totalCharacters <= maxCharacters) {
            setDescription(newEditorState); // Update description state only if within limit
        } else {
            // alert(`Maximum character limit (${maxCharacters}) exceeded.`);
            setSnackbarMessage(`Maximum character limit (${maxCharacters}) exceeded.`);
            setSnackbarOpen(true);
        }
    };

    const handleBlogChange = (newEditorState) => {
        setblogContent(newEditorState);
    };

    const handleChange = (event) => {
        setCategory(event.target.value);
    };


    const dispatch = useDispatch();

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            topic: '',
            description: '',
            blogContent: '',
            author: '',
            category: ''
        };

        if (topic.trim() === '') {
            newErrors.topic = 'Topic is required';
            valid = false;
        }

        const descriptionPlainText = description.getCurrentContent().getPlainText('');
        if (descriptionPlainText.trim() === '') {
            newErrors.description = 'Description is required';
            valid = false;
        }

        const blogContentPlainText = blogContent.getCurrentContent().getPlainText('');
        if (blogContentPlainText.trim() === '') {
            newErrors.blogContent = 'Blog content is required';
            valid = false;
        }

        if (author.trim() === '') {
            newErrors.author = 'Author is required';
            valid = false;
        }

        if (category === '') {
            newErrors.category = 'Please select a category';
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            setSnackbarMessage('Please fill in all required fields.');
            setSnackbarOpen(true);
        }

        return valid;
    };


    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const descriptionPlainText = description.getCurrentContent().getPlainText('');
            const blogContentPlainText = blogContent.getCurrentContent().getPlainText('');
    
            const formData = new FormData();
            formData.append('description', descriptionPlainText);
            formData.append('topic', topic);
            formData.append('author', author);
            formData.append('blogContent', blogContentPlainText);
            formData.append('category', category);
    
            // Append selectedImage if it exists, otherwise append the default image
            if(selectedImage == null ){
                const blob = await fetch(user_image).then(res => res.blob());
                formData.append('cardImage', blob, 'default_image.png');

            }else{
                formData.append('cardImage', selectedImage);
            }
            
            
    
            const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/upload/createCard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });

            const { data } = response;

            if(selectedImage == null){
                dispatch(addBlog({
                    _id: data.data._id, // Use MongoDB _id here by help of this const { data } = response;
                    image: showImage,
                    topic: topic,
                    author: author,
                    category: category,
                    description: descriptionPlainText,
                    blogContent: blogContentPlainText,
                    newCard:true
                }));
            }else{
                const reader = new FileReader();
            reader.readAsDataURL(selectedImage);
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
    
                dispatch(addBlog({
                    _id: data._id, // Use MongoDB _id here by help of this const { data } = response;
                    image: imageDataUrl,
                    topic: topic,
                    author: author,
                    category: category,
                    description: descriptionPlainText,
                    blogContent: blogContentPlainText,
                    newCard:true
                }));
            };
            }
            
    
            onClose();
        } catch (error) {
            console.error('Error submitting blog:', error);
        }
    };
    



    const handleCancel = () => {
        onClose();


    };

    const charactersLeft = maxCharacters - description.getCurrentContent().getPlainText('').length;

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>

            {/* Image Preview */}
            <Box md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>

                <img src={showImage} style={{
                    width: '220px',
                    height: '220px',
                }} alt="Uploaded" />
            </Box>

            {/* Upload Image Button */}
            <Box md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <input
                        accept="image/*"
                        id="image-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload }
                    />
                    <label htmlFor="image-upload">
                        <Button
                            variant="contained"
                            component="span"
                            color="primary"
                            style={{ marginBottom: '20px', width: '100%', maxWidth: '220px' }}
                        >
                            Upload Image
                        </Button>
                    </label>
                </Box>
            </Box>

            <Grid item xs={12}>

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
                                <MenuItem value='Technology'>Technology</MenuItem>
                                <MenuItem value='Travel'>Travel</MenuItem>
                                <MenuItem value='Food'>Food</MenuItem>
                                <MenuItem value='Lifestyle'>Lifestyle</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Description Editor */}
                <Grid item xs={12}>
                    <Typography variant="body2" style={{ marginTop: '8px' }}>
                        Characters Left: {charactersLeft}
                    </Typography>
                    <Editor
                        editorState={description}
                        onEditorStateChange={handleDescriptionChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'list', 'textAlign', 'emoji', 'remove', 'history'],
                        }}
                        wrapperClassName="draft-wrapper"
                        editorClassName="draft-editor"
                        toolbarClassName="toolbar-class"
                        placeholder="Enter Description Here"
                    />
                </Grid>

                {/* Blog Editor */}
                <Grid item xs={12}>
                    <Editor
                        editorState={blogContent}
                        onEditorStateChange={handleBlogChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'remove', 'history'],
                        }}
                        wrapperClassName="draft-wrapper"
                        editorClassName="draft-editor"
                        toolbarClassName="toolbar-class"
                        placeholder="Enter Blog Here"
                    />
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid
                    item xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
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
                                backgroundColor: '#8b0000',
                            },
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                </Grid>

            </Grid>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default BlogCreateCard;
