import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/Home.js';
import Profile from './components/Profile.js';
import Works from './components/Home.js';
import Skill from './components/Home.js';
import Links from './components/Home.js';
import Navigation from './components/Navigation.js';
import Footer from './components/Footer.js';


const useStyles = makeStyles(theme => ({
 
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Route exact path='/' component={Home} />
        <Route path='/profile' component={Profile} />
        <Route path='/works' component={Works} />
        <Route path='/skills' component={Skill} />
        <Route path='/links' component={Links} />
      </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
