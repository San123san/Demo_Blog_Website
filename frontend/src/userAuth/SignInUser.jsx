// src/authuser/SignIn.jsx

import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignInUser({onSuccess, onClose, onCloseSignInopenSignUp}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: 'https://demo-blog-website-dwt4.onrender.com/api/v1', // Adjust the base URL as per your backend API
    withCredentials: true  // Ensures cookies (including accessToken) are sent
  });

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    try {
      const response = await axiosInstance.post('/users/login', { email, password });
      // const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/users/login', { email, password });
  
      if (response.status === 200) {
        // Assuming your backend responds with tokens in the response data
      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in localStorage or session storage for persistence
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

        console.log(response)
        setOpenSuccessDialog(true);
        localStorage.setItem('isLoggedIn', 'true'); // Update local storage
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error.response.data);
  
      if (error.response.status === 400 || error.response.status === 404) {
        alert('Check Your Credentials');
      }
    }
  };
  

  const handleSignUpClick = () => {
    // navigate('/SignUp'); // Navigate to SignUp page
    onClose()
    onCloseSignInopenSignUp()
  };

  const handleClose = () => {
    // Handle cancellation logic here
    // Example: Clear form fields or navigate away
    console.log('Sign In Cancelled');
    onClose();
};

const handleCloseSuccessDialog = () => {
  setOpenSuccessDialog(false);
  onClose();
};

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <Button onClick={handleSignUpClick} sx={{ fontWeight: 'bold' }}>
              Sign Up
            </Button>
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 , display:'flex', justifyContent: 'center'}}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>

        {/* Success Dialog */}
        <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
          <DialogTitle>Successful Sign In</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have successfully signed in.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}

export default SignInUser
