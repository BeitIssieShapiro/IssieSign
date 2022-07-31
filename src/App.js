import './css/App.css';

import React from 'react';
import Word from "./containers/Word";
import Body from "./containers/Body";
import WordAdults from "./containers/Word-adult";
import Video from "./containers/Video";
import Search from './containers/Search'
import Info from "./containers/Info";
import AddEditItem from "./components/add";
import { withAlert } from 'react-alert'

import { VideoToggle, getLanguage, trace, isMyIssieSign } from "./utils/Utils";
import { ClipLoader } from 'react-spinners';
import { translate, setLanguage, fTranslate } from './utils/lang';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './css/App.css';
import './css/style.css';

import {
    getTheme,
    ALLOW_SWIPE_KEY, ALLOW_ADD_KEY, ADULT_MODE_KEY, getBooleanSettingKey
} from "./utils/Utils";
import Shell from "./containers/Shell";
import IssieBase from './IssieBase';
import Settings from './settings'
import './css/settings.css'
import {
    SettingsButton, TrashButton,
    BackButton, PrevButton, NextButton, EditButton, AddButton, ShareCartButton
} from './components/ui-elements';
import { mainJson } from './mainJson';
import FileSystem from './apis/filesystem';
import ShareInfo from './components/share-info';
import { ShareCart } from './share-cart';
import ShareCartUI from './containers/share-cart-ui';
import { Sync } from '@mui/icons-material'



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

    refresh = () => this.publish({ command: "refresh" })
}

function splitAndDecodeCompoundName(str) {
    let parts = str.split("/");
    return parts.map(p => decodeURIComponent(p));
}

class App extends IssieBase {
    constructor(props) {
        super(props);

        this.getEvents = this.getEvents.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.goBack = this.goBack.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    async componentDidMount() {

        window.addEventListener("resize", this.resizeListener);
        const getCurrent = () => {
            if (this.isWords()) {
                return this.state.wordScroll;
            } else if (this.isSearch()) {
                return this.state.searchScroll;
            } else if (this.isInfo()) {
                return this.state.infoScroll;
            } else {
                return this.state.bodyScroll;
            }
        }
        const setCurrent = ({ x, y }, overwriteSwipeMode) => {
            if (this.isSwipeAllowed() || overwriteSwipeMode) {
                let container = document.getElementsByClassName(this.isInfo() ? "info" : "tileContainer")[0];
                if (container) {
                    if (x !== 0 && x < window.innerWidth - container.scrollWidth) {
                        x = window.innerWidth - container.scrollWidth;
                    }

                    if (y !== 0 && y < window.innerHeight - container.scrollHeight) {
                        y = window.innerHeight - container.scrollHeight;
                    }
                }
                if (x > 0) {
                    x = 0;
                }
                if (y > 0) {
                    y = 0;
                }
                const newScrollX = { x, y: 0 };
                const newScrollY = { x: 0, y };
                if (this.isWords()) {
                    this.setState({ wordScroll: IssieBase.isMobile() || this.state.adultMode ? newScrollY : newScrollX });
                } else if (this.isSearch()) {
                    this.setState({ searchScroll: newScrollX });
                } else if (this.isInfo()) {
                    this.setState({ infoScroll: newScrollY });
                } else {
                    this.setState({ bodyScroll: IssieBase.isMobile() ? newScrollY : newScrollX });
                }
            }
        }

        document.swipeHandler = {
            getCurrent,
            setCurrent,
            moveButton: (toRight) => {
                const curr = getCurrent();
                const absInc = (window.innerWidth - 150)
                const inc = toRight ? -absInc : absInc;
                setCurrent({ x: curr.x + inc, y: curr.y }, true);
            },
        }
        window.goBack = () => this.goBack();
        let lang = getLanguage();
        setLanguage(lang)

        const pubsub = new PubSub()
        trace("App: Init file system");
        await FileSystem.get().init(mainJson, pubsub).then(() => this.setState({ fs: FileSystem.get() }));

        const shareCart = new ShareCart()
        this.setState({
            allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false),
            allowAddWord: isMyIssieSign() || getBooleanSettingKey(ALLOW_ADD_KEY, false),
            adultMode: getBooleanSettingKey(ADULT_MODE_KEY, false),
            language: lang,
            pubSub: pubsub,
            busy: false,
            busyText: translate("Working"),
            bodyScroll: { x: 0, y: 0 },
            wordScroll: { x: 0, y: 0 },
            searchScroll: { x: 0, y: 0 },
            infoScroll: { x: 0, y: 0 },
            shareCart,
        });
        pubsub.subscribe((args) => this.getEvents(args));

        window.importWords = (url) => {
            trace("App: Importing words");

            pubsub.publish({ command: 'long-process', msg: translate("ImportWords") });

            shareCart.importWords(url).then(
                (addWords) => {
                    pubsub.refresh();
                    // todo format
                    this.props.alert.success(addWords.join("\n"));
                },
                (err) => {
                    this.props.alert.error(fTranslate("ImportWordsErr", err))
                    console.log(fTranslate("ImportWordsErr", err));
                }
            ).finally(() => pubsub.publish({ command: 'long-process-done' }));
        }

        if (window.awaitingImport) {
            setTimeout(() => {
                window.importWords(window.awaitingImport);
                window.awaitingImport = undefined;

            }, 100);
        }

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
                theme: App.isHome(props) ? "blue" : state.theme,
                title: App.isHome(props) ? translate("AppTitle") : state.title,
                pubSub: state.pubSub ? state.pubSub : new PubSub()
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
            case 'show-entity-info':
                //this.setState({ showEntityInfo: args.name });
                console.log("info", args);
                const nameParts = args.name.split("/");
                if (nameParts.length === 1) {
                    this.props.history.push("/add-category/" + encodeURIComponent(nameParts[0]));

                } else {
                    this.props.history.push("/add-word/" + encodeURIComponent(nameParts[0]) + "/" + encodeURIComponent(nameParts[1]));
                }
                break;
            case 'hide-all-buttons':
                this.setState({ showDelete: undefined, showShare: undefined })
                break;
            case 'set-categoryId':
                if (args.categoryId !== this.state.categoryId) {
                    this.setState({ theme: getTheme(args.categoryId), categoryId: args.categoryId })
                    trace("Set Category: catId:" + args.categoryId + ", theme:" + getTheme(args.categoryId))
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
            case 'edit-mode':
                this.setState({ editMode: true });
                break;
            case 'set-busy':
                this.setState({ busy: args.active === true, busyText: args.text });
                break;
            case 'long-process':
                this.setState({ longProcess: { msg: args.msg, icon: args.icon } });
                break;
            case 'long-process-done':
                this.setState({ longProcess: undefined });
                break;
            default:
        }
    }

    handleSearch(e) {
        e.persist()
        this.setState({ searchStr: e.target.value }, () => {
            if (e.target.value.length > 1 && !this.isSearch()) {
                this.props.history.push(SEARCH_PATH);
                this.setState({ bodyScroll: { x: 0, y: 0 } });
                trace("Search: " + e.target.value);
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
        if (App.isHome(this.props)) {
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
            this.setState({ wordScroll: { x: 0, y: 0 } });
        }
        let video = this.isVideo();


        if (skipSearch === undefined && this.isSearch()) {
            this.props.history.goBack();
            setTimeout(() => this.setState({ searchStr: "" }), 100);
        } else {
            this.props.history.goBack();
        }
        if (video) {
            trace("GoBack: toggle video off")
            VideoToggle(false);
        }
        setTimeout(() => {
            this.setState({ showDelete: undefined, showShare: undefined })
            this.backInProcess = false
        }, 50);
    }

    ScrollLeft() {
        document.swipeHandler.moveButton(false);
    }

    ScrollRight() {
        document.swipeHandler.moveButton(true);
    }

    showInfo() {
        this.setState({ menuOpen: false });
        this.props.history.push('/info');
    }

    isSwipeAllowed = () => {
        return (IssieBase.isMobile() || this.isInfo() || this.state.allowSwipe || this.state.adultMode);
    }




    render() {
        let path = this.props.history.path;

        //console.log("render app")
        let leftArrow = "";
        let rightArrow = "";

        let backElement = App.isHome(this.props) ? null : <BackButton slot="end-bar" onClick={() => this.goBack()} />
        let searchInput = "";

        let deleteButton = this.state.showDelete ?
            <TrashButton slot="start-bar" onClick={this.state.showDelete} /> : null;
        document.preventTouch = true;

        if (!this.isInfo() && !this.isVideo() &&!this.isAddScreen() && !this.state.showShare) {
            searchInput = (
                <div slot="center-bar" className="search shellSearch">
                    <input
                        type="search" onChange={this.handleSearch}
                        onFocus={this.preventKeyBoardScrollApp} value={this.state.searchStr || ""} />
                </div>)
        }

        if (!this.isSwipeAllowed() && !this.isShareScreen() &&
            (!this.isAddScreen() && !this.isVideo())) {
            leftArrow = <NextButton slot="next" onClick={this.ScrollRight} id="scrolRight" />
            rightArrow = <PrevButton slot="prev" onClick={this.ScrollLeft} id="scrollLeft" />
        }

        if (IssieBase.isMobile() && IssieBase.isLandscape() && this.isVideo()) {
            return (
                <div>

                    {this.getChildren(path, this.props, this.state)}
                </div>)
        }

        let overFlowX = this.state.dimensions.overFlowX;
        if (this.isSearch() || this.isWords()) {
            overFlowX = 'visible';
        }

        return (
            <div className="App">
                {/**Word Info */
                    this.state.showEntityInfo && <ShareInfo
                        pubSub={this.state.pubSub}
                        onClose={() => this.setState({ showEntityInfo: undefined })}
                        fullName={this.state.showEntityInfo}
                    />
                }

                {/** long process */
                    this.state.longProcess && <div style={{ position: 'absolute', display: "flex", alignItems: "center", bottom: 15, right: 0, fontSize: 15, zIndex: 100 }}>
                        {this.state.longProcess.msg}
                        <Sync className="rotate" />
                    </div>
                }

                <div style={{ position: 'absolute', top: '30%', width: '100%', zIndex: 99999 }}>
                    {this.state.busy ? <div style={{ position: 'absolute', alignContent: 'center', direction: 'rtl', top: '60px', left: '15%', right: '15%', color: 'black', fontSize: 30 }}>
                        <div style={{ position: "absolute", top: 60, left: "45%" }}>{this.state.busyText}</div>
                        {this.state.showProgress ?
                            <CircularProgressbar
                                value={this.state.progress}
                                text={this.state.progressText}
                                background={true}
                                styles={{ fontSize: 16 }}
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

                    <EditButton
                        slot="start-bar"
                        selected={this.state.editMode}
                        onClick={() => {
                            this.setState({ editMode: this.state.editMode === true ? false : true })
                        }} />

                    {this.state.allowAddWord && (App.isHome(this.props) || this.isWords()) &&
                        <AddButton slot="start-bar"
                            onClick={() => this.handleNewClick()} color='white'
                        />
                    }

                    <div slot="center-bar" className="shelltitle">{this.state.title}</div>
                    {searchInput}
                    {leftArrow}
                    {rightArrow}
                    {backElement}
                    {deleteButton}

                    {this.state.editMode &&
                    !this.isAddScreen() &&
                    <ShareCartButton slot="start-bar"
                        count={this.state.shareCart.count()}
                        onClick={() => this.props.history.push("/share-cart")} />}

                    {this.state.menuOpen && <Settings
                        slot="body"
                        state={this.state}
                        setState={(obj => this.setState(obj))}
                        onClose={() => this.setState({ menuOpen: false })}
                        showInfo={() => this.showInfo()}
                        pubSub={this.state.pubSub}
                    />}

                    <div slot="body" className="theBody" style={{
                        paddingLeft: this.shellPadding,
                        paddingRight: this.shellPadding,
                        overflowX: overFlowX
                    }}>

                        {this.getChildren(path, this.props, this.state)}
                    </div>
                </Shell>

            </div >
        );
    }

    getChildren(path, props, state) {
        //console.log("get children, path", path)

        if (path === "/" || path === "")
            return <Body
                categories={FileSystem.get().getCategories()}
                allowAddWord={this.state.allowAddWord}
                isLandscape={IssieBase.isLandscape()}
                isMobile={IssieBase.isMobile()}
                pubSub={this.state.pubSub}
                editMode={this.state.editMode}
                shareCart={this.state.shareCart}
                dimensions={this.state.dimensions}
                allowSwipe={this.isSwipeAllowed()}
                scroll={this.state.bodyScroll}
            />

        if (path === SEARCH_PATH)
            return <Search
                words={FileSystem.get().getAllWords()}
                categories={FileSystem.get().getCategories()}
                isMobile={IssieBase.isMobile()}
                searchStr={this.state.searchStr}
                dimensions={this.state.dimensions}
                allowSwipe={this.isSwipeAllowed()}
                scroll={this.state.searchScroll}
            />

        if (path === "/share-cart") {
            this.setTitle(translate("ShareCartTitle"));

            return <ShareCartUI
                pubSub={state.pubSub}
                shareCart={state.shareCart}
            />
        }

        if (path.startsWith("/word/")) {
            //:categoryId/:title
            const [categoryId, title] = splitAndDecodeCompoundName(path.substr(6));
            this.setTitle(title);
            let words = FileSystem.get().getCategories().find(c => c.name === categoryId)?.words || [];

            const wordProps = {
                pubSub: state.pubSub,
                editMode: state.editMode,
                shareCart: state.shareCart,
                isMobile: IssieBase.isMobile(),
                allowAddWord: state.allowAddWord,
                words,
                categoryId,
                categoryId4Theme: categoryId,
                scroll: state.wordScroll,
            }
            return (
                state.adultMode ?
                    <WordAdults {...wordProps} /> :
                    <Word  {...wordProps} />)
        }

        if (path.startsWith("/word-added/")) {
            //:categoryId/:title
            const [categoryId, title] = splitAndDecodeCompoundName(path.substr(12));
            this.setTitle(title);
            return <Word
                pubSub={state.pubSub}
                editMode={state.editMode}
                shareCart={state.shareCart}
                isMobile={IssieBase.isMobile()}
                allowAddWord={state.allowAddWord}
                type="added"
                words={
                    FileSystem.get().getCategories().find(c => c.id === categoryId)?.words || []
                }
                categoryId={categoryId}
                categoryId4Theme={"1"}
                dimensions={state.dimensions}
                scroll={state.wordScroll}
            />
        }

        if (path.startsWith("/video/")) {
            //:videoName/:categoryId/:title/:filePath
            const [videoName, categoryId, title, filePath] = splitAndDecodeCompoundName(path.substr(7));
            this.setTitle(title);

            if (this.backInProcess)
                return
            VideoToggle(true, !IssieBase.isMobile(), IssieBase.isLandscape());
            this.setTitle(title);

            return (
                <Video {...props}
                    categoryId={categoryId}
                    isLandscape={IssieBase.isLandscape()}
                    isMobile={IssieBase.isMobile()}
                    videoName={videoName}
                    filePath={filePath ? decodeURIComponent(filePath) : ""}
                />)
        }

        if (path.startsWith("/info")) {

            this.setTitle(translate("About"))
            return (
                <Info
                    scroll={state.infoScroll}
                />

            )
        }
        if (path.startsWith("/add-category")) {
            //add-category [/:categoryId]
            const [categoryId] = splitAndDecodeCompoundName(path.substr(14));


            this.setTitle(categoryId?.length > 0 ? translate("TitleEditCategory"):translate("TitleAddCategory"));
            return (
                <AddEditItem
                    history={props.history}
                    addWord={false}
                    pubSub={state.pubSub}
                    categoryId={categoryId?.length > 0 ? categoryId : undefined}
                    isLandscape={IssieBase.isLandscape()}
                    dimensions={state.dimensions}
                />

            )
        }



        if (path.startsWith("/add-word/")) {
            //add-word/:categoryId [/?:wordId]
            const [categoryId, wordId] = splitAndDecodeCompoundName(path.substr(10));

            this.setTitle(wordId?.length > 0 ? translate("TitleEditWord"): translate("TitleAddWord"))
            return (
                <AddEditItem
                    addWord={true}
                    wordId={wordId}
                    history={props.history}
                    pubSub={state.pubSub}
                    isLandscape={IssieBase.isLandscape()}
                    categoryId={categoryId}
                    categoryId4Theme={categoryId}
                    dimensions={state.dimensions}
                />
            )
        }
    }


    setTitle(title) {
        if (this.state.pubSub) {
            this.state.pubSub.publish({ command: "set-title", title });
        }
    }

    isSearch() {
        return this.props.history.path.startsWith(SEARCH_PATH);
    }

    isWords() {
        return this.props.history.path.startsWith("/word");
    }

    isWordsAdded() {
        return this.props.history.path.startsWith("/word-added/");
    }

    isAddScreen() {
        return this.props.history.path.startsWith("/add-");
    }

    isShareScreen() {
        return this.props.history.path.startsWith("/share-cart");
    }

    isVideo() {
        return this.props.history.path.startsWith("/video/") ||
            (this.props.history.path.startsWith("/word/") && this.state.adultMode);
    }

    isInfo() {
        return this.props.history.path.startsWith("/info");
    }

    static isHome(props) {
        return props.history.path === "/" || props.history.path === "";
    }

    getSearchStr() {
        if (this.props.history.path.startsWith(SEARCH_PATH)) {
            return this.props.history.path.substr(SEARCH_PATH.length);
        }
        return this.state.searchStr || "";
    }
}

export default withAlert()(App);