//import "babel-polyfill";
import React from 'react';
import  ReactDOM  from "react-dom";
//import { Router, Route, hashHistory, IndexRoute } from "react-router";
import './index.css';

//Containers
import App from './App';
import Word from "./containers/Word";
import Body from "./containers/Body";
import Video from "./containers/Video";
import Search from "./containers/Search";
import Info from "./containers/Info";
import AddItem from "./components/add";



//import configureStore from "./store/ConfigureStore";
//import { Provider } from "react-redux"; //We"ll use the Redux Provider to make the store available to any components that we choose to connect to it.

//const store = configureStore();

// render(
//     <Provider store={store}>
//         <Router history={hashHistory}>
//             <Route path="/" component={App} router={this} >
//                 <IndexRoute component={Body}/>
//                 <Route path="/word/:wordId" component={Word}/>
//                 <Route path="/video/:videoName/:categoryId/:title" component={Video} />
//                 <Route path="/search/:searchStr" component={Search} />
//                 <Route path="/info" component={Info} />
//                 <Route path="/add-category" component={AddItem} />
//                 <Route path="/add-word/:categoryId" component={AddItem} />
//             </Route>
//         </Router>
//     </Provider>,
//     document.getElementsByClassName("AppHolder")[0]
// );

import { useRoutes } from "hookrouter";

class PubSub  {
    constructor() {
        this.rcb = undefined;
    }
    subscribe = (cb)=>{

        this.rcb = cb;
    }
    publish = (args)=>{
        if (this.rcb) {
            this.rcb(args);
        }
    }
}

const defaultApp = <App noBack="true"><Body/></App>;
const routes = {
    "/": ()=> defaultApp,
    "/word/:categoryId/:title": ({ categoryId, title }) => {
        let pubsub = new PubSub(); 
        return <App pubSub={pubsub}  title={decodeURIComponent(title)} child="word" allowOverflow="true" categoryId={categoryId}><Word pubSub={pubsub} categoryId={categoryId} /></App>
    },
    "/word-added/:categoryId/:title": ({ categoryId, title }) => {
        let pubsub = new PubSub(); 
        return <App pubSub={pubsub} noNavBtn="true" child="word" title={decodeURIComponent(title)} allowOverflow="true" categoryId={categoryId}><Word pubSub={pubsub} type="added" categoryId={categoryId} /></App>
    },
    "/video/:videoName/:categoryId/:title/:filePath": ({ categoryId, title, videoName, filePath }) => <App child="video" title={decodeURIComponent(title)} noNavBtn="true"> <Video categoryId={categoryId} videoName={videoName} filePath={filePath?decodeURIComponent(filePath):""}/></App>,
    "/search/:searchStr": ({ searchStr }) => <App allowOverflow="true"><Search searchStr={decodeURIComponent(searchStr)} /></App>,
    "/info": () => <App allowTouch="true" noNavBtn="true"><Info /></App>,
    "/add-category": () => <App noNavBtn="true"><AddItem  addWord={false} /></App>,
    "/add-word/:categoryId": ({ categoryId }) => <App><AddItem addWord="true" categoryId={categoryId} /></App>,

};

function MainApp() {
    const routeResult = useRoutes(routes);
    return (
        <div>
            {routeResult || defaultApp}
        </div>
    );
}

const rootElement = document.getElementsByClassName("AppHolder")[0]
ReactDOM.render(<MainApp />, rootElement);

