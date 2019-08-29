import React from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';

function Footer() {
  return (
  <Grid
    container
    direction="column"
    justify="center"
    alignItems="center"
  >  
    <Typography variant="body2" color="textSecondary" align="center">
        2019 @u_chi_ha_ra_
    </Typography>
  </Grid>
  );
}

export default Footer;
