import React from 'react';

import './css/App.css';
import './css/style.css';

import { browserHistory } from "react-router";
import SearchInput from "./components/SearchInput";
import { getPath, navigate } from "hookrouter";
import {
    scrollLeft, scrollRight,
    saveWordTranslateX, saveRootTranslateX, setTranslateX,
    getTheme, 
    ALLOW_SWIPE_KEY, saveSettingKey, getBooleanSettingKey
} from "./utils/Utils";
import Shell from "./containers/Shell";
import IssieBase from './IssieBase';
import { MenuButton, Menu, MenuItem } from './settings'
import './css/settings.css'
import { imageLocalCall } from "./apis/ImageLocalCall";


class App extends IssieBase {
    constructor(props) {
        super(props);
        if (this.props.pubSub) {
            this.props.pubSub.subscribe((args)=>this.getEvents(args));
        }
        console.log("allow swipe: " + getBooleanSettingKey(ALLOW_SWIPE_KEY, false));
        this.state = { searchString: "", allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false) };
        this.getEvents = this.getEvents.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.goBack = this.goBack.bind(this);
        this.savePos = this.savePos.bind(this);
        this.ScrollLeft = this.ScrollLeft.bind(this); 
        this.ScrollRight = this.ScrollRight.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }
    componentDidUpdate() {
        if (this.props.pubSub) {
            this.props.pubSub.subscribe((args)=>this.getEvents(args));
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.pubSub) {
          return {
            showDelete: undefined,
          };
        }
    
        // Return null if the state hasn't changed
        return null;
    }
    getEvents(args){
        switch (args.command) {
            case 'show-delete':
                this.setState({showDelete: args.callback} );
                break;
            case 'hide-all-buttons':
                this.setState({showDelete:undefined})
                break;
            default:
        }
    } 

    handleSearch(e) {
       // this.setState({searchInput:e.target.value})
        if (e.target.value.length > 1) {
            navigate('/search/' + e.target.value);
            saveRootTranslateX(0);
            console.log("Search: " + e.target.value);
        } else {
            //go back to category
            navigate('/');
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
        if (getPath().startsWith('/word')) {
            //reset words position
            saveWordTranslateX(0);
        }
        browserHistory.goBack();
    }
    savePos(newVal) {
        if (getPath().startsWith('/word')) {
            saveWordTranslateX(newVal);
        } else  {
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
        navigate('/info');
    }

    allowSwipe(allow) {
        saveSettingKey(ALLOW_SWIPE_KEY, allow);
        this.setState({ allowSwipe: allow });
        setTranslateX(0);
    }

    render() {
        let categoryTheme = "blue";
        let categoryId = this.props.categoryId;
        if (categoryId) {
            categoryTheme = getTheme(categoryId);
        }
        let title = "שפת הסימנים";
        if (this.props.title) {
            title = this.props.title;
        }
        let leftArrow = "";
        let rightArrow = "";

        let backElement = <div slot="end-bar" style={{ height: 50 }}><button className="roundbutton backBtn"
            onClick={this.goBack} style={{ float: "right", visibility: (!this.props.noBack ? "visible" : "hidden"), "--radius": "50px" }}><div className="zmdi zmdi-arrow-right" /></button></div>
        let searchInput = "";

        let deleteButton = this.state.showDelete?<div slot="start-bar" style={{ height: 50 }}><button className="roundbutton backBtn"
            onClick={this.state.showDelete} style={{ "--radius": "50px" }}><div className="zmdi zmdi-delete" /></button></div>:null

        document.preventTouch = true;

        if (!this.props.noSearch) {
            let searchVal = this.state.searchString || "";

            // if (!searchVal) {
            //     if (this.state.searchInput) {
            //         searchVal = this.state.searchInput;
            //     } else {
            //         searchVal = ""
            //     }
            // }
            // if (searchVal.length > 1 && !path.startsWith("/search")) {
            //     searchVal = "";
            // }
            searchInput = <SearchInput value={searchVal} theme={categoryTheme} slot={this.state.narrow ? "title" : "end-bar"} onChange={this.handleSearch} style={{ display: "inline-block" }} />
        }

        if (this.isMobile() || this.props.allowTouch || this.state.allowSwipe) {
            document.preventTouch = false;
        }

        if (!this.isMobile() && !this.props.noNavBtn && !this.state.allowSwipe) {
            leftArrow = <a slot="next" onClick={this.ScrollRight} id="scrolRight" className="navBtn"><img src={imageLocalCall("arrow-right.svg")} alt="arrow" /></a>
            rightArrow = <a slot="prev" onClick={this.ScrollLeft} id="scrollLeft" className="navBtn"><img src={imageLocalCall("arrow-left.svg")} alt="arrow" /></a>
        }

        if (this.isMobile() && this.isLandscape() && this.props.child==="video") {
            return (
                <div>
                    <div style={{ height: 50, zIndex:0 }}>
                        {backElement}
                    </div>
                    {this.props.children}
                </div>)
        }

        let overFlowX = this.overFlowX
        if (this.props.allowOverflow ) {
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
                    {deleteButton} 
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


// const mapStateToProps = (state) => {
//     return {};
// };

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({}, dispatch);
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App;