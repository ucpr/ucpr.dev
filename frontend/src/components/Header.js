import React from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';

export default function Header() {

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      >
      <Typography variant="h3">
        ucpr's portfolio
      </Typography>
    </Grid>
  );
}