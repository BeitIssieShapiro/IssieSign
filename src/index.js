import React from 'react';
import './index.css';
import ReactDom from 'react-dom/client';


import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './IssieAlert.js'


//Containers
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Route, Routes, useLocation, useNavigate } from "react-router";

window.openWith = async (url) => {
  console.log('Open with URL received:' + url);


  if (window.importWords) {
    window.importWords(url);
  } else {
    console.log("importWords is not ready", url);
    window.awaitingImport = url;
  }
}

const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 7000,
  offset: '20px',
  // you can also just use 'scale'
  transition: transitions.SCALE,

}

const container = document.getElementsByClassName("AppHolder")[0];
const root = ReactDom.createRoot(container);
root.render(
  <BrowserRouter>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <MyApp />
    </AlertProvider>
  </BrowserRouter>
);

function MyApp() {
  let location = useLocation();
  let navigate = useNavigate();

  const history = {
    path: location.hash.startsWith("#") ? location.hash.substr(1) : location.hash,
    push: (url) => {
      navigate(location.pathname + "#" + url)
    },
    goBack: () => navigate(-1)
  }
  return <App history={history} />
}



