import { isBrowser } from './Utils'

const DEFAULT_LANG = "he";
let gPrefix = "";
let gLang = "he"

var strings = {
    "he": {
        "AppTitle": "שפת הסימנים",
        "SettingsLanguage": "שפה",
        "SettingsSwipe": "החלקה",
        "SettingsTitle": "הגדרות",
        "Working": "עובד על זה...",
        "ImportWords": "מייבא מילים...",
        "NewWords": "מילים חדשות",
        "TitleAbout": "עלינו - About us",
        "SettingsAbout": "עלינו - About us",
        "SettingsEdit": "עריכה",
        "SettingsAddCatAndWords": "הוספת/מחיקת קטגוריות ומילים",
        "TitleAddCategory": "הוספת קטגוריה",
        "TitleAddWord": "הוספת מילה",


        //confirm messages
        "ConfirmTitleDeleteCategory": "מחיקת תיקיה",
        "ConfirmDeleteCategoryMessage": "מחיקת תיקיה תמחק גם את כל המילים שבתוכה. האם למחוק את התיקיה '{1}'?",
        "ConfirmTitleDeleteWord": "מחיקת מילה",
        "ConfirmDeleteWordMessage": "האם למחוק את המילה '{1}'?",

        "BtnYes": "כן",
        "BtnCancel": "בטל",
        "BtnSave": "שמור",

        "InfoDeleteCanceled": "מחיקה בוטלה",
        "InfoDeleteSucceeded": "מחיקה בוצעה",
        "InfoDeleteFailed": "מחיקה נכשלה",
        "InfoSavedSuccessfully": "נשמר בהצלחה",
        "MissingImageAlt": "ללא תמונה",
        "InfoSharingWords": "משתף מילים...",
        "InfoSharingCategory": "משתף קטגוריה...",
        "InfoSharingFailed": "שיתוף נכשל",
        "ShareWords": "שיתוף מילים",


        "AddVideoSelected": "נבחר וידאו עבור המילה",
        "AddImageSelected": "נבחרה תמונה",
        "AddPlaceholderWordName": "שם המילה",
        "AddPlaceholderCategoryName": "שם הקטגוריה",
        "AddPlaceholderSelectImage": "בחר צלמית",
        "AddPlaceholderSelectVideo": "בחר סירטון",
        "AddLoadingCamera": "טוען מצלמה...",
        "AddTakePictureFailedOrCanceled": "צילום נכשל או בוטל",
        "AddLoadingCameraRoll": "טוען...",
        "AddLoadPictureFailedOrCanceled": "טעינת תמונה נכשלה או בוטלה",

        "AddLoadVideoCameraFailedOrCanceled": "צילום וידאו נכשל או בוטל",
        "AddLoadVideoFailedOrCanceled": "טעינת סרטון בוטלה או נכשלה",
    },
    "ar": {
        "AppTitle": "لغة الإشارة",
        "SettingsTitle": "اعدادات",
    }
}

var currStrings = strings[DEFAULT_LANG];

export function setLanguage(lang) {

    currStrings = strings[lang];
    gLang = lang;
    if (!currStrings) {
        currStrings = strings[DEFAULT_LANG];
        gLang = DEFAULT_LANG;
    }

    if (isBrowser()) {
        gPrefix = "."
    }
}

export function isRTL() {
    return gLang === "he" || gLang === "ar"
}

export function translate(id, ...args) {
    let s = currStrings[id];
    if (!s) {
        //not found, defaults to default lang
        s = strings[DEFAULT_LANG][id];
        if (!s) {
            s = gPrefix + id;
        } else {
            s = gPrefix + s;
        }
    }

    return gPrefix + s;
}

export function fTranslate(id, ...args) {
    return replaceArgs(translate(id), args);
}

function replaceArgs(s, args) {
    return s.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number - 1] != 'undefined'
            ? args[number - 1]
            : match
            ;
    });
}