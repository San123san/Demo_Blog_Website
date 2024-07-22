// src/pages/HomePage.jsx

import React from 'react'
import Navbar from '../components/Navbar'
import { Grid } from '@mui/material'

function HomePage() {
  return (
    <>

      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Navbar maxWidth="lg" style={{ paddingTop: '20px' }} />
        </Grid>
      </Grid>
    </>
  )
}

export default HomePage