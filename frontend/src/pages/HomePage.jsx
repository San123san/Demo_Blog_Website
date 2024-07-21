// src/pages/HomePage.jsx

import React from 'react'
import Navbar from '../components/Navbar'
import Home from '../components/Home'
import { Grid } from '@mui/material'

function HomePage() {
  return (
    <>
      {/* <Navbar maxWidth="lg" style={{ paddingTop: '20px' }}/>
    <Home /> */}

      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Navbar maxWidth="lg" style={{ paddingTop: '20px' }} />
        </Grid>
        {/* <Grid item xs={12}>
          <Home />
        </Grid> */}
      </Grid>
    </>
  )
}

export default HomePage