// frontend/src/authuser/SignIn.jsx

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
}
  from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignInUser({ onSuccess, onClose, onCloseSignInopenSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/users/login', { email, password }, { withCredentials: true });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setOpenSuccessDialog(true);
        localStorage.setItem('isLoggedIn', 'true'); 
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
    onClose()
    onCloseSignInopenSignUp()
  };

  const handleClose = () => {
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

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
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
