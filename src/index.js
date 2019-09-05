import React from 'react';
import { render } from "react-dom";
import { Route } from "react-router";
import { HashRouter, Link } from "react-router-dom";
import './index.css';
import {  ALLOW_ADD_KEY, getBooleanSettingKey} from "./utils/Utils";

//Containers
import App from './App';
import Word from "./containers/Word";
import Body from "./containers/Body";
import Video from "./containers/Video";
import Search from "./containers/Search";
import Info from "./containers/Info";
import AddItem from "./components/add";
class PubSub {
    constructor() {
        this.rcb = undefined;
    }
    subscribe = (cb) => {

        this.rcb = cb;
    }
    publish = (args) => {
        if (this.rcb) {
            this.rcb(args);
        }
    }
}


let pubsub = new PubSub();
window[ALLOW_ADD_KEY] = getBooleanSettingKey(ALLOW_ADD_KEY);
//let history = createHistory({basename:"/#", hashType:'noslash'});

//<App {...props} pubSub={pubsub}  title={decodeURIComponent(props.match.params.title)} child="word" allowOverflow="true" categoryId={props.match.params.categoryId}>
// App 
//                             child="video" 
//                             title={decodeURIComponent(props.match.params.title)} 
//                             noNavBtn="true">

//<Test {...props} theLink={"/word/1/hello"}></Test> } /> 
function Test(props) {
    return <div><Link to={props.theLink || ""}>{JSON.stringify(props)}</Link><br /><br />
        <div onClick={() => {
            //alert("1")
            props.history.goBack()
        }}>Back</div>
    </div>
}


render(
    <HashRouter >

        <Route exact path="/" render={(props) => (
            <App {...props} 
                pubSub={pubsub}
            >
                <Body allowAddWord={window[ALLOW_ADD_KEY]}/>
            </App>)} />
        <Route
            path="/word/:categoryId/:title"
            render={(props) => (
                <App {...props}
                    pubSub={pubsub} 
                    child="word"
                    title={props.match.params.title} 
                    allowOverflow="true"
                    categoryId={props.match.params.categoryId}
                >
                    <Word
                        pubSub={pubsub}
                        allowAddWord={window[ALLOW_ADD_KEY]}
                        categoryId={props.match.params.categoryId}
                    />
                </App>)
            } />
            <Route
            path="/word-added/:categoryId/:title"
            render={(props) => (
                <App {...props}
                    pubSub={pubsub} 
                    noNavBtn="true"
                    child="word"
                    title={props.match.params.title} 
                    allowOverflow="true"
                    categoryId={"1"}
                >
                    <Word
                        pubSub={pubsub}
                        allowAddWord={window[ALLOW_ADD_KEY]}
                        type="added"
                        categoryId={props.match.params.categoryId}
                    />
                </App>)
            } />
        <Route
            path="/video/:videoName/:categoryId/:title/:filePath"
            render={(props) => (
                <App {...props} 
                    pubSub={pubsub}
                    child="video"
                    title={props.match.params.title}
                    noNavBtn="true">
                    <Video {...props}
                        categoryId={props.match.params.categoryId}
                        videoName={props.match.params.videoName}
                        filePath={props.match.params.filePath ? props.match.params.filePath : ""}
                    />
                </App>)
            }
        />
        <Route 
            path="/search/:searchStr"
            render={(props) => (
                <App {...props} 
                    searchStr={props.match.params.searchStr}
                    allowOverflow="true">
                    <Search searchStr={props.match.params.searchStr} 
                />
                </App>)
            }/>
        <Route 
            path="/info" 
            render={(props) => (
            <App {...props} 
                allowTouch="true" 
                noNavBtn="true">
                    <Info />
            </App>)
        }/>
        <Route 
            path="/add-category" 
            render={(props) => (
                <App {...props}
                    
                    noNavBtn="true"
                >
                    <AddItem 
                    history={props.history}
                    addWord={false} />
                </App>)
            } />
        <Route 
            path="/add-word/:categoryId" 
            render={(props) => (
                <App {...props} >
                    <AddItem 
                        addWord="true" 
                        history={props.history}
                        categoryId={props.match.params.categoryId} 
                    />
                </App>)
            }/>
    </HashRouter>,
    document.getElementsByClassName("AppHolder")[0]
);


// const defaultApp = <App noBack="true"><Body/></App>;
// setBasepath("/#");
// setUseHash(true);
// const routes = {
//     "/word/:categoryId/:title": ({ categoryId, title }) => {
//         let pubsub = new PubSub(); 
//         return <App pubSub={pubsub}  title={decodeURIComponent(title)} child="word" allowOverflow="true" categoryId={categoryId}><Word pubSub={pubsub} categoryId={categoryId} /></App>
//     },
//     "/word-added/:categoryId/:title": ({ categoryId, title }) => {
//         let pubsub = new PubSub(); 
//         return <App pubSub={pubsub} noNavBtn="true" child="word" title={decodeURIComponent(title)} allowOverflow="true" categoryId={decodeURIComponent(categoryId)}><Word pubSub={pubsub} type="added" categoryId={categoryId} /></App>
//     },
//     "/video/:videoName/:categoryId/:title/:filePath": ({ categoryId, title, videoName, filePath }) => <App child="video" title={decodeURIComponent(title)} noNavBtn="true"> <Video categoryId={categoryId} videoName={videoName} filePath={filePath?decodeURIComponent(filePath):""}/></App>,
//     "/search/:searchStr": ({ searchStr }) => <App allowOverflow="true"><Search searchStr={decodeURIComponent(searchStr)} /></App>,
//     "/info": () => <App allowTouch="true" noNavBtn="true"><Info /></App>,
//     "/add-category": () => <App noNavBtn="true"><AddItem  addWord={false} /></App>,
//     "/add-word/:categoryId": ({ categoryId }) => <App><AddItem addWord="true" categoryId={decodeURIComponent(categoryId)} /></App>,
//     "/": () => defaultApp,
// };
