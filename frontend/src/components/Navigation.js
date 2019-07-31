import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },

});

function Navigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  
  function handleChange(event, newValue) {
    setValue(newValue);
    
  }

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        textcolor="#E1BBCD"
      >
        <Tab label="Home" component={Link} to="/" />
        <Tab label="Profile" component={Link} to="/profile" />
        <Tab label="Works" component={Link} to="/works" />
        <Tab label="Skill" component={Link} to="/skill" />
        <Tab label="Links" component={Link} to="/links" />
      </Tabs>
    </Paper>
  );
}

export default Navigation;
