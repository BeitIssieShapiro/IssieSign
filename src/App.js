import React from 'react';

import './css/App.css';
import './css/style.css';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { jsonLocalCall } from "./apis/JsonLocalCall";

import { browserHistory } from "react-router";
import SearchInput from "./components/SearchInput";

import {
    scrollLeft, scrollRight,
    saveWordTranslateX, saveRootTranslateX, setTranslateX,
    getTheme, VideoToggle,
    ALLOW_SWIPE_KEY, saveSettingKey, getBooleanSettingKey
} from "./utils/Utils";
import Shell from "./containers/Shell";
import IssieBase from './IssieBase';
import { MenuButton, Menu, MenuItem } from './settings'
import './css/settings.css'

class App extends IssieBase {
    constructor(props) {
        super(props);
        console.log("allow swipe: " + getBooleanSettingKey(ALLOW_SWIPE_KEY, false));
        this.state = { searchString: "", allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false) };
        this.handleSearch = this.handleSearch.bind(this);
        this.goBack = this.goBack.bind(this);
        this.savePos = this.savePos.bind(this);
        this.ScrollLeft = this.ScrollLeft.bind(this);
        this.ScrollRight = this.ScrollRight.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    handleSearch(e) {
        if (e.target.value.length > 1) {
            this.props.router.push('/search/' + e.target.value);
            console.log("Search: " + e.target.value);
        } else if (this.props.location.pathname.startsWith("/search")) {
            //go back to category
            this.props.router.push('/');
        }

        this.setState({ searchString: e.target.value })
    }

    handleMenuClick() {
        let newState = !this.state.menuOpen
        // if (newState) {
        //     document.closeSettings = this.closeSettings;
        // } else {
        //     document.closeSettings = undefined;
        // }
        this.setState({ menuOpen: newState });

        // e.nativeEvent.stopImmediatePropagation()
    }

    closeSettings() {
        this.setState({ menuOpen: false });
        //document.closeSettings = undefined;
    }

    goBack() {
        let path = this.props.location.pathname;
        if (path.startsWith('/word')) {
            //reset words position
            saveWordTranslateX(0);
        }
        browserHistory.goBack();
    }
    savePos(newVal) {
        let path = this.props.location.pathname;
        if (path.startsWith('/word')) {
            saveWordTranslateX(newVal);
        } else if (path === '/') {
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
        this.props.router.push('/info');
    }

    allowSwipe(allow) {
        saveSettingKey(ALLOW_SWIPE_KEY, allow);
        this.setState({ allowSwipe: allow });
        setTranslateX(0);
    }

    render() {
        let categoryTheme = "blue";
        let title = "שפת הסימנים";
        let mainJson = jsonLocalCall("main");
        let path = this.props.location.pathname;
        let leftArrow = "";
        let rightArrow = "";

        let backElement = <div slot="end-bar" style={{ height: 50 }}><button className="roundbutton navBtn"
            onClick={this.goBack} style={{ float: "right", visibility: (path !== "/" ? "visible" : "hidden"), "--radius": "50px" }}><div className="zmdi zmdi-arrow-right" /></button></div>
        let searchInput = "";

        if (path.startsWith("/word")) {
            let categoryId = this.props.params.wordId;
            categoryTheme = getTheme(categoryId);
            title = mainJson.categories[categoryId - 1].name;
        }

        if (path.startsWith("/video")) {
            let categoryId = this.props.params.categoryId;
            categoryTheme = getTheme(categoryId);
            title = this.props.params.title;

            VideoToggle(true, !this.isMobile());
        } else {
            VideoToggle(false);
        }

        if (path.startsWith("/word")) {
            let categoryId = this.props.params.wordId;
            categoryTheme = getTheme(categoryId);
            title = mainJson.categories[categoryId - 1].name;
        }
        document.preventTouch = true;

        if (!path.startsWith("/info")) {
            let searchVal = this.state.searchString;

            if (!searchVal) {
                if (this.props.router.params.SearchInput) {
                    searchVal = this.props.router.params.SearchInput
                } else {
                    searchVal = ""
                }
            }
            if (searchVal.length > 1 && !path.startsWith("/search")) {
                searchVal = "";
            }
            searchInput = <SearchInput value={searchVal} theme={categoryTheme} slot={this.state.narrow ? "title" : "end-bar"} onChange={this.handleSearch} ref="searchInput" style={{ display: "inline-block" }} />
        }

        if (this.isMobile() || path.startsWith("/info") || this.state.allowSwipe) {
            document.preventTouch = false;
        }

        if (!this.isMobile() && !path.startsWith("/video") && !path.startsWith("/info") && !this.state.allowSwipe) {
            leftArrow = <a slot="next" onClick={this.ScrollRight} id="scrolRight" className="navBtn"><img src="assets/arrow-right.svg" alt="arrow" /></a>
            rightArrow = <a slot="prev" onClick={this.ScrollLeft} id="scrollLeft" className="navBtn"><img src="assets/arrow-left.svg" alt="arrow" /></a>
        }

        if (this.isMobile() && this.isLandscape() && path.startsWith("/video")) {
            return (
                <div>
                    <div style={{ height: 50 }}>
                        {backElement}
                    </div>
                    {this.props.children}
                </div>)
        }

        let overFlowX = this.overFlowX
        if (path.startsWith("/word") || path.startsWith("/search")) {
            overFlowX = 'visible';
        }

        return (
            <div className="App">
                <Shell theme={categoryTheme} id="page1" >
                    {/* <button slot="start-bar" className="zmdi zmdi-info-outline" onClick={this.showInfo}></button> */}
                    <MenuButton slot="start-bar" open={this.state.menuOpen} onClick={() => this.handleMenuClick()} color='white' />
                    <div slot="title" style={{ display: "inline-block" }}>{title}</div>
                    {searchInput}
                    {leftArrow}
                    {rightArrow}
                    {backElement}
                    <Menu id="SettingWindow" slot="body" open={this.state.menuOpen} closeSettings={() => this.closeSettings()}>
                        <MenuItem
                            delay={`${0.1}s`}
                            onClick={() => { this.showInfo(); }}>About Us - עלינו</MenuItem>
                        {this.isMobile() ? null :
                            <div id="toggles">
                                <input type="checkbox" name="allowSwipeCB" id="allowSwipeCB" className="ios-toggle" checked={this.state.allowSwipe}
                                    onChange={(e) => this.allowSwipe(e.target.checked)} />
                                <label for="allowSwipeCB" className="checkbox-label" data-off="החלקה כבויה" data-on="החלקה דולקת"></label>
                            </div>
                        }
                    </Menu>
                    <div slot="body" className="theBody" style={{
                        paddingLeft:this.shellPadding, 
                        paddingRight:this.shellPadding,
                        overflowX: overFlowX
                    }}>
                        {this.props.children}
                    </div>
                </Shell>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
