import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import Home from './components/Home.js';
import Profile from './components/Home.js';
import Works from './components/Home.js';
import Skill from './components/Home.js';
import Links from './components/Home.js';
import Footer from './components/Footer.js';


const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: "#2F4052",
    height: "90%",
    width: "90%",
    border: "2px solid #2F4052",
    borderRadius: "240px 15px 185px 15px / 15px 200px 15px 185px",
    boxShadow: "0px 0px 20px -5px #2f4052",
 //   margin: "5%",
 //   padding: "20%",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <Grid container justify="center" className={classes.box}>
        <BrowserRouter>
          <Route exact path='/' component={Home} />
          <Route path='/profile' component={Profile} />
          <Route path='/works' component={Works} />
          <Route path='/skill' component={Skill} />
          <Route path='/links' component={Links} />
        </BrowserRouter>
      </Grid>

      <Footer></Footer>
    </div>
  );
}

export default App;
