import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/Home.js';
import Profile from './components/Profile.js';
import Works from './components/Home.js';
import Skill from './components/Home.js';
import Links from './components/Home.js';
import Navigation from './components/Navigation.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';


const useStyles = makeStyles(theme => ({
 
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <Header />
      <Profile />
      <Footer></Footer>
    </div>
  );
}

export default App;
