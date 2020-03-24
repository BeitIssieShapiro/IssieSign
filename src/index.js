import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter } from "react-router-dom";
import './index.css';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './IssieAlert.js'


//Containers
import App from './App';

window.openWith = async (url) => {
  console.log('Open with URL received:' + url);


  if (window.importWords) {
    window.importWords(url);
  }
}

const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: '20px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
  
}



render(
  <HashRouter >
    <Route exact path="/*" render={
      (props) => (
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App {...props} />
        </AlertProvider>
      )
    } />
  </HashRouter>,
  document.getElementsByClassName("AppHolder")[0]
);

