import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({

});

function Navigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  
  function handleChange(event, newValue) {
    setValue(newValue);
    
  }

  return (
    <div styles={classes.root}>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/profile">PROFILE</Button>
      <Button color="inherit" component={Link} to="/works">WORKS</Button>
      <Button color="inherit" component={Link} to="/skills">SKILLS</Button>
      <Button color="inherit" component={Link} to="/links">LINKS</Button>
    </div>
  );
}

export default Navigation;
