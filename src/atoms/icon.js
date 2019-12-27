import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'material-ui-image';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {  // smartphone
      width: "80%",
      height: "80%",
    },
    [theme.breakpoints.up('md')]: {  // tablet
      width: "80%",
      height: "80%",
    },
    [theme.breakpoints.up('lg')]: {  // pc
      width: "15%",
      height: "15%",
    },
  },
}));

export default function ImageAvatars() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Image
        className={classes.image}
        src="https://avatars2.githubusercontent.com/u/17886370"
      />
    </div>
  );
}
