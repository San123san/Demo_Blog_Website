// src/reduxstore/blogSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blogs: [], 
    transferDisplay: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setBlogs(state, action) {
            state.blogs = action.payload;
        },
        addBlog(state, action) {
            // state.blogs.push(action.payload);
            state.blogs.unshift({
                ...action.payload,
                newCard: true
            });
        },
        updateBlog(state, action) {
            const updatedBlog = action.payload;
            state.blogs = state.blogs.map((blog) =>
                blog._id === updatedBlog._id ? { ...blog, ...updatedBlog } : blog
            );
        },
        setTransferDisplay(state, action) {
            state.transferDisplay = action.payload
        },
        deleteBlog(state, action) {
            const { _id } = action.payload;
            state.blogs = state.blogs.filter(blog => blog._id !== _id);
        },
        resetState: (state) => {
            Object.assign(state, initialState);
        },

    },
});

export const { setBlogs, addBlog, updateBlog, setTransferDisplay, deleteBlog, resetState } = blogSlice.actions;

export default blogSlice.reducer;
