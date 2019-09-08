import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter } from "react-router-dom";
import './index.css';
import { ALLOW_ADD_KEY, getBooleanSettingKey } from "./utils/Utils";

//Containers
import App from './App';


window[ALLOW_ADD_KEY] = getBooleanSettingKey(ALLOW_ADD_KEY);



render(
    <HashRouter >
        <Route exact path="/*" render={(props) => <App {...props} />} />
    </HashRouter>,
    document.getElementsByClassName("AppHolder")[0]
);

