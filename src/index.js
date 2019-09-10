import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter } from "react-router-dom";
import './index.css';
import { ALLOW_ADD_KEY, getBooleanSettingKey } from "./utils/Utils";

//Containers
import App from './App';

window.openWith = (intent) => {
        console.log('intent received');
      
        console.log('  action: ' + intent.action); // type of action requested by the user
        console.log('  exit: ' + intent.exit); // if true, you should exit the app after processing
      
        for (var i = 0; i < intent.items.length; ++i) {
          var item = intent.items[i];
          console.log('  type: ', item.type);   // mime type
          console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri
      
          // some optional additional info
          console.log('  text: ', item.text);   // text to share alongside the item, iOS only
          console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
          console.log('  utis: ', item.utis);
          console.log('  path: ', item.path);   // path on the device, generally undefined
        }
      
        // ...
        // Here, you probably want to do something useful with the data
        // ...
        // An example...
      
        if (intent.items.length > 0) {
          window.cordova.openwith.load(intent.items[0], function(data, item) {
      
            // data is a long base64 string with the content of the file
            console.log("the item weights " + data.length + " bytes");
            
            //do something...

            // "exit" when done.
            if (intent.exit) { window.cordova.openwith.exit(); }
          });
        }
        else {
          if (intent.exit) { window.cordova.openwith.exit(); }
        }
      
      

}


render(
    <HashRouter >
        <Route exact path="/*" render={(props) => <App {...props} />} />
    </HashRouter>,
    document.getElementsByClassName("AppHolder")[0]
);

