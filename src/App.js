import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Home from './pages/home.js';
import './App.css';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    minHeight: "90vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
