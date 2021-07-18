import './css/App.css';

import React from 'react';
import Word from "./containers/Word";
import Body from "./containers/Body";
import Video from "./containers/Video";
import { getAllCategories, getAllWords, reloadAdditionals, getWordsByCategoryID } from "./apis/catalog";
import Search from './containers/Search'
import Info from "./containers/Info";
import AddItem from "./components/add";
import { withAlert } from 'react-alert'

import { Route, Switch } from "react-router";
import { VideoToggle } from "./utils/Utils";
import { ClipLoader } from 'react-spinners';
import { translate, setLanguage, fTranslate } from './utils/lang';
import { gCurrentLanguage } from './current-language';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
import { Menu, OnOffMenu, LineMenu } from './settings'
import './css/settings.css'
import { receiveIncomingZip } from './apis/file'
import { isNumber } from 'util';
import {
    PlusButton, SettingsButton, TrashButton, ShareButton,
    BackButton, PrevButton, NextButton
} from './components/ui-elements';



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

        this.getEvents = this.getEvents.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.goBack = this.goBack.bind(this);
        this.savePos = this.savePos.bind(this);
        this.ScrollLeft = this.ScrollLeft.bind(this);
        this.ScrollRight = this.ScrollRight.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    componentDidMount() {
        setLanguage(gCurrentLanguage)

        window.addEventListener("resize", this.resizeListener);

        window.goBack = () => this.goBack();

        let pubsub = new PubSub()
        this.setState({
            allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false),
            allowAddWord: getBooleanSettingKey(ALLOW_ADD_KEY, false),
            pubsub: pubsub,
            busy: false,
            busyText: translate("Working")
        });
        pubsub.subscribe((args) => this.getEvents(args));

        window.importWords = (url) => {
            console.log("Reloading app");
            this.setState({ busy: true, busyText: translate("ImportWords") });
            receiveIncomingZip(url).then((data) => {
                if (data) {
                    reloadAdditionals().then(() => {

                        //generate message:
                        this.setState({ busy: false });

                        setTimeout(() => {
                            let msg = translate("NewWords") + ":\n";
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].words.length > 0) {
                                    let folderName = data[i].name;
                                    if (isNumber(folderName)) {
                                        let cat = getAllCategories().find(f => f.name === folderName);
                                        if (cat) {
                                            folderName = cat.name;
                                        }
                                    }

                                    msg += folderName + ":\n";
                                    for (let j = 0; j < data[i].words.length; j++) {
                                        msg += "  " + data[i].words[j] + "\n";
                                    }
                                }
                            }
                            this.props.alert.success(msg);
                        }, 100);

                    });
                }
            });
        }

        reloadAdditionals().then(() => this.forceUpdate());

        this.loadingMedia();

    }

    loadingMedia = () => {
        setTimeout(() => {
            if (!document.assetsReady) {
                //let sizeInMb = Math.floor(document.totalSizeToDownload / (1024*1024));
                this.setState({
                    busy: true,
                    showProgress: true,
                    progress: document.downloadPercent,
                    progressText: `${document.downloadPercent}%`,
                    busyText: fTranslate("LoadingMedia", document.fileIndex, 2)
                });
                this.loadingMedia()
            } else {
                this.setState({ busy: false, progress: undefined });
            }
        }, 1500);
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
                title: props.history.location.pathname === "/" ? translate("AppTitle") : state.title,
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
            case 'show-share':
                this.setState({ showShare: args.callback });
                break;
            case 'hide-all-buttons':
                this.setState({ showDelete: undefined, showShare: undefined })
                break;
            case 'set-categoryId':
                if (args.categoryId !== this.state.categoryId) {
                    this.setState({ theme: getTheme(args.categoryId), categoryId: args.categoryId })
                    console.log("catId:" + args.categoryId + ", theme:" + getTheme(args.categoryId))
                }
                break;
            case 'set-title':
                if (args.title !== this.state.title) {
                    this.setState({ title: args.title })
                }
                break;
            case 'refresh':
                this.forceUpdate()
                break;
            case 'set-busy':
                this.setState({ busy: args.active === true, busyText: args.text });
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

    handleNewClick() {
        if (this.isHome()) {
            this.props.history.push("/add-category");
        } else if (this.isWords()) {
            this.props.history.push("/add-word/" + encodeURIComponent(this.state.categoryId));
        }
    }

    closeSettings() {
        this.setState({ menuOpen: false });
    }

    goBack(skipSearch) {
        this.backInProcess = true;
        if (this.isWords()) {
            //reset words position
            saveWordTranslateX(0);
        }
        let video = this.isVideo();


        if (skipSearch === undefined && this.isSearch()) {
            this.props.history.goBack();
            setTimeout(() => this.setState({ searchStr: "" }), 100);
        } else {
            this.props.history.goBack();
        }
        if (video) {
            VideoToggle(false);
        }
        setTimeout(() => {
            this.setState({ showDelete: undefined, showShare: undefined })
            this.backInProcess = false
        }, 50);
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
        let leftArrow = "";
        let rightArrow = "";

        let backElement = this.isHome() ? null : <BackButton slot="end-bar" onClick={() => this.goBack()} />
        // <div slot="end-bar" style={{ height: 50 }}><button className="roundbutton backBtn"
        //     onClick={() => this.goBack()} style={{ visibility: (!this.isHome() ? "visible" : "hidden"), "--radius": "50px" }}><div className="arrow-right" /></button></div>
        let searchInput = "";

        let deleteButton = this.state.showDelete ?
            <TrashButton slot="start-bar" onClick={this.state.showDelete} /> : null;
        let shareButton = this.state.showShare ?
            <ShareButton slot="start-bar" onClick={this.state.showShare} /> : null;
        document.preventTouch = true;

        if (!this.isInfo() && !this.isVideo() && !this.state.showShare) {
            let narrow = IssieBase.isMobile() && !IssieBase.isLandscape();
            let searchClassName = narrow ? "" : "sameLine";
            searchInput = (
                <div slot={narrow ? "title" : "end-bar"} className={"search " + searchClassName} >
                    <input

                        type="search" onChange={this.handleSearch}
                        onFocus={this.preventKeyBoardScrollApp} value={this.state.searchStr || ""} />
                </div>)
        }

        if (IssieBase.isMobile() || this.isInfo() || this.state.allowSwipe) {
            document.preventTouch = false;
            console.log("touch allowed")
        }

        if (!IssieBase.isMobile() &&
            (!this.isAddScreen() && !this.isVideo() && !this.isInfo())
            && !this.state.allowSwipe) {
            leftArrow = <NextButton slot="next" onClick={this.ScrollRight} id="scrolRight" />
            rightArrow = <PrevButton slot="prev" onClick={this.ScrollLeft} id="scrollLeft" />
        }

        if (IssieBase.isMobile() && IssieBase.isLandscape() && this.isVideo()) {
            return (
                <div>

                    {this.getChildren()}
                </div>)
        }

        let overFlowX = this.state.dimensions.overFlowX;
        if (this.isSearch() || this.isWords()) {
            overFlowX = 'visible';
        }
        return (
            <div className="App">
                <div style={{ position: 'absolute', top: '30%', width: '100%', zIndex: 99999 }}>
                    {this.state.busy ? <div style={{ position: 'absolute', alignContent: 'center', direction: 'rtl', top: '60px', left: '15%', right: '15%', color: 'black', fontSize: 30 }}>
                        {this.state.busyText}
                        {this.state.showProgress ?
                            <CircularProgressbar
                                value={this.state.progress}
                                text={this.state.progressText}
                                background={true}
                                styles={{fontSize:16}}
                            />
                            : <ClipLoader
                                sizeUnit={"px"}
                                size={150}
                                color={'#123abc'}
                                loading={this.state.busy}
                            />}
                    </div> : null}
                </div>
                <Shell theme={this.state.theme} id="page1" isMobile={IssieBase.isMobile()}>

                    <SettingsButton slot="start-bar" onClick={() => this.handleMenuClick()} />
                    {this.state.allowAddWord && (this.isHome() || this.isWords()) ? <PlusButton slot="start-bar" open={this.state.menuOpen} onClick={() => this.handleNewClick()} color='white' />
                        : null}
                    <div slot="title" style={{ display: "inline-block" }}>{this.state.title}</div>
                    {searchInput}
                    {leftArrow}
                    {rightArrow}
                    {backElement}
                    {deleteButton}
                    {shareButton}
                    {this.state.allowAddWord ? <div /> : null}
                    <Menu id="SettingWindow"
                        slot="body"
                        open={this.state.menuOpen}
                        closeSettings={() => this.closeSettings()}
                        showInfo={() => { this.showInfo(); }}>
                        {IssieBase.isMobile() ? null :
                            <OnOffMenu
                                label={translate("SettingsSwipe")}
                                checked={this.state.allowSwipe}
                                onChange={(isOn) => this.allowSwipe(isOn)}
                            />}
                        {IssieBase.isMobile() ? null : <LineMenu />}
                        <OnOffMenu
                            label={translate("SettingsEdit")}
                            subLabel={translate("SettingsAddCatAndWords")}
                            checked={this.state.allowAddWord}
                            onChange={(isOn) => this.allowAddWord(isOn)}
                        />
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
        console.log("Render App.js")
        return (
            <Switch>
                <Route exact path="/" render={(props) => (
                    <Body
                        categories={getAllCategories()}
                        allowAddWord={this.state.allowAddWord}
                        isLandscape={IssieBase.isLandscape()}
                        isMobile={IssieBase.isMobile()}
                        pubSub={this.state.pubsub}
                        dimensions={this.state.dimensions}
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
                            dimensions={this.state.dimensions}
                        />
                    )
                    } />

                <Route
                    path="/word/:categoryId/:title"
                    render={(props) => {
                        this.setTitle(props.match.params.title);
                        let words = getWordsByCategoryID(props.match.params.categoryId);
                        //alert(JSON.stringify(words))
                        return (
                            <Word
                                pubSub={this.state.pubsub}
                                isMobile={IssieBase.isMobile()}
                                allowAddWord={this.state.allowAddWord}
                                words={words}
                                categoryId={props.match.params.categoryId}
                                categoryId4Theme={props.match.params.categoryId}
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
                                words={getWordsByCategoryID(props.match.params.categoryId)}
                                categoryId={props.match.params.categoryId}
                                categoryId4Theme={"1"}
                                dimensions={this.state.dimensions}
                            />
                        )
                    }
                    } />
                <Route
                    path="/video/:videoName/:categoryId/:title/:filePath"
                    render={(props) => {
                        console.log("Render video pane")
                        if (this.backInProcess)
                            return
                        VideoToggle(true, !IssieBase.isMobile(), IssieBase.isLandscape());
                        this.setTitle(props.match.params.title);

                        return (
                            <Video {...props}
                                categoryId={props.match.params.categoryId}
                                isLandscape={IssieBase.isLandscape()}
                                isMobile={IssieBase.isMobile()}
                                videoName={props.match.params.videoName}
                                filePath={props.match.params.filePath ? decodeURIComponent(props.match.params.filePath) : ""}
                            />)
                    }
                    }
                />

                <Route
                    path="/info"
                    render={(props) => {
                        this.setTitle(translate("About"))
                        return (
                            <Info />
                        )
                    }
                    } />
                <Route
                    path="/add-category"
                    render={(props) => {
                        this.setTitle(translate("TitleAddCategory"));
                        return (
                            <AddItem
                                history={props.history}
                                addWord={false}
                                pubSub={this.state.pubsub}
                                isLandscape={IssieBase.isLandscape()}
                                dimensions={this.state.dimensions}
                            />
                        )
                    }
                    } />
                <Route
                    path="/add-word/:categoryId"
                    render={(props) => {
                        this.setTitle(translate("TitleAddWord"))
                        return (
                            <AddItem
                                addWord="true"
                                history={props.history}
                                pubSub={this.state.pubsub}
                                isLandscape={IssieBase.isLandscape()}
                                categoryId={props.match.params.categoryId}
                                categoryId4Theme={props.match.params.categoryId}
                                dimensions={this.state.dimensions}
                            />
                        )
                    }
                    } />
            </Switch>);
    }

    // <CategoryList>
    //     {getAllCategories().map(cat => <ListItem
    //     name={cat.name}
    //     imageName={cat.imageName}
    //     callback={()=>alert("cat selected: "+cat.name)}
    //     />

    //     )}
    // </CategoryList>

    setTitle(title) {
        this.state.pubsub.publish({ command: "set-title", title });
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

export default withAlert()(App);