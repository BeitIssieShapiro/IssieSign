import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter } from "react-router-dom";
import './index.css';

import {receiveIncomingZip} from './apis/file'

//Containers
import App from './App';

window.openWith = async (url) => {
  console.log('Open with URL received:' + url);
  let data = await receiveIncomingZip(url)

  if (window.refreshApp) {
    setTimeout(()=>
    window.refreshApp(data), 2500);
  } 
}


render(
  <HashRouter >
    <Route exact path="/*" render={(props) => <App {...props} />} />
  </HashRouter>,
  document.getElementsByClassName("AppHolder")[0]
);

