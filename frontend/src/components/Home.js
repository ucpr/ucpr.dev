import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import Navigation from './Navigation.js';

const useStyles = makeStyles({
});

function Home() {
  return (
    <Grid item justify="center">
      <Navigation />
    </Grid>
  );
}

export default Home;
