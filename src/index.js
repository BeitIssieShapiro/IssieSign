import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter } from "react-router-dom";
import './index.css';


//Containers
import App from './App';

window.openWith = async (url) => {
  console.log('Open with URL received:' + url);
  

  if (window.importWords) {
    window.importWords(url);
  } 
}


render(
  <HashRouter >
    <Route exact path="/*" render={(props) => <App {...props} />} />
  </HashRouter>,
  document.getElementsByClassName("AppHolder")[0]
);

