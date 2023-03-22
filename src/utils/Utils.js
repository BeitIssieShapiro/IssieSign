import { AppName, gCurrentLanguage } from '../current-language';

export var wordsTranslateX = 0;
export var rootTranslateX = 0;
export const ALLOW_SWIPE_KEY = "IssieSign_Settings_AllowSwipe";
export const ADULT_MODE_KEY = "IssieSign_Settings_AdultMode";

export const ALLOW_ADD_KEY = "IssieSign_Settings_AllowAdd";
export const SHOW_OWN_FOLDERS_FIRST_KEY = "IssieSign_Settings_ShowOwnFoldersFirst";
export const LANG_KEY = "MyIssieSign_Settings_Lang";
//export const HIDE_TUTORIAL_KEY = "MyIssieSign_Settings_Hide_Tutorial";

export const HIDDEN_FOLDERS_KEY = "MyIssieSign_Settings_Hiden_Folders";


export function isBrowser() {
    return window.isBrowser;
}

export function isMyIssieSign() {
    return AppName == "MyIssieSign";
}

export function getAppName() {
    return AppName;
}


export function trace(a, ...optionalParams) {
    console.log(a, ...optionalParams);
}

export function getLanguage() {
    let value = window.localStorage.getItem(LANG_KEY);
    if (!value) {
        return gCurrentLanguage;
    }
    return value;
}

export function saveSettingKey(key, value) {
    window.localStorage.setItem(key, value);
}

export function getBooleanSettingKey(key, defaultVal) {
    let value = window.localStorage.getItem(key);

    if (value) {
        if (typeof value === "boolean") {
            return value;
        } else {
            return (value.toLowerCase() === "true");
        }
    }
    return Boolean(defaultVal);
}


export function calcWidth(elementCount, windowHeight, windowWidth, tileH, tileW, isMobile, inSearch) {
    if (isMobile) {
        //scroll vertically by touch
        let cols = Math.max(Math.floor((windowWidth) / tileW), 2);
        console.log("calcWidth: mobile", windowWidth, tileW, + Math.floor(windowWidth / tileW) + "cols: " + cols);
        return cols * (tileW * 1.05);
    }

    let rows = Math.max(Math.floor((windowHeight - 153) / tileH), 1);
    if (inSearch) {
        rows = Math.max(rows - 1, 1);
    }
    let cols = Math.ceil(elementCount / rows);
    return cols * tileW;
}

//exluded: 8,12,20,14,6
var themes = [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 13, 15, 16, 17, 18, 19, 21, 22, 23];



export const getTheme = (categoryID) => {
    let mapIndex = hashId(categoryID, themes.length);
    return themes[mapIndex];
}

export function getThemeName(themeId) {
    return themeId === "blue"?"blue":"flavor-"+themeId;
}

export function getAvailableThemes() {
    return themes;
}

function hashId(id, themeCount) {
    if (!isNaN(id)) {
        return (Number(id) - 1) % themeCount;
    }

    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
    }
    return sum % themeCount;
}

export function isMobile() {
    return window.innerHeight < 450 || window.innerWidth < 450;
}

export function isLandscape() {
    return (window.innerWidth > window.innerHeight);
}

export const headerSize = 145;

export const getBooleanFromString = (str) => str && str.length > 0 && str.charCodeAt(0) % 2 === 0
