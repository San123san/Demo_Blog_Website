// src/reduxstore/blogSlice.js

import { createSlice } from '@reduxjs/toolkit';

// let nextId = 1; // Initialize a counter for generating unique ids

const initialState = {
    blogs: [], // Initialize with your initial blog data
    transferDisplay: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        // addBlog(state, action) {
        //     // Increment the id counter and assign it to the new blog
        //     const newBlog = { ...action.payload, id: nextId++ };
        //     state.blogs.push(newBlog);
        // },
        // updateBlog(state, action) {
        //     const { id, image, topic, description, blogContent, category, author } = action.payload;
        //     const existingBlog = state.blogs.find(blog => blog.id === id);
        //     if (existingBlog) {
        //         existingBlog.image = image;
        //         existingBlog.topic = topic;
        //         existingBlog.description = description;
        //         existingBlog.blogContent = blogContent;
        //         existingBlog.category = category;
        //         existingBlog.author = author;
        //     }
        // },
        setBlogs(state, action) {
            state.blogs = action.payload;
        },
        addBlog(state, action) {
            // state.blogs.push(action.payload);
            state.blogs.unshift({
                ...action.payload,
                newCard: true
            });
            // state.blogs.unshift(action.payload);
        },
        updateBlog(state, action) {
            const updatedBlog = action.payload;
            state.blogs = state.blogs.map((blog) =>
                blog._id === updatedBlog._id ? { ...blog, ...updatedBlog } : blog
            );
            // const index = state.blogs.findIndex(blog => blog._id === updatedBlog._id);
            // if (index !== -1) {
            //     state.blogs[index] = { ...state.blogs[index], ...updatedBlog }; // Update existing blog
            // }
        },
        setTransferDisplay(state, action) {
            state.transferDisplay = action.payload
        },
        deleteBlog(state, action) {
            const { _id } = action.payload;
            state.blogs = state.blogs.filter(blog => blog._id !== _id);
        },
        resetState: (state) => {
            // Reset each state property to its initial value
            Object.assign(state, initialState);
        },

    },
});

export const { setBlogs, addBlog, updateBlog, setTransferDisplay, deleteBlog, resetState } = blogSlice.actions;

export default blogSlice.reducer;
