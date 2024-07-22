
// src/component/Navbar.jsx

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SearchIcon from '@mui/icons-material/Search';
import SignIn from '../userAuth/SignInUser';
import SignUp from '../userAuth/SignUpUser';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { resetState } from '../reduxstore/blogSlice';
import Home from './Home';
import DashBoard from './DashBoard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Technology from './Technology';
import Food from './Food'
import Lifestyle from './Lifestyle'
import Travel from './Travel'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../ThemeContext';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [signUpUser, setSignUpUser] = useState(false);
  const [signInUser, setSignInUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user login status
  const [showDashboard, setShowDashboard] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('selectedCategory') || '';
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'Home';
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentPage('Home');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const storedCurrentedButton = localStorage.getItem('currentPage');
    if (storedCurrentedButton) {
      setCurrentPage(storedCurrentedButton);
    }
  }, []);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseIconClick = () => {
    setIsSearchOpen(false);
    setSearchQuery(''); // Optionally clear search query on close
  };

  const handleSearch = () => {
    navigate(`/searchpage/${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
    handleClose();
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const userSignUp = () => {
    dispatch(resetState())
    setSignUpUser(true);
  };

  const userSignIn = () => {
    setSignInUser(true);
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.post('https://demo-blog-website-dwt4.onrender.com/api/v1/users/logout',

        null,
        {
          withCredentials: true
        });
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);

      setSnackbarOpen(true);
      setSnackbarMessage('Successfully logged out.');
      setSnackbarSeverity('success');

      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);


      // dispatch(resetState());
      navigate('/');

      localStorage.setItem('selectedButton', 'all');
      setTimeout(() => {
        setSnackbarOpen(false);
        window.location.reload();
      }, 5000);

    } catch (error) {
      setSnackbarMessage('Error logging out.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
    }
  };


  const handleSign = () => {
    setSignUpUser(false);
    setSignInUser(false);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedIn === 'true'); // Convert string to boolean
  }, []);

  const handleSignInSignUp = () => {
    userSignIn()
  }

  const handleSignUpSignIn = () => {
    userSignUp()
  }

  const toggleDashboard = () => {
    if (currentPage !== 'Dashboard') {
      setCurrentPage('Dashboard');
      setShowDashboard(!showDashboard);
      setSelectedCategory('');
    }
  };

  const handleHomeClick = () => {
    setCurrentPage('Home');
    setShowDashboard(false);
    setSelectedCategory('');
  };

  const handleCategorySelect = (category) => {
    setCurrentPage(category);
    setShowDashboard(false);
    setSelectedCategory(category);
    handleClose();
  };

  const { darkMode, toggleDarkMode } = useTheme();

  // drawer 
  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const [menuOpen, setMenuOpen] = useState(false)
  const handleClickMenu = () => {
    if (setMenuOpen === false) {
      toggleDrawer(true)
    }
  }

  //For logout
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  return (
    <>
      <AppBar sx={{
        padding: '5px 20px',
        '@media (max-width: 520px)': {
          padding: '10px 20px',
          height: 75
        },
      }}>
        <Toolbar sx={{
          display: { md: 'flex' }
        }}>
          <RssFeedIcon />
          <Typography variant="h5">Blog</Typography>

          <Button
            onClick={handleHomeClick}
            color="inherit"
            className={currentPage === 'Home' ? 'selectedButton' : ''}
            sx={{
              color: '#ffffff',
              ml: 5,
              borderBottom: currentPage === 'Home' ? (darkMode ? '2px solid white' : '2px solid black') : 'none',
              backgroundColor: currentPage === 'Home' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
              '&:hover': {
                backgroundColor: currentPage === 'Home' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'none',
              },
              '&:focus': {
                outline: 'none',
              },
              fontSize: '1rem',
              textTransform: 'none',
              transition: 'background-color 0.3s ease-in-out', // Smooth transition

              '@media (max-width: 1017px)': {
                display: 'none',
              },
            }}
          >
            Home
          </Button>

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              <Button
                className={currentPage === 'Dashboard' ? 'selectedButton' : ''}
                onClick={toggleDashboard}
                color="inherit"
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  borderBottom: currentPage === 'Dashboard' ? (darkMode ? '2px solid white' : '2px solid black') : 'none',
                  backgroundColor: currentPage === 'Dashboard' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',
                  transition: 'background-color 0.3s ease-in-out', // Smooth transition

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}

              >
                Dashboard
              </Button>

              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className={currentPage === selectedCategory ? 'selectedButton' : ''}
                sx={{
                  color: '#ffffff', // White text color
                  ml: 5, // Left margin of 5 units
                  borderBottom: currentPage === selectedCategory ? (darkMode ? '2px solid white' : '2px solid black') : 'none',
                  backgroundColor: currentPage === selectedCategory ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:focus': {
                    outline: 'none', // Remove outline on focus
                  },
                  fontSize: '1rem', // Font size 1rem
                  textTransform: 'none', // No text transformation
                  transition: 'background-color 0.3s ease-in-out', // Smooth background color transition

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}

              >
                {selectedCategory || 'Category'} {/* Display selected category or default text */}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => handleCategorySelect('Technology')}>
                  Technology
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Travel')}>
                  Travel
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Food')}>
                  Food
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Lifestyle')}>
                  Lifestyle
                </MenuItem>
              </Menu>

              {/* Search Bar */}
              {/* For small screen */}
              <Box sx={{ marginLeft: 'auto', paddingTop: 1, paddingBottom: 1 }}>
                <Box >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '@media (max-width: 520px)': {
                        ml: 3,
                      },
                      '@media (min-width: 520px)': {
                        display: 'none',
                      },
                    }}
                  >
                    {!isSearchOpen && (
                      <SearchIcon onClick={handleSearchIconClick} sx={{ cursor: 'pointer' }} />
                    )}
                    {isSearchOpen && (
                      <Box
                        sx={{
                          marginLeft: 'auto',
                          backgroundColor: '#ffffff',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            left: 10,
                            display: 'flex',
                            alignItems: 'center',
                            placeItems: 'center',
                            placeContent: 'center',
                            ml: 1
                          }}
                        >
                          <SearchIcon sx={{ color: 'gray' }} />
                        </Box>
                        <InputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                            }
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: 1,
                            ml: 1,
                            color: 'inherit',
                            paddingBottom: '5px',
                            '& .MuiInputBase-input': {
                              pr: '1rem',
                              color: '#000000',
                              fontSize: 18,
                              '@media (min-width: 520px)': {
                                ml: 3,
                                display: 'none',
                              },
                            },
                          }}
                        />

                      </Box>
                    )}
                    {isSearchOpen && (
                      <CancelIcon onClick={handleCloseIconClick} sx={{
                        ml: 1,
                        display: { xs: 'block', sm: 'none' }, // Show on mobile, hide on larger screens
                        color: 'black',
                        cursor: 'pointer',
                      }} />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* For large screen  */}
              <Box sx={{
                marginLeft: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                display: 'flex',
                paddingTop: '10px',
                paddingLeft: '5px',
                placeContent: 'center',
                '@media (max-width: 521px)': {
                  display: 'none'
                },
              }}>
                <Box style={{ left: 10, alignItems: 'center', placeItems: 'center', placeContent: 'center' }}>
                  <SearchIcon sx={{ color: 'gray' }} />
                </Box>
                <InputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  sx={{
                    ml: 1,
                    color: 'inherit',
                    paddingBottom: '5px',
                    '& .MuiInputBase-input': {
                      pr: '1rem',
                      color: '#000000',
                      fontSize: 18
                    },
                  }}
                />
              </Box>

              <IconButton
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },

                }}
                onClick={toggleDarkMode}
                color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>


              <Button
                color="inherit"
                onClick={handleSignOut}
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>

              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className={currentPage === selectedCategory ? 'selectedButton' : ''}
                sx={{
                  color: '#ffffff', // White text color
                  ml: 5, // Left margin of 5 units
                  borderBottom: currentPage === selectedCategory ? (darkMode ? '2px solid white' : '2px solid black') : 'none',
                  backgroundColor: currentPage === selectedCategory ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                  '&:hover': {
                    backgroundColor: currentPage === selectedCategory ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'none',
                  },
                  '&:focus': {
                    outline: 'none', // Remove outline on focus
                  },
                  fontSize: '1rem', // Font size 1rem
                  textTransform: 'none', // No text transformation
                  transition: 'background-color 0.3s ease-in-out', // Smooth background color transition

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}
              >
                {selectedCategory || 'Category'} {/* Display selected category or default text */}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => handleCategorySelect('Technology')}>
                  Technology
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Travel')}>
                  Travel
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Food')}>
                  Food
                </MenuItem>
                <MenuItem onClick={() => handleCategorySelect('Lifestyle')}>
                  Lifestyle
                </MenuItem>
              </Menu>


              {/* Search Bar */}
              {/* For Small Screen  */}
              <Box sx={{ marginLeft: 'auto', paddingTop: 1, paddingBottom: 1 }}>
                <Box >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '@media (max-width: 520px)': {
                        ml: 3,
                      },
                      '@media (min-width: 520px)': {
                        display: 'none',
                      },
                    }}
                  >
                    {!isSearchOpen && (
                      <SearchIcon onClick={handleSearchIconClick} sx={{ cursor: 'pointer' }} />
                    )}
                    {isSearchOpen && (
                      <Box
                        sx={{
                          marginLeft: 'auto',
                          backgroundColor: '#ffffff',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            left: 10,
                            display: 'flex',
                            alignItems: 'center',
                            placeItems: 'center',
                            placeContent: 'center',
                            ml: 1
                          }}
                        >
                          <SearchIcon sx={{ color: 'gray' }} />
                        </Box>
                        <InputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                            }
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: 1,
                            ml: 1,
                            color: 'inherit',
                            paddingBottom: '5px',
                            '& .MuiInputBase-input': {
                              pr: '1rem',
                              color: '#000000',
                              fontSize: 18,
                              '@media (min-width: 520px)': {
                                ml: 3,
                                display: 'none',
                              },
                            },
                          }}
                        />

                      </Box>
                    )}
                    {isSearchOpen && (
                      <CancelIcon onClick={handleCloseIconClick} sx={{
                        ml: 1,
                        display: { xs: 'block', sm: 'none' }, // Show on mobile, hide on larger screens
                        color: 'black',
                        cursor: 'pointer',
                      }} />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* For large Screen */}
              <Box sx={{
                marginLeft: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                display: 'flex',
                paddingTop: '10px',
                paddingLeft: '5px',
                placeContent: 'center',
                '@media (max-width: 521px)': {
                  display: 'none'
                },
              }}
              >
                <Box sx={{ left: 10, alignItems: 'center', placeItems: 'center', placeContent: 'center' }}>
                  <SearchIcon sx={{ color: 'gray' }} />
                </Box>
                <InputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  sx={{
                    ml: 1,
                    color: 'inherit',
                    paddingBottom: '5px',
                    '& .MuiInputBase-input': {
                      pr: '1rem',
                      color: '#000000',
                      fontSize: 18
                    },
                  }}
                />
              </Box>

              <IconButton
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',

                  '@media (max-width: 550px)': {
                    marginLeft: 1,
                    marginRight: 0,
                    paddingRight: 0
                  },

                }}
                onClick={toggleDarkMode}
                color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>


              <Button
                color="inherit"
                onClick={userSignUp}
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}

              >
                Sign Up
              </Button>

              <Button
                color="inherit"
                onClick={userSignIn}
                sx={{
                  color: '#ffffff',
                  ml: 5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',

                  '@media (max-width: 1017px)': {
                    display: 'none',
                  },
                }}
              >
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer  */}
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          marginTop: 10,
          marginLeft: 0,
          display: 'flex',
          '@media (min-width: 1017px)': {
            display: 'none',
          },
        }}
      >
        {/* Open drawer */}
        <MenuIcon />
      </Button>
      <Drawer
        onClose={toggleDrawer(false)}
        open={drawerOpen}
        sx={{
          '@media (min-width: 1017px)': {
            display: 'none',
          },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} >
          <List>
            <ListItemButton
              onClick={handleHomeClick}
              color="inherit"
              className={currentPage === 'Home' ? 'selectedButton' : ''}
              sx={{
                backgroundColor: currentPage === 'Home' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                '&:hover': {
                  backgroundColor: currentPage === 'Home' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'none',
                },
                '&:focus': {
                  outline: 'none',
                },
                fontSize: '1rem',
                textTransform: 'none',
                transition: 'background-color 0.3s ease-in-out', // Smooth transition
              }}
            >
              Home
            </ListItemButton>
            <Divider />
            {isLoggedIn ? (
              <>
                <Divider />

                <ListItemButton
                  className={currentPage === 'Dashboard' ? 'selectedButton' : ''}
                  onClick={toggleDashboard}
                  color="inherit"
                  sx={{
                    color: '#ffffff',
                    ml: 5,
                    backgroundColor: currentPage === 'Dashboard' ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    fontSize: '1rem',
                    textTransform: 'none',
                    transition: 'background-color 0.3s ease-in-out', // Smooth transition

                    '@media (max-width: 1017px)': {
                      display: 'none',
                    },
                  }}>
                  DashBoard
                </ListItemButton>

                <Divider />


                <ListItemButton
                  id="basic-button"
                  aria-controls={anchorEl ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    borderBottom: currentPage === selectedCategory ? (darkMode ? '2px solid white' : '2px solid black') : 'none',
                    backgroundColor: currentPage === selectedCategory ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:focus': {
                      outline: 'none', // Remove outline on focus
                    },
                    fontSize: '1rem', // Font size 1rem
                    textTransform: 'none', // No text transformation
                    transition: 'background-color 0.3s ease-in-out', // Smooth background color transition
                  }}
                >
                  Category
                  <ArrowDropDownIcon />
                </ListItemButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={open}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>Technology</MenuItem>
                  <MenuItem onClick={handleClose}>Travel</MenuItem>
                  <MenuItem onClick={handleClose}>Food</MenuItem>
                  <MenuItem onClick={handleClose}>Lifestyle</MenuItem>
                </Menu>

                <Divider />

                <ListItemButton
                  color="inherit"
                  onClick={handleSignOut}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  SignOut
                </ListItemButton>
                <Divider />
              </>
            ) : (
              <>
                <Divider />
                <ListItemButton
                  id="basic-button"
                  aria-controls={anchorEl ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent propagation to parent components
                    handleClick(event); // Handle the click event for opening the Menu
                  }}
                  className={currentPage === selectedCategory ? 'selectedButton' : ''}
                  sx={{
                    display: 'flex',
                    backgroundColor: currentPage === selectedCategory ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:focus': {
                      outline: 'none', // Remove outline on focus
                    },
                    fontSize: '1rem', // Font size 1rem
                    textTransform: 'none', // No text transformation
                    transition: 'background-color 0.3s ease-in-out', // Smooth background color transition
                  }}
                >
                  {/* Category */}
                  {selectedCategory || 'Category'}
                  <ArrowDropDownIcon />
                </ListItemButton>


                {menuOpen
                  && (
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      onClose={handleClickMenu}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={open}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => handleCategorySelect('Technology')}>Technology</MenuItem>
                      <MenuItem onClick={() => handleCategorySelect('Travel')}>Travel</MenuItem>
                      <MenuItem onClick={() => handleCategorySelect('Food')}>Food</MenuItem>
                      <MenuItem onClick={() => handleCategorySelect('Lifestyle')}>Lifestyle</MenuItem>
                    </Menu>
                  )}

                <Divider />

                <ListItemButton
                  color="inherit"
                  onClick={userSignUp}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  SignUp
                </ListItemButton>

                <Divider />

                <ListItemButton
                  color="inherit"
                  onClick={userSignIn}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}
                >
                  SignIn
                </ListItemButton>
                <Divider />
              </>
            )}
          </List>
        </Box>
      </Drawer>





      {/* Modal for SignUp */}
      <Modal
        open={signUpUser}
        onClose={handleClose}
      >
        <Box sx={{
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Paper sx={{ p: 4, maxHeight: '90vh', borderRadius: '8px', width: '70rem' }}>
            <SignUp
              onClose={handleSign}
              onCloseSignUpopenSignIn={handleSignInSignUp}
            />
          </Paper>
        </Box>
      </Modal>

      {/* //logout snackbar  */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>


      {/* Modal for SignIn */}
      <Modal
        open={signInUser}
        onClose={handleClose}
      >
        <Box sx={{
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Paper sx={{ p: 4, maxHeight: '90vh', borderRadius: '8px', width: '70rem' }}>
            <SignIn
              onSuccess={() => setIsLoggedIn(true)}
              onClose={handleSign}
              onCloseSignInopenSignUp={handleSignUpSignIn}
            />
          </Paper>
        </Box>
      </Modal>
      {isLoggedIn && currentPage === 'Dashboard' ? (
        <DashBoard isLoggedIn={isLoggedIn} />
      ) : currentPage === 'Home' ? (
        <Home isLoggedIn={isLoggedIn} />
      ) : selectedCategory === 'Technology' ? (
        <Technology />
      ) : selectedCategory === 'Travel' ? (
        <Travel />
      ) : selectedCategory === 'Food' ? (
        <Food />
      ) : selectedCategory === 'Lifestyle' ? (
        <Lifestyle />
      ) : null}

    </>
  );
}

export default Navbar;