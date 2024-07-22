// src/authuser/SignUp.jsx

import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box, Grid, Modal, Backdrop, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function SignUpUser({ onClose, onCloseSignUpopenSignIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [signupSuccess, setSignupSuccess] = useState(false);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = { username: '', email: '', password: '' };

    if (!username) {
      errors = { ...errors, username: 'Please fill UserName' };
    }
    if (!isValidEmail(email)) {
      errors = { ...errors, email: 'Please enter a valid email address' };
    }
    if (!password) {
      errors = { ...errors, password: 'Please enter a password' };
    }

    setErrors(errors);

    if (username && isValidEmail(email) && password) {
      try {
        const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/users/register', {
          username,
          email,
          password
        },
          { withCredentials: true })
        setSignupSuccess(true);
      } catch (error) {
        // Parse the HTML response to extract the error message
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(error.response.data, 'text/html');
        const errorMessage = htmlDocument.querySelector('pre').textContent.trim();

        if (errorMessage.includes("User with username or email already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            username: 'Username Already Exist',
            email: 'Email Already Exist'
          })
        }
        if (errorMessage.includes("User with username already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            username: 'Username Already Exist',
          })
        }
        if (errorMessage.includes("User with email already exists") && error.response.status == 409) {
          setErrors({
            ...errors,
            email: 'Email Already Exist'
          })
        }
      }
    }
  }

  const handleModalClose = () => {
    setSignupSuccess(false); // Close the success modal
    onClose();
  };

  const handleSignInClick = () => {
    onClose()
    onCloseSignUpopenSignIn()
  };

  const handleClose = () => {
    onClose();


  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Sign Up
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Link href="#" onClick={handleSignInClick} sx={{ fontWeight: 'bold' }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
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
                error={!!errors.password}
                helperText={errors.password}
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
              Sign Up
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

        {/* Success Modal */}
        <Modal
          open={signupSuccess}
          onClose={handleModalClose}
          aria-labelledby="signup-success-modal"
          aria-describedby="signup-success-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={signupSuccess}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              maxWidth: '80%',
              minWidth: '300px',
              textAlign: 'center'
            }}>
              <Typography variant="h5" gutterBottom>
                Successfully Signed Up!
                Please Sign In
              </Typography>
              <Button variant="contained" color="primary" onClick={handleModalClose}>
                Close
              </Button>
            </Box>
          </Fade>
        </Modal>

      </Grid>
    </Grid>
  );
}

export default SignUpUser
