import './css/App.css';
import { imageLocalCall } from "./apis/ImageLocalCall";

import React from 'react';
import Word from "./containers/Word";
import Body from "./containers/Body";
import Video from "./containers/Video";
import Search, { getAllCategories, getAllWords } from "./containers/Search";
import Info from "./containers/Info";
import AddItem from "./components/add";

import { Route, Switch } from "react-router";


import './css/App.css';
import './css/style.css';

import {
    scrollLeft, scrollRight,
    saveWordTranslateX, saveRootTranslateX, setTranslateX,
    getTheme,
    ALLOW_SWIPE_KEY, ALLOW_ADD_KEY, saveSettingKey, getBooleanSettingKey
} from "./utils/Utils";
import Shell from "./containers/Shell";
import IssieBase from './IssieBase';
import { MenuButton, Menu, MenuItem } from './settings'
import './css/settings.css'


const SEARCH_PATH = "/search/";

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

class App extends IssieBase {
    constructor(props) {
        super(props);
        console.log("allow swipe: " + getBooleanSettingKey(ALLOW_SWIPE_KEY, false));

        this.getEvents = this.getEvents.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.goBack = this.goBack.bind(this);
        this.savePos = this.savePos.bind(this);
        this.ScrollLeft = this.ScrollLeft.bind(this);
        this.ScrollRight = this.ScrollRight.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    componentDidMount() {
        let pubsub = new PubSub()
        this.setState({
            allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false),
            allowAddWord: getBooleanSettingKey(ALLOW_ADD_KEY, false),
            pubsub: pubsub
        });
        pubsub.subscribe((args) => this.getEvents(args));

    }
    componentDidUpdate() {
        if (this.state.pubSub) {
            this.state.pubSub.subscribe((args) => this.getEvents(args));
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.pubSub) {
            return {
                theme: props.history.location.pathname === "/" ? "blue" : state.theme,
                title: props.history.location.pathname === "/" ? "שפת הסימנים" : state.title,
                pubsub: state.pubsub ? state.pubsub : new PubSub()
            };
        }

        // Return null if the state hasn't changed
        return null;
    }
    getEvents(args) {
        switch (args.command) {
            case 'show-delete':
                this.setState({ showDelete: args.callback });
                break;
            case 'hide-all-buttons':
                this.setState({ showDelete: undefined })
                break;
            case 'set-categoryId':
                console.log("rec: set-cat" + getTheme(args.categoryId))
                if (args.categoryId !== this.state.categoryId) {
                    this.setState({ theme: getTheme(args.categoryId), categoryId: args.categoryId })
                }
                break;
            case 'set-title':
                if (args.title !== this.state.title) {
                    this.setState({ title: args.title })
                }
                break;

            default:
        }
    }

    handleSearch(e) {
        e.persist()
        this.setState({ searchStr: e.target.value }, () => {
            if (e.target.value.length > 1 && !this.isSearch()) {
                this.props.history.push(SEARCH_PATH);
                saveRootTranslateX(0);
                console.log("Search: " + e.target.value);
            } else if (e.target.value.length < 2) {
                if (this.isSearch()) {
                    this.goBack(true);
                }
            }
        });

    }

    handleMenuClick() {
        let newState = !this.state.menuOpen
        this.setState({ menuOpen: newState });
    }

    closeSettings() {
        this.setState({ menuOpen: false });
    }

    goBack(skipSearch) {
        if (this.isWords()) {
            //reset words position
            saveWordTranslateX(0);
        }
        if (skipSearch === undefined && this.isSearch()) {
            this.props.history.goBack();
            setTimeout(() => this.setState({ searchStr: "" }), 100);
        } else {
            this.props.history.goBack();
        }
        this.setState({ showDelete: undefined });
    }
    savePos(newVal) {
        if (this.isWords()) {
            saveWordTranslateX(newVal);
        } else {
            saveRootTranslateX(newVal);
        }
    }
    ScrollLeft() {
        this.savePos(scrollLeft());
    }

    ScrollRight() {
        this.savePos(scrollRight());
    }

    showInfo() {
        this.setState({ menuOpen: false });
        this.props.history.push('/info');
    }

    allowSwipe(allow) {
        saveSettingKey(ALLOW_SWIPE_KEY, allow);
        this.setState({ allowSwipe: allow });
        setTranslateX(0);
    }

    allowAddWord(allow) {
        saveSettingKey(ALLOW_ADD_KEY, allow);
        this.setState({ allowAddWord: allow });
        window[ALLOW_ADD_KEY] = allow
    }

    render() {
        console.log("Theme: " + this.state.theme);
        let leftArrow = "";
        let rightArrow = "";

        let backElement = <div slot="end-bar" style={{ height: 50 }}><button className="roundbutton backBtn"
            onClick={() => this.goBack()} style={{ float: "right", visibility: (!this.isHome() ? "visible" : "hidden"), "--radius": "50px" }}><div className="zmdi zmdi-arrow-right" /></button></div>
        let searchInput = "";

        let deleteButton = this.state.showDelete ? <div slot="start-bar" style={{ height: 50 }}><button className="roundbutton backBtn"
            onClick={this.state.showDelete} style={{ "--radius": "50px" }}><div className="zmdi zmdi-delete" /></button></div> : null
        console.log("delete button: " + this.state.showDelete)
        document.preventTouch = true;

        if (!this.isInfo() && !this.isVideo()) {
            let narrow = IssieBase.isMobile() && !IssieBase.isLandscape();
            let searchClassName = narrow ? "" : "sameLine";
            searchInput = (
                <div slot={narrow ? "title" : "end-bar"} className={"search " + searchClassName} >
                    <input style={{ direction: "RTL", paddingRight: '5px' }} type="search" onChange={this.handleSearch}
                        onFocus={this.preventKeyBoardScrollApp} value={this.state.searchStr || ""} />
                </div>)
        }

        if (IssieBase.isMobile() || this.isInfo() || this.state.allowSwipe) {
            document.preventTouch = false;
        }

        if (!IssieBase.isMobile() &&
            (!this.isAddScreen() && !this.isVideo() && !this.isInfo())
            && !this.state.allowSwipe) {
            leftArrow = <button slot="next" onClick={this.ScrollRight} id="scrolRight" className="navBtn"><img src={imageLocalCall("arrow-right.svg")} alt="arrow" /></button>
            rightArrow = <button slot="prev" onClick={this.ScrollLeft} id="scrollLeft" className="navBtn"><img src={imageLocalCall("arrow-left.svg")} alt="arrow" /></button>
        }

        if (IssieBase.isMobile() && IssieBase.isLandscape() && this.isVideo()) {
            return (
                <div>
                    <div style={{ height: 50, zIndex: 0 }}>
                        {backElement}
                    </div>
                    {this.props.children}
                </div>)
        }

        let overFlowX = this.state.dimensions.overFlowX;
        if (this.isSearch() || this.isWords()) {
            overFlowX = 'visible';
        }
        return (
            <div className="App">

                <Shell theme={this.state.theme} id="page1" >

                    <MenuButton slot="start-bar" open={this.state.menuOpen} onClick={() => this.handleMenuClick()} color='white' />
                    <div slot="title" style={{ display: "inline-block" }}>{this.state.title}</div>
                    {searchInput}
                    {leftArrow}
                    {rightArrow}
                    {backElement}
                    {deleteButton}
                    {this.state.allowAddWord ? <div /> : null}
                    <Menu id="SettingWindow" slot="body" open={this.state.menuOpen} closeSettings={() => this.closeSettings()}>
                        <MenuItem
                            delay={`${0.1}s`}
                            onClick={() => { this.showInfo(); }}>About Us - עלינו</MenuItem>
                        {
                            <div id="toggles">
                                {
                                    IssieBase.isMobile() ? null : (<div>
                                        <input type="checkbox" name="allowSwipeCB" id="allowSwipeCB" className="ios-toggle" checked={this.state.allowSwipe}
                                            onChange={(e) => this.allowSwipe(e.target.checked)} />
                                        <label for="allowSwipeCB" className="checkbox-label" data-off="החלקה כבויה" data-on="החלקה דולקת"></label>
                                    </div>)
                                }
                                <input type="checkbox" name="allowAddWordsCB" id="allowAddWordsCB" className="ios-toggle" checked={this.state.allowAddWord}
                                    onChange={(e) => this.allowAddWord(e.target.checked)} />
                                <label for="allowAddWordsCB" className="checkbox-label" data-off="הוספה כבויה" data-on="הוספה דולקת"></label>
                            </div>
                        }
                    </Menu>
                    <div slot="body" className="theBody" style={{
                        paddingLeft: this.shellPadding,
                        paddingRight: this.shellPadding,
                        overflowX: overFlowX
                    }}>
                        {this.getChildren()}
                    </div>
                </Shell>

            </div >
        );
        //        }} />
    }

    getChildren() {
        return (
            <Switch>
                <Route exact path="/" render={(props) => (
                    <Body
                        allowAddWord={this.state.allowAddWord}
                        isLandscape={IssieBase.isLandscape()}
                        isMobile={IssieBase.isMobile()}
                    />
                )} />

                <Route
                    path={SEARCH_PATH}
                    render={(props) => (
                        <Search
                            words={getAllWords()}
                            categories={getAllCategories()}
                            isMobile={IssieBase.isMobile()}
                            searchStr={this.state.searchStr}
                        />
                    )
                    } />

                <Route
                    path="/word/:categoryId/:title"
                    render={(props) => {
                        this.setTitle(props.match.params.title);

                        return (
                            <Word
                                pubSub={this.state.pubsub}
                                isMobile={IssieBase.isMobile()}
                                allowAddWord={this.state.allowAddWord}
                                categoryId={props.match.params.categoryId}
                            />)
                    }
                    } />
                <Route
                    path="/word-added/:categoryId/:title"
                    render={(props) => {
                        this.setTitle(props.match.params.title);
                        return (
                            <Word
                                pubSub={this.state.pubsub}
                                isMobile={IssieBase.isMobile()}
                                allowAddWord={this.state.allowAddWord}
                                type="added"
                                categoryId={props.match.params.categoryId}
                            />
                        )
                    }
                    } />
                <Route
                    path="/video/:videoName/:categoryId/:title/:filePath"
                    render={(props) => (
                        <Video {...props}
                            categoryId={props.match.params.categoryId}
                            isLandscape={IssieBase.isLandscape()}
                            isMobile={IssieBase.isMobile()}
                            videoName={props.match.params.videoName}
                            filePath={props.match.params.filePath ? props.match.params.filePath : ""}
                        />)
                    }
                />

                <Route
                    path="/info"
                    render={(props) => {
                        this.setTitle("עלינו")
                        return (
                            <Info />
                        )
                    }
                    } />
                <Route
                    path="/add-category"
                    render={(props) => (
                        <AddItem
                            history={props.history}
                            addWord={false} />
                    )
                    } />
                <Route
                    path="/add-word/:categoryId"
                    render={(props) => (
                        <AddItem
                            addWord="true"
                            history={props.history}
                            categoryId={props.match.params.categoryId}
                        />
                    )
                    } />
            </Switch>);
    }

    setTitle(title) {
        this.state.pubsub.publish({ command: "set-title", title })
    }

    isSearch() {
        return this.props.history.location.pathname.startsWith(SEARCH_PATH);
    }

    isWords() {
        return this.props.history.location.pathname.startsWith("/word");
    }

    isWordsAdded() {
        return this.props.history.location.pathname.startsWith("/word-added/");
    }

    isAddScreen() {
        return this.props.history.location.pathname.startsWith("/add-");
    }

    isVideo() {
        return this.props.history.location.pathname.startsWith("/video/");
    }

    isInfo() {
        return this.props.history.location.pathname.startsWith("/info");
    }

    isHome() {
        return this.props.history.location.pathname === "/";
    }

    getSearchStr() {
        if (this.props.history.location.pathname.startsWith(SEARCH_PATH)) {
            return this.props.history.location.pathname.substr(SEARCH_PATH.length);
        }
        return this.state.searchStr || "";
    }
}

export default App;