import './css/App.css';

import React from 'react';
import Body from "./containers/Body";
import Video from "./containers/Video";
import Search from './containers/Search'
import Info from "./containers/Info";
import AddEditItem from "./components/add";
import { withAlert } from 'react-alert'

import { getLanguage, trace, isMyIssieSign, getThemeName, getAppName, SHOW_OWN_FOLDERS_FIRST_KEY, isBrowser, ISSIE_SIGN_ASSETS_STATE, ISSIE_SIGN_APP_TYPE, getSettingKey, saveSettingKey, getContentMap, saveAppType, getPersistedAppType } from "./utils/Utils";
import { translate, setLanguage, fTranslate, isRTL } from './utils/lang';
import { os } from './current-language';

import 'react-circular-progressbar/dist/styles.css';

import './css/App.css';
import './css/style.css';


import {
    getTheme,
    ALLOW_SWIPE_KEY, ALLOW_ADD_KEY, ADULT_MODE_KEY, getBooleanSettingKey, headerSize, AppType
} from "./utils/Utils";
import Shell from "./containers/Shell";
import IssieBase from './IssieBase';
import Settings from './settings'
import './css/settings.css'
import {
    SettingsButton, TrashButton,
    BackButton, PrevButton, NextButton, EditButton, AddButton, ShareCartButton, Word2, BusyMsg
} from './components/ui-elements';
import FileSystem from './apis/filesystem';
import ShareInfo from './components/share-info';
import { ShareCart } from './share-cart';
import ShareCartUI from './containers/share-cart-ui';
import { Sync } from '@mui/icons-material'
import { SlideupMenu } from './components/slideup-menu';
import InfoArabic from './containers/Info-issie-sign-arabic';
import InfoMyIssieSign from './containers/Info-my-issie-sign';
import AppTypeSelection from './components/apptype-selector';



const SEARCH_PATH = "/search/";
const SCROLL_RESET = { x: 0, y: 0 };

const AssetsState = {
    UNINITIALIZED: "0",
    LOADING: "1",
    READY: "2",
};



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

    // componentWillUnmount() {
    //     window.removeEventListener('keyboardDidHide', function () {
    //         this.preventKeyBoardScrollApp()
    //     });
    // }

    deviceReady() {
        if (isBrowser()) return;
        if (cordova.file.applicationDirectory.includes('android_asset')) {
            // Android:
            console.log("Device is Android")
            window.isAndroid = true;

            //https://localhost/__cdvfile_assets__/ == assets/www
            window.documents = cordova.file.dataDirectory;
            // would be file:///data/user/0/com.issieshapiro.myissiesign/files/

            document.basePath = "https://localhost/__cdvfile_assets__/";

            if (!cordova.openwith) {
                console.log("cordova.openwith is undefined");
            }
            cordova.openwith?.init(
                () => {
                    console.log("open with init success");
                    cordova.openwith.addHandler((intent) => {
                        console.log("open with handler called");
                        if (intent.items.length == 1) {
                            let url = intent.items[0].uri
                            console.log("open with url:", url);

                            if (window.openWith) {
                                console.log("open with started");
                                window.openWith(url);
                            }
                        }
                    });
                },
                (err) => console.log("open with init error", err)
            );
        } else {
            //only in iOS
            console.log("Device is iOS");
            window.isAndroid = false;
            window.documents = cordova.file.documentsDirectory;
        }
        console.log("base path:", document.basePath, "window.documents:", window.documents);
    }

    waitForDeviceReady() {
        return new Promise((resolve) => {
            this.pollDeviceReady(resolve)
        })
    }

    pollDeviceReady(resolver) {
        if (isBrowser()) {
            console.log("Device is Browser")
            resolver();
            return;
        }

        if (window.deviceIsReady) {
            console.log("Cordova Device is Ready");
            resolver();
        } else {
            console.log("Cordova Device is not ready yet - recheck in 1 sec");
            setTimeout(() => this.pollDeviceReady(resolver), 1000);
        }
    }


    async componentDidMount() {

        window.addEventListener("resize", this.resizeListener);

        // window.addEventListener('keyboardDidHide', function () {
        //     console.log("keyboard hide")
        //     //this.preventKeyBoardScrollApp()
        // });

        // window.addEventListener('keyboardDidShow', function () {
        //     console.log("keyboard show")
        // });
        const getCurrent = () => {
            if (this.state.menuOpen) {
                return this.state.settingsScroll;
            } if (this.isWords() || this.isSearch() && this.state.categoryId) {
                return this.state.wordScroll;
            } else if (this.isSearch()) {
                return this.state.searchScroll;
            } else if (this.isInfo()) {
                return this.state.infoScroll;
            } else if (this.isAddScreen()) {
                return this.state.addScroll;
            } else {
                return this.state.bodyScroll;
            }
        }
        const setCurrent = (event, { x, y }, overwriteSwipeMode) => {
            console.log("swipe", x, y)
            if (this.isSwipeAllowed() || overwriteSwipeMode) {
                // go up and look for scroll marker
                let container = event.target;
                while (container.getAttribute("scroll-marker") !== "1" && container.parentElement) {
                    container = container.parentElement;
                }
                if (container.getAttribute("scroll-marker") === "1") {
                    const maxScrollX = container.scrollWidth - Math.min(container.offsetWidth, window.innerWidth);
                    const maxScrollY = container.scrollHeight - Math.min(container.offsetHeight, window.innerHeight - 131);
                    if (x > 0) {
                        x = 0;
                    }
                    if (y > 0) {
                        y = 0;
                    }
                    x = Math.max(x, -maxScrollX);
                    y = Math.max(y, -maxScrollY);
                    //console.log("max scroll",  maxScrollY, container.scrollHeight - Math.min(container.offsetHeight, window.innerHeight - 131))
                    // if (x !== 0 && x < window.innerWidth - container.scrollWidth) {
                    //     x = window.innerWidth - container.scrollWidth;
                    // }

                    // if (y !== 0 && y < window.innerHeight - container.scrollHeight - 131) {
                    //     y = window.innerHeight - container.scrollHeight - 131;
                    // } else {
                    //     console.log("poo")
                    // }
                }


                const newScrollX = { x, y: 0 };
                const newScrollY = { x: 0, y };
                if (this.state.menuOpen) {
                    this.setState({ settingsScroll: newScrollY });
                } else if (this.isWords() || this.isSearch() && this.state.categoryId) {
                    this.setState({ wordScroll: { x, y } });
                } else if (this.isSearch()) {
                    this.setState({ searchScroll: newScrollX });
                } else if (this.isInfo()) {
                    this.setState({ infoScroll: newScrollY });
                } else if (this.isAddScreen()) {
                    this.setState({ addScroll: newScrollY });
                } else {
                    this.setState({ bodyScroll: IssieBase.isMobile() ? newScrollY : newScrollX });
                }
            }
        }

        document.swipeHandler = {
            getCurrent,
            setCurrent,
            moveButton: (toRight) => {
                const elems = document.getElementsByClassName("scrollable");
                if (elems.length === 1) {
                    const curr = getCurrent();
                    const absInc = (window.innerWidth - 150)
                    const inc = toRight ? -absInc : absInc;
                    setCurrent({ target: elems[0] }, { x: curr.x + inc, y: curr.y }, true);
                }
            },
        }
        window.goBack = () => this.goBack();
        let lang = getLanguage();
        setLanguage(lang, false)

        const showOwnFoldersFirst = isMyIssieSign() || getBooleanSettingKey(SHOW_OWN_FOLDERS_FIRST_KEY, true);

        const pubsub = new PubSub()
        console.log("Loading settings..");
        const appType = getPersistedAppType();
        const assetsState = getSettingKey(ISSIE_SIGN_ASSETS_STATE, AssetsState.UNINITIALIZED);

        console.log("App type", appType, "AssetsState", assetsState);

        const contentMap = getContentMap(appType);
        await this.waitForDeviceReady();
        this.deviceReady();

        if ((appType == AppType.IssieSign || appType == AppType.IssieSignArabic) && assetsState + "" == AssetsState.UNINITIALIZED) {
            this.loadAssets();
        } else {
            console.log("Persisted assets state:", assetsState)
        }

        await FileSystem.get().init(contentMap, appType, pubsub, showOwnFoldersFirst).then(() => this.setState({ fs: FileSystem.get() }));

        const shareCart = new ShareCart();

        this.setState({
            allowSwipe: getBooleanSettingKey(ALLOW_SWIPE_KEY, false),
            allowAddWord: isMyIssieSign() || getBooleanSettingKey(ALLOW_ADD_KEY, true),
            showOwnFoldersFirst,
            adultMode: getBooleanSettingKey(ADULT_MODE_KEY, false),
            language: lang,
            pubSub: pubsub,
            busy: false,
            settingsScroll: SCROLL_RESET,
            bodyScroll: SCROLL_RESET,
            wordScroll: SCROLL_RESET,
            searchScroll: SCROLL_RESET,
            infoScroll: SCROLL_RESET,
            addScroll:  SCROLL_RESET,
            shareCart,

            slideupMenuOpen: false,
            reload: 0,
            assetsState,
            appType,
            contentMap,
        }, () => !isBrowser() && navigator.splashscreen.hide());
        pubsub.subscribe((args) => this.getEvents(args));

        window.importWords = (url) => {
            trace("App: Importing words");

            pubsub.publish({ command: 'long-process', msg: translate("ImportWords") });
            setTimeout(() => shareCart.importWords(url).then(
                (result) => {
                    pubsub.refresh();
                    let message = translate("ImportWordsCompleted");

                    if (result.newWords.length > 0) {
                        message += "\n" + translate("AddedWords") + ":\n" +
                            result.newWords.join("\n")
                    }

                    if (result.alreadyExistingWords.length > 0) {
                        message += "\n" + translate("AlreadyExistingWords") + ":\n" +
                            result.alreadyExistingWords.join("\n")
                    }

                    this.props.alert.success(message);
                },
                (err) => {
                    this.props.alert.error(fTranslate("ImportWordsErr", JSON.stringify(err)));
                    console.log(fTranslate("ImportWordsErr", JSON.stringify(err)));
                }
            ).finally(() => pubsub.publish({ command: 'long-process-done' })), 50);
        }

        if (window.awaitingImport) {
            setTimeout(() => {
                window.importWords(window.awaitingImport);
                window.awaitingImport = undefined;

            }, 100);
        }

    }

    loadAssets() {
        console.log("Load assets on demand")
        if (isBrowser()) return;

        this.setState({ assetsState: AssetsState.LOADING })

        if (os == "Android") {
            window.PlayAssets.initPlayAssets(["issiesign_assets", "issiesign_assets3"])
        } else {
            window.PlayAssets.initPlayAssets(["Hebrew-IL1", "Hebrew-IL2"]);
        }
        this.monitorAssetsLoading();
    }

    monitorAssetsLoading() {
        window.PlayAssets.getPlayAssets((assets) => {
            console.log("assets info", JSON.stringify(assets));
            if (assets && assets.ready && assets.assets.length === 2) {
                if (window.isAndroid) {
                    if (assets.assets[0].name === "issiesign_assets") {
                        document.basePath = "__cdvfile_root__" + assets.assets[0].path + "/";
                        document.basePath2 = "__cdvfile_root__" + assets.assets[1].path + "/";
                    } else {
                        document.basePath = "__cdvfile_root__" + assets.assets[1].path + "/";
                        document.basePath2 = "__cdvfile_root__" + assets.assets[0].path + "/";
                    }
                } else {
                    document.basePath = assets.assets[0].path;
                    document.basePath2 = assets.assets[1].path;
                }

                this.setState({ assetsState: AssetsState.READY, busy: false, progress: undefined });
            } else if (assets) {
                this.setState({
                    busy: true,
                    showProgress: true,
                    progress: assets.downloadPercent,
                    progressText: `${assets.downloadPercent || 0}%`,
                    busyText: fTranslate("LoadingMedia", assets.fileIndex, 2)
                });
                console.log("Loading Assets...not ready, recheck in 1.5 sec", document.fileIndex, assets.downloadPercent);
                setTimeout(() => this.monitorAssetsLoading(), 1500);
            }
        });
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
                title: App.isHome(props) ? translate(getAppName()) : state.title,
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
                    this.setState({ categoryId: args.categoryId })
                    trace("Set Category: catId:" + args.categoryId)
                }
                break;
            case 'set-themeId':
                if (args.themeId !== this.state.theme) {
                    this.setState({ theme: args.themeId })
                    trace("Set Theme ID:" + args.themeId);
                }
                break;
            case 'set-title':
                if (args.title !== this.state.title) {
                    console.log("Set title", args.title, this.state.title)
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
                this.setState({ busy: args.active === true, busyText: args.active ? args.text : undefined, showProgress: undefined });
                break;
            case 'long-process':
                this.setState({ longProcess: { msg: args.msg, icon: args.icon } });
                break;
            case 'long-process-done':
                this.setState({ longProcess: undefined });
                break;
            case 'open-slideup-menu':
                this.setState({ slideupMenuOpen: true, slideupMenuProps: args.props });
                break;
            case 'set-current-word':
                this.setTitle(args.title)
            // this.setState({
            //     FavoriteInfo: {
            //         categoryId: args.categoryId, title: args.title,
            //         isFavorite: args.isFavorite,
            //     }
            // });

            default:
        }
    }

    handleSearch(e) {
        trace("Search: " + e.target.value);
        this.setState({ searchStr: e.target.value });
        e.persist()
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout)
        }

        this.searchTimeout = setTimeout(() => {
            const searchStr = this.state.searchStr;
            if (searchStr.length > 1 && !this.isSearch()) {
                this.props.history.push(SEARCH_PATH);
                const newState = { bodyScroll: SCROLL_RESET };
                newState.searchInWords = this.isWords();

                this.setState(newState);
            } else if (searchStr.length < 2 && this.isSearch()) {
                this.goBack(true);
                console.log("goback")
            }
            //setTimeout(this.preventKeyBoardScrollApp, 50);
        }, 250);

    }

    handleMenuClick() {
        let newState = !this.state.menuOpen
        this.setState({ menuOpen: newState, settingsScroll: SCROLL_RESET });
    }

    handleNewClick() {
        if (App.isHome(this.props)) {
            this.props.history.push("/add-category");
        } else if (this.isWords()) {
            this.props.history.push("/add-word/" + encodeURIComponent(this.state.categoryId));
        }
    }

    closeSettings() {
        this.setState({ menuOpen: false, settingsScroll: SCROLL_RESET });
    }

    goBack(skipSearch) {
        if (this.isWords()) {
            //reset words position
            this.setState({ wordScroll: SCROLL_RESET, categoryId: undefined });
        }

        if (this.isSearch()) {
            const newState = { searchScroll: SCROLL_RESET, wordScroll: SCROLL_RESET }

            if (!this.state.searchInWords) {
                console.log("clean catID")
                newState.categoryId = undefined;
            }

            this.setState(newState);
            if (!skipSearch) {
                setTimeout(() => this.setState({ searchStr: "" }), 100);
            }
            setTimeout(this.preventKeyBoardScrollApp, 100)
        }
        this.props.history.goBack();
    }

    ScrollLeft(e) {
        document.swipeHandler.moveButton(false);
    }

    ScrollRight(e) {
        document.swipeHandler.moveButton(true);
    }

    showInfo() {
        this.setState({ menuOpen: false });
        this.props.history.push('/info');
    }

    isSwipeAllowed = () => {
        return (IssieBase.isMobile() || this.isInfo() || this.state.allowSwipe || (this.state.adultMode && this.isWords()) || this.state.menuOpen);
    }

    onFavoriteToggle = (categoryId, title, changeToOn) => {
        FileSystem.get().addRemoveFavorites(
            categoryId,
            title,
            //add or remove
            changeToOn

        ).then(() => {
            // force re-render
            this.setState({ reload: this.state.reload + 1 });
            this.props.alert.success(translate("InfoSavedSuccessfully"))
        });
    };

    preventKeyBoardScrollApp = () => {
        //e.preventDefault(); e.stopPropagation();
        window.scrollTo(0, 0);
    }

    handleAppTypeChange = (appType) => {
        console.log("App type selected ", appType)
        if (this.state.appType === AppType.UNINITIALIZED || appType !== AppType.MyIssieSign) {
            // sets also the default language
            if (appType == AppType.IssieSign) {
                setLanguage("he", true);
            } else if (appType == AppType.IssieSignArabic) {
                setLanguage("ar", true);
            } else {
                setLanguage("en", true);
            }
        }

        saveAppType(appType);


        this.state.shareCart.clear();

        if (appType == AppType.IssieSign && this.state.assetsState + "" == AssetsState.UNINITIALIZED) {
            this.loadAssets();
        }

        const contentMap = getContentMap(appType);
        this.state.fs.init(contentMap, appType, this.state.pubsub, this.state.showOwnFoldersFirst).then(() =>
            this.setState({ appType, contentMap, title: translate(getAppName()) })
        );
    }

    render() {
        // console.log(render, JSON.stringify(this.state))
        if (this.state.appType + "" == AppType.UNINITIALIZED) {
            return <AppTypeSelection
                onType={(appType) => this.handleAppTypeChange(appType)}
            />;
        }


        let path = this.props.history.path;
        //console.log("sett scroll", this.state.settingsScroll?.x, this.state.settingsScroll?.y)
        //console.log("render app")
        let leftArrow = "";
        let rightArrow = "";

        let backElement = App.isHome(this.props) ? null : <BackButton className="f" slot="top-bar" onClick={() => this.goBack()} />
        let searchInput = "";

        // let deleteButton = this.state.showDelete ?
        //     <TrashButton slot="top-bar" onClick={this.state.showDelete} /> : null;
        document.preventTouch = true;

        if (!this.isInfo() && !this.isVideo() && !this.isAddScreen() && !this.isShareScreen()) {
            //const paddingInlineEnd = this.state.editMode ? 120 : undefined;
            const secondRow = window.innerWidth < 650;
            const secondRowSideLocation = this.state.editMode ?
                (isRTL() ? { right: 0 } : { left: 0 }) : { left: "calc(50% - 75px)" };
            const shouldCenter2ndRow = !this.state.editMode && window.innerWidth < 650;
            searchInput = (
                <div slot="top-bar" className={"search " + (secondRow ? "" : " e")}
                    style={secondRow ? { position: "absolute", top: 52, ...secondRowSideLocation }
                        : undefined}
                //style={isRTL() ? { right: 0, paddingInlineEnd } : { left: 0, paddingInlineEnd }}
                >
                    <input
                        key="searchInput"
                        type="search" onChange={this.handleSearch}
                        onFocus={this.preventKeyBoardScrollApp} value={this.state.searchStr || ""} />
                </div>)
        }

        if (!this.isSwipeAllowed() && !this.isShareScreen() &&
            (!this.isAddScreen() && !this.isVideo() && (
                this.isWords() && !this.state.adultMode) ||
                this.isSearch() ||
                App.isHome(this.props))) {
            leftArrow = <NextButton slot="next" onClick={this.ScrollRight} id="scrolRight" />
            rightArrow = <PrevButton slot="prev" onClick={this.ScrollLeft} id="scrollLeft" />
        }

        const collapseHeader = (IssieBase.isMobile() && IssieBase.isLandscape() && (this.isVideo() ||
            this.state.adultMode && this.isWords()))

        let overFlowX = this.state.dimensions.overFlowX;
        if (this.isSearch() || this.isWords()) {
            overFlowX = 'visible';
        }

        // console.log("catID", this.state.categoryId)
        const showAdd = this.state.allowAddWord && (App.isHome(this.props) ||
            (this.isWords() && this.state.categoryId !== FileSystem.FAVORITES_NAME && this.state.categoryId !== FileSystem.TUTORIAL_NAME)) &&
            this.state.editMode && !this.isVideo();

        return (
            <div className="App" style={getLanguage() == "he" ? { fontFamily: "ArialMT" } : {}} >

                {<SlideupMenu
                    {...this.state.slideupMenuProps}
                    height={(this.state.slideupMenuOpen ? this.state.slideupMenuProps.height || 350 : 0)}
                    dimensions={this.state.dimensions}
                    onClose={() => this.setState({ slideupMenuOpen: false })} />}

                {/**Word Info */
                    this.state.showEntityInfo && <ShareInfo
                        pubSub={this.state.pubSub}
                        onClose={() => this.setState({ showEntityInfo: undefined })}
                        fullName={this.state.showEntityInfo}
                    />
                }



                {/** Busy Message */}
                {this.state.busy && <BusyMsg
                    showProgress={this.state.showProgress}
                    progress={this.state.progress}
                    progressText={this.state.progressText}
                    text={this.state.busyText}

                />}
                <Shell
                    collapseHeader={collapseHeader}
                    projectorsOff={this.isVideo() ||
                        this.isAddScreen() ||
                        ((this.isWords() || this.isSearch() && this.state.categoryId) && this.state.adultMode)
                    } theme={App.isHome(this.props) ? "blue" : getThemeName(this.state.theme)} id="page1" isMobile={IssieBase.isMobile()}>

                    <EditButton
                        slot="top-bar"
                        className="a"
                        selected={this.state.editMode}
                        onChange={(select) => {
                            this.setState({ editMode: select })
                        }}


                    />


                    {this.state.editMode && !this.isAddScreen() && <SettingsButton slot="top-bar" className="b" onClick={() => this.handleMenuClick()} />}

                    {showAdd && <AddButton slot="top-bar" className="c"
                        addFolder={App.isHome(this.props)}
                        onClick={() => this.handleNewClick()} color='white'
                    />
                    }

                    <div slot="center-bar" className="shelltitle">{this.state.title}</div>
                    {searchInput}
                    {leftArrow}
                    {rightArrow}
                    {backElement}

                    {this.state.editMode &&
                        !this.isShareScreen() && !this.isAddScreen() && (!this.isVideo() || this.state.adultMode) &&
                        <ShareCartButton slot="top-bar" className={showAdd ? "d" : "c"}
                            count={this.state?.shareCart?.count()}
                            onClick={() => this.props.history.push("/share-cart")} />}

                    {this.state.menuOpen && <Settings
                        slot="body"
                        isMobile={IssieBase.isMobile()}
                        isLandscape={IssieBase.isLandscape()}
                        state={this.state}
                        setState={(obj => this.setState(obj))}
                        onClose={() => this.setState({ menuOpen: false })}
                        showInfo={() => this.showInfo()}
                        pubSub={this.state.pubSub}
                        scroll={this.state.settingsScroll}
                        appType={this.state.appType}
                        onChangeAppType={(appType) => this.handleAppTypeChange(appType)}
                        contentMap={this.state.contentMap}
                    />}

                    {/** long process */
                        this.state.longProcess &&
                        <div slot="body" className="longProcessHost">
                            {this.state.longProcess?.msg}
                            <Sync className="rotate" />
                        </div>
                    }

                    <div slot="body" className="theBody" style={{
                        paddingLeft: this.shellPadding,
                        paddingRight: this.shellPadding,
                        overflowX: overFlowX
                    }}>

                        {this.getChildren(path, this.props, this.state, this.setState)}
                    </div>
                </Shell>

            </div >
        );
    }

    getChildren(path) {
        //console.log("get children, path", path)
        if (path === "/" || path === "") {
            setTimeout(() => this.setTitle(translate(getAppName(this.state.appType))), 10);

            return <Body
                categories={FileSystem.get().getCategories()}
                allowAddWord={this.state.allowAddWord}
                showOwnFoldersFirst={this.state.showOwnFoldersFirst}
                isLandscape={IssieBase.isLandscape()}
                isMobile={IssieBase.isMobile()}
                pubSub={this.state.pubSub}
                editMode={this.state.editMode}
                shareCart={this.state.shareCart}
                dimensions={this.state.dimensions}
                allowSwipe={this.isSwipeAllowed()}
                scroll={this.state.bodyScroll}
            />
        }
        if (path === SEARCH_PATH) {
            const categories = FileSystem.get().getCategories();
            const words = this.state.categoryId ?
                categories.find(cat => cat.name == this.state.categoryId)?.words :
                FileSystem.get().getAllWords();
            console.log("search themeId", this.state.theme)
            return <Search
                words={words}
                categories={categories}
                currentCategory={this.state.categoryId}
                isMobile={IssieBase.isMobile()}
                searchStr={this.state.searchStr}
                dimensions={this.state.dimensions}
                allowSwipe={this.isSwipeAllowed()}
                scroll={this.state.searchScroll}
                wordScroll={this.state.wordScroll}
                pubSub={this.state.pubSub}
                themeId={this.state.theme}
                adultMode={this.state.adultMode}
            />
        }

        if (path === "/share-cart") {
            this.setTitle(translate("ShareCartTitle"));

            return <ShareCartUI
                pubSub={this.state.pubSub}
                shareCart={this.state.shareCart}
            />
        }

        if (path.startsWith("/word/")) {
            //:categoryId/:title
            const [categoryId, title] = splitAndDecodeCompoundName(path.substr(6));
            const cat = FileSystem.get().getCategories().find(c => c.name === categoryId);

            this.setTitle(cat?.translate ? translate(title) : title);

            const themeId = cat && (cat.userContent && cat.themeId ? cat.themeId : getTheme(cat.id))
            const words = cat?.words || [];

            const wordProps = {
                pubSub: this.state.pubSub,
                editMode: this.state.editMode,
                shareCart: this.state.shareCart,
                isMobile: IssieBase.isMobile(),
                isLandscape: IssieBase.isLandscape(),
                allowSwipe: this.isSwipeAllowed(),
                allowAddWord: this.state.allowAddWord,
                words,
                categoryId,
                themeId,
                scroll: this.state.wordScroll,
                onFavoriteToggle: this.onFavoriteToggle,
                adultMode: this.state.adultMode,
                setScrolls: (x, y) => this.setState({ wordScroll: { x, y } }),
            }
            return (<Word2 {...wordProps} />);
        }

        if (path.startsWith("/video/")) {
            //:videoName/:categoryId/:title/:filePath
            //or
            //file      /:categoryId/:title/:filePath
            const [videoName, categoryId, title, filePath] = splitAndDecodeCompoundName(path.substr(7));

            const cat = FileSystem.get().getCategories().find(c => c.name === categoryId);
            const word = cat?.words.find(w => w.name === title);
            const isFavorite = word?.favorite;

            this.setTitle((word && word.translate) ? translate(title) : title);

            return (
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                    <Video {...this.props}
                        isFavorite={isFavorite}
                        onFavoriteToggle={this.onFavoriteToggle}
                        goBack={() => this.goBack()}
                        categoryId={categoryId}
                        isLandscape={IssieBase.isLandscape()}
                        isMobile={IssieBase.isMobile()}
                        videoName={videoName}
                        title={title}
                        filePath={filePath ? decodeURIComponent(filePath) : ""}
                        headerSize={headerSize}
                    />
                </div>)
        }

        if (path.startsWith("/info")) {
            this.setTitle(translate("TitleAbout"))
            switch (getAppName()) {
                case "IssieSign": return <Info scroll={this.state.infoScroll} />;
                case "IssieSignArabic": return <InfoArabic scroll={this.state.infoScroll} />;
                case "MyIssieSign": return <InfoMyIssieSign scroll={this.state.infoScroll} />;
                default: return null;
            }
        }
        if (path.startsWith("/add-category")) {
            //add-category [/:categoryId]
            const [categoryId] = splitAndDecodeCompoundName(path.substr(14));


            this.setTitle(categoryId?.length > 0 ? translate("TitleEditCategory") : translate("TitleAddCategory"));
            return (
                <AddEditItem
                    history={this.props.history}
                    addWord={false}
                    pubSub={this.state.pubSub}
                    categoryId={categoryId?.length > 0 ? categoryId : undefined}
                    isLandscape={IssieBase.isLandscape()}
                    dimensions={this.state.dimensions}
                    scroll={this.state.addScroll}
                />

            )
        }



        if (path.startsWith("/add-word/")) {
            //add-word/:categoryId [/?:wordId]
            const [categoryId, wordId] = splitAndDecodeCompoundName(path.substr(10));
            const cat = FileSystem.get().getCategories().find(c => c.name === categoryId)
            const themeId = cat.userContent && cat.themeId ? cat.themeId : getTheme(cat.id);
            this.setTitle(wordId?.length > 0 ? translate("TitleEditWord") : translate("TitleAddWord"))
            return (
                <AddEditItem
                    addWord={true}
                    wordId={wordId}
                    history={this.props.history}
                    pubSub={this.state.pubSub}
                    isLandscape={IssieBase.isLandscape()}
                    categoryId={categoryId}
                    themeId={themeId}
                    dimensions={this.state.dimensions}
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
        return this.props.history.path.startsWith("/video/")
        //  ||
        //     (this.props.history.path.startsWith("/word/") && this.state.adultMode);
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