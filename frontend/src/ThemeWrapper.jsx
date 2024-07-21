// ThemeWrapper.jsx

import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline for global styles

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function ThemeWrapper({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Check for stored darkMode preference in localStorage on component mount
  useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);
  

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Apply global CSS reset and normalize */}
      {children}
    </ThemeProvider>
  );
}

export default ThemeWrapper;
