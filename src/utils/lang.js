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
        "SettingsAdultMode":"מצב מבוגרים",
        "SettingsAdultModeLbl":"תצוגה מותאמת למבוגרים",
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
        
        "RestartApp"  :"קבצי המדיה עדיין בטעינה, מומלץ לסגור את היישום ולנסות שוב בעוד מספר דקות",
        "LoadingMedia": "קבצי המדיה בטעינה ({1} מתוך {2})"
     },
    "ar": {
        "AppTitle": "لغة الإشارة",
        "SettingsLanguage": "اللغة",
        "SettingsSwipe": "السحب",
        "SettingsTitle": "اعدادات",
        "Working": "قيد التحضير...",
        "ImportWords": "يتم استيراد الكلمات.. ",
        "NewWords": "كلمات جديدة",
        "TitleAbout": "من نحن ",
        "SettingsAbout": "تعرف علينا",
        "SettingsEdit": "تحرير",
        "SettingsAddCatAndWords": "اضافه/ازالة مجموعات وكلمات",
        "TitleAddCategory": "اضافة مجموعة",
        "TitleAddWord": "اضافة كلمة",


        //confirm messages
        "ConfirmTitleDeleteCategory": "حذف مجموعة",
        "ConfirmDeleteCategoryMessage": "عند حذف المجموعه سيتم حذف جميع الكلمات الموجوده داخلها، هل تريد حذف المجموعة؟ '{1}'?",
        "ConfirmTitleDeleteWord": "حذف كلمة",
        "ConfirmDeleteWordMessage": "هل تريد حذف الكلمة؟ '{1}'?",

        "BtnYes": "نعم",
        "BtnCancel": "الغاء",
        "BtnSave": "حفظ",

        "InfoDeleteCanceled": "تم الغاء الحذف",
        "InfoDeleteSucceeded": "تم الحذف بنجاح",
        "InfoDeleteFailed": "فشل الحذف",
        "InfoSavedSuccessfully": "تم الحفظ بنجاح",
        "MissingImageAlt": "بدون صورة",
        "InfoSharingWords": "مشاركة كلمات...",
        "InfoSharingCategory": "مشاركة مجموعة...",
        "InfoSharingFailed": "فشلت المشاركة",
        "ShareWords": "مشاركة كلمات",


        "AddVideoSelected": "تم اختيار الفيديو ",
        "AddImageSelected": "تم اختيار الصورة",
        "AddPlaceholderWordName": "اسم الكلمة",
        "AddPlaceholderCategoryName": "اسم المجموعة",
        "AddPlaceholderSelectImage": "اختر صورة غلاف",
        "AddPlaceholderSelectVideo": "اختر فيديو",
        "AddLoadingCamera": "يتم تحضيرالكاميرا...",
        "AddTakePictureFailedOrCanceled": "فشل او الغاء التصوير",
        "AddLoadingCameraRoll": "تحميل...",
        "AddLoadPictureFailedOrCanceled": "فشل او الغاء تحميل الصورة",

        "AddLoadVideoCameraFailedOrCanceled": "فشل او الغاء تصوير الفيديو",
        "AddLoadVideoFailedOrCanceled": "فشل او الغاء تحميل الفيديو",
        
        "RestartApp"  :" الملفات قيد التحميل، مفضل اغلاق التطبيق واعادة المحاولة بعد عدة دقائق",
        "LoadingMedia": "يتم تحميل الملفات ({1} מתוך {2})"
    }, 
    "en": {
        "AppTitle": "My IssieSign",
        "SettingsLanguage": "Language",
        "SettingsSwipe": "Swipe",
        "SettingsTitle": "Settings",
        "Working": "In Progress...",
        "ImportWords": "Importing words...",
        "NewWords": "New Words",
        "TitleAbout": "About us",
        "SettingsAbout": "About us",
        "SettingsEdit": "Edit",
        "SettingsAdultMode":"Adult mode",
        "SettingsAdultModeLbl":"Adult adapted display",
        "SettingsAddCatAndWords": "Add/Delete Categories and Words",
        "TitleAddCategory": "Add Category",
        "TitleAddWord": "Add Word",


        //confirm messages
        "ConfirmTitleDeleteCategory": "Delete Category",
        "ConfirmDeleteCategoryMessage": "Deleting a category will also delete all words in it. Delete '{1}'?",
        "ConfirmTitleDeleteWord": "Delete Word",
        "ConfirmDeleteWordMessage": "Deleting word '{1}'. Are you sure?",

        "BtnYes": "Yes",
        "BtnCancel": "Cancel",
        "BtnSave": "Save",

        "BtnSearchGo": "Go",

        "InfoDeleteCanceled": "Delete cancelled",
        "InfoDeleteSucceeded": "Successfully deleted",
        "InfoDeleteFailed": "Delete failed",
        "InfoSavedSuccessfully": "Successfully saved",
        "MissingImageAlt": "Missing image",
        "InfoSharingWords": "Sharing words...",
        "InfoSharingCategory": "Sharing category...",
        "InfoSharingFailed": "Share failed",
        "ShareWords": "Share Words",


        "AddVideoSelected": "Video is selected",
        "AddImageSelected": "Image is selected",
        "AddPlaceholderWordName": "Word name",
        "AddPlaceholderCategoryName": "Category name",
        "AddPlaceholderSelectImage": "Select image",
        "AddPlaceholderSelectVideo": "Select video",
        "AddLoadingCamera": "Loading camera...",
        "AddTakePictureFailedOrCanceled": "Taking photo failed or cancelled",
        "AddLoadingCameraRoll": "Loading...",
        "AddLoadPictureFailedOrCanceled": "Loafing image failed or cancelled",

        "AddLoadVideoCameraFailedOrCanceled": "Shoting video failed or cancelled",
        "AddLoadVideoFailedOrCanceled": "Loading video failed or cancelled",
        
        "RestartApp"  :"Media files are loading, please close the App and retry later",
        "LoadingMedia": "Media files are loading ({1} of {2})"
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

export function getLanguage() {
    return gLang;
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