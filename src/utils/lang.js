import { gCurrentLanguage } from "../current-language";
import { LANG_KEY, isBrowser, saveSettingKey } from "./Utils";

const DEFAULT_LANG = "he";
let gPrefix = "";
let gLang = gCurrentLanguage;

var strings = {
  he: {
    IssieSign: "שפת הסימנים",
    MyIssieSign: "הסימנים שלי",
    SettingsLanguage: "שפה",
    SettingsSwipe: "מצב דפדוף",
    NavByArrow: "חיצים",
    NavBySwipe: "החלקה",
    Yes: "כן",
    No: "לא",

    SettingsTitle: "הגדרות",
    Working: "עובד על זה...",
    ImportWordsCompleted: "יבוא מילים הסתיים",
    ImportWords: "מייבא מילים...",
    AddedWords: "מילים שנוספו",
    AlreadyExistingWords: "מילים שכבר היו",
    NewWords: "מילים חדשות",
    TitleAbout: "אודות - About us",
    SettingsAbout: "אודות - About us",
    SettingsEdit: "עריכה",
    SettingsWordsListMode: "מצב תצוגת תיקיה",
    WordsListAndPreview: "רשימה + וידאו",
    WordsTiles: "משבצות",
    WordsList: "רשימה",
    SettingsAddCatAndWords: "הוספת/מחיקת תיקיות ומילים",
    TitleAddCategory: "הוספת תיקיה",
    TitleEditCategory: "עריכת תיקיה",
    TitleAddWord: "הוספת מילה",
    TitleEditWord: "עריכת מילה",

    //confirm messages
    ConfirmTitleDeleteCategory: "מחיקת תיקיה",
    ConfirmDeleteCategoryMessage:
      "מחיקת תיקיה תמחק גם את כל המילים שבתוכה. האם למחוק את התיקיה '{1}'?",
    ConfirmTitleDeleteWord: "מחיקת מילה",
    ConfirmDeleteWordMessage: "האם למחוק את המילה '{1}'?",

    BtnYes: "כן",
    BtnCancel: "בטל",
    BtnSave: "שמור",

    InfoDeleteCanceled: "מחיקה בוטלה",
    InfoDeleteSucceeded: "מחיקה בוצעה",
    InfoDeleteFailed: "מחיקה נכשלה",
    InfoSavedSuccessfully: "נשמר בהצלחה",
    MissingImageAlt: "ללא תמונה",
    InfoSharingWords: "משתף מילים...",
    InfoSharingCategory: "משתף תיקיה...",
    InfoSharingFailed: "שיתוף נכשל",
    ShareWords: "שיתוף מילים",

    sharingAllWords: "כל המילים",
    EmptyShareCart: "עדיין לא נבחרו תיקיות ו/או מילים לשיתוף",
    ShareButton: "שיתוף...",

    //Quick Menu
    AddToShareMenu: "הוספה לרשימת השיתוף",
    RemoveFromShareMenu: "הסרה מרשימת השיתוף",
    EditMenu: "עריכה...",
    DeleteMenu: "מחיקה",
    SelectColorMenuTitle: "בחירת צבע",
    ChangeColor: "בחירת צבע",

    FavoritesCategory: "מועדפים",
    TutorialsCategory: "הדרכה",

    AddVideoSelected: "נבחר וידאו עבור המילה",
    AddImageSelected: "נבחר סמל",
    AddPlaceholderWordName: "שם המילה",
    AddPlaceholderCategoryName: "שם התיקיה",
    AddPlaceholderSelectImage: "בחירת סמל",
    AddPlaceholderSelectVideo: "בחירת סירטון",
    AddLoadingCamera: "טוען מצלמה...",
    AddTakePictureFailedOrCanceled: "צילום נכשל או בוטל",
    AddLoadingCameraRoll: "טוען...",
    AddLoadPictureFailedOrCanceled: "טעינת תמונה נכשלה או בוטלה",

    AddLoadVideoCameraFailedOrCanceled: "צילום וידאו נכשל או בוטל",
    AddLoadVideoFailedOrCanceled: "טעינת סרטון בוטלה או נכשלה",

    RestartApp:
      "קבצי המדיה עדיין בטעינה, מומלץ לסגור את היישום ולנסות שוב בעוד מספר דקות",
    LoadingMedia: "קבצי המדיה בטעינה",

    ImportWordsErr: "שגיאה ביבוא מילים {1}",
    SettingsHideFolder: "הסתרת תיקיית {1}",
    ErrWrongImportFile: "קובץ אינו בפורמט מתאים",
    SearchImageTitle: "חיפוש סמל",
    EnterSearchHere: "הכנס מילות חיפוש",
    BtnSearch: "חפש",
    NoResultsMsg: "לא נמצאו תוצאות",
    SyncToCloudMsg: "סינכרון עם חשבון גוגל דרייב",
    SyncToCloudTitle: "סינכרון לגוגל דרייב",
    ErrSyncFail: "סנכרון נכשל\n {1}",
    SyncStatusNone: "אינו מסונכרן",
    SyncStatusLbl: "מצב סינכרון",
    SyncErrorLbl: "שגיאת סנכרון",
    ShareCartTitle: "רשימת שיתוף",
    ShareCartCategoryColumnTitle: "תיקיה",
    ShareCartWordNameColumnTitle: "מילה",
    ItemRemovedFromShare: "הוסר מרשימת השיתוף",
    ItemAddedToShare: "הוסף לרשימת השיתוף",
    SearchTitle: "חיפוש: {1}",

    ConfirmTitleSyncToServer: "סינכרון המילים לחשבון גוגל דרייב",
    ConfirmMsgSyncToServer:
      "כל המילים יעלו לגוגל דרייב שלך. ולכולן תיקבע הרשאת קריאה בלבד לכל מי שמקבל את הלינק אליהם. אישור?",
    ShareCancelled: "שיתוף בוטל",
    InfoSharingSucceeded: "שיתוף הסתיים בהצלחה",
    InfoSharingFailed: "שיתוף נכשל\n {1}",
    NoWordSelected: "לא נבחרה מילה",
    SettingsConnectedGDrive: "גוגל דרייב",
    NotLoggedIn: "עדיין לא מחובר",
    LoggedIn: "מחובר ל: {1}",
    BtnLogout: "התנתק",
    BtnReconsile: "הסתנכרן",
    ReconsileStarted: "סינכרון החל",
    "in-sync": "מסונכרן",
    ShowOwnCategoriesFirst: "הצג תחילה תיקיות שלך",
    EnterEditMode: "לחץ {1} שניות",
    MissingFolderFileID: "תיקיה {1} אינה מסונכרנת לענן",
    MissingWordFileID: "מילה {1} אינה מסונכרנת לענן",
    __tutorial_overview__: "הכירו את האפליקציה",
    __tutorial_editing__: "הוספה ושיתוף",
    InvalidCharachtersInName: "שם מכיל תווים אסורים",
    SettingsAppType: "בחר אפליקציה",

    AddToFavorite: "הוספה למועדפים",
    RemoveFromFavorite: "הסרה מהמועדפים",
    RemoveFromThisCategory: "הסרת קיצור הדרך",
    AddToAnotherCategory: "הוספת קיצור דרך לקטגוריה אחרת...",
    CategoriesTitle: "הוספה לקטגוריה",
    QuizMode: "מצב חידון",
    Quiz: "חידון",
  },
  ar: {
    IssieSignArabic: "لغة الإشارة",
    MyIssieSign: "إشاراتي",
    SettingsLanguage: "اللغة",
    SettingsSwipe: "السحب",
    SettingsTitle: "اعدادات",
    Working: "قيد التحضير...",
    ImportWords: "يتم استيراد الكلمات.. ",
    NewWords: "كلمات جديدة",
    TitleAbout: "من نحن ",
    SettingsAbout: "تعرف علينا",
    SettingsEdit: "تحرير",

    SettingsAddCatAndWords: "اضافه/ازالة مجموعات وكلمات",
    TitleAddCategory: "اضافة مجموعة",
    TitleAddWord: "اضافة كلمة",

    //confirm messages
    ConfirmTitleDeleteCategory: "حذف مجموعة",
    ConfirmDeleteCategoryMessage:
      "عند حذف المجموعه سيتم حذف جميع الكلمات الموجوده داخلها، هل تريد حذف المجموعة؟ '{1}'?",
    ConfirmTitleDeleteWord: "حذف كلمة",
    ConfirmDeleteWordMessage: "هل تريد حذف الكلمة؟ '{1}'?",

    BtnYes: "نعم",
    BtnCancel: "الغاء",
    BtnSave: "حفظ",

    InfoDeleteCanceled: "تم الغاء الحذف",
    InfoDeleteSucceeded: "تم الحذف بنجاح",
    InfoDeleteFailed: "فشل الحذف",
    InfoSavedSuccessfully: "تم الحفظ بنجاح",
    MissingImageAlt: "بدون صورة",
    InfoSharingWords: "مشاركة كلمات...",
    InfoSharingCategory: "مشاركة مجموعة...",
    InfoSharingFailed: "فشلت المشاركة",
    ShareWords: "مشاركة كلمات",

    AddVideoSelected: "تم اختيار الفيديو ",
    AddImageSelected: "تم اختيار الصورة",
    AddPlaceholderWordName: "اسم الكلمة",
    AddPlaceholderCategoryName: "اسم المجموعة",
    AddPlaceholderSelectImage: "اختر صورة غلاف",
    AddPlaceholderSelectVideo: "اختر فيديو",
    AddLoadingCamera: "يتم تحضيرالكاميرا...",
    AddTakePictureFailedOrCanceled: "فشل او الغاء التصوير",
    AddLoadingCameraRoll: "تحميل...",
    AddLoadPictureFailedOrCanceled: "فشل او الغاء تحميل الصورة",

    AddLoadVideoCameraFailedOrCanceled: "فشل او الغاء تصوير الفيديو",
    AddLoadVideoFailedOrCanceled: "فشل او الغاء تحميل الفيديو",

    RestartApp:
      " الملفات قيد التحميل، مفضل اغلاق التطبيق واعادة المحاولة بعد عدة دقائق",
    LoadingMedia: "يتم تحميل الملفات",
    Yes: "نعم",
    No: "لا",
    SettingsWordsListMode: "طريقة عرض المجموعة",

    WordsListAndPreview: "قائمة",
    WordsTiles: "ايقونات",
    TitleEditCategory: "تحرير مجموعة",
    TitleEditWord: "تحرير كلمة",
    sharingAllWords: "جميع الكلمات",
    EmptyShareCart: "لم يتم اختيار ملفات و /او كلمات للمشاركة",
    ShareButton: "مشاركة...",
    AddToShareMenu: "إضافة الى قائمة المشاركة",
    RemoveFromShareMenu: "إزالة من قائمة المشاركة",
    EditMenu: "تحرير...",
    DeleteMenu: "حذف",
    ImportWordsErr: "خطأ في استيراد الكلمات {1}",
    ErrWrongImportFile: "' صيغة الملف غير مناسبة",
    SearchImageTitle: "بحث عن صورة",
    EnterSearchHere: "ادخل كلمات البحث",
    BtnSearch: "بحث",
    NoResultsMsg: "لا يوجد نتائج للبحث",
    SyncToCloudMsg: "مزامنه مع حساب جوجل درايف",
    SyncToCloudTitle: "تزامن مع جوجل درايف ",
    ErrSyncFail: "فشل التزامن {1}",
    SyncStatusNone: "غير متزامن",
    SyncStatusLbl: "وضع المزامنة",
    SyncErrorLbl: "خطأ في التزامن",
    "in-sync": "في تزامن",
    ShareCartTitle: "قائمة المشاركة",
    ShareCartCategoryColumnTitle: "مجموعة",
    ShareCartWordNameColumnTitle: "كلمة",
    ItemRemovedFromShare: "تمت الازالة من قائمة المشاركة",
    ItemAddedToShare: "إضافة لقائمة المشاركة",
    ConfirmTitleSyncToServer: "مزامنة الكمات مع حساب جوجل درايف",
    ConfirmMsgSyncToServer:
      "سيتم رفع جميع الكلمات لجوجل درايف. الكلمات ستكون متاحة للقراءة فقط لكل من ستتم مشاركة الرابط معه. موافقة?",
    ShareCancelled: "تم الغاء المشاركةל",
    InfoSharingSucceeded: "تمت المشاركة بنجاح",
    NoWordSelected: "لم يتم اختيار كلمه",
    SettingsConnectedGDrive: "جوجل درايف",
    NotLoggedIn: "غير متصل",
    LoggedIn: "متصل مع: {1}",
    BtnLogout: "قطع الاتصال",
    BtnReconsile: "تزامن",
    ReconsileStarted: "بدء التزامن",
    NavByArrow: "أسهم",
    NavBySwipe: "سحب",
    SelectColorMenuTitle: "اختيار لون",
    ChangeColor: "اختيار لون",
    FavoritesCategory: "المفضلة",
    TutorialsCategory: "إرشادات",
    SettingsHideFolder: "إخفاء ملف {1}",
    SearchTitle: "بحث: {1}",
    ImportWordsCompleted: "تم استيراد الكلمات",
    AddedWords: "الكلمات المضافة ",
    AlreadyExistingWords: " الكلمات القائمة",
    ShowOwnCategoriesFirst: " إعرض ملفاتك الخاصة أولا",
    EnterEditMode: "إضغط لمدة {1} ثواني",
    MissingFolderFileID: "لم يتم مزامنه الملف  {1} في  السحابة الالكترونيه",
    MissingWordFileID: "  لم يتم مزامنه الكلمة  {1} في  السحابة الالكترونيه ",
    __tutorial_overview__: "تعرفوا على  التطبيق",
    __tutorial_editing__: "اضافة ومشاركة",
    InvalidCharachtersInName: "  يحتوي إسم الملف على رموز لا يمكن استخدامها ",
    WordsList: "قائمة",
    SettingsAppType: "اختر التطبيق",
    AddToFavorite: "إضافة إلى المفضلة",
    RemoveFromFavorite: "إزالة من المفضلة",
    RemoveFromThisCategory: "إزالة الإختصار",
    AddToAnotherCategory: "إضافة إختصار لمجموعة أخرى...",
    CategoriesTitle: "إضافة لمجموعة",
    QuizMode: "وضع التحدي",
    Quiz: "وضع التحدي",
  },
  en: {
    MyIssieSign: "My IssieSign",

    SettingsLanguage: "Language",
    SettingsSwipe: "Swipe",
    NavByArrow: "Arrows",
    NavBySwipe: "Swipe",
    TutorialsCategory: "Tutorials",
    SettingsHideFolder: "Hide {1} Folder",

    SettingsTitle: "Settings",
    Working: "In Progress...",
    ImportWords: "Importing words...",
    NewWords: "New Words",
    TitleAbout: "About us",
    SettingsAbout: "About us",
    SettingsEdit: "Edit",
    SettingsWordsListMode: "Category View Mode",
    WordsListAndPreview: "List + Video",
    WordsTiles: "Tiles",
    WordsList: "List",

    SettingsAddCatAndWords: "Add/Delete Folders and Words",
    TitleAddCategory: "Add Folder",
    TitleEditCategory: "Edit Folder",
    TitleAddWord: "Add Word",
    TitleEditWord: "Edit Word",
    SearchTitle: "Search: {1}",
    Yes: "yes",
    No: "no",

    //confirm messages
    ConfirmTitleDeleteCategory: "Delete Folder",
    ConfirmDeleteCategoryMessage:
      "Deleting a folder will also delete all words in it. Delete '{1}'?",
    ConfirmTitleDeleteWord: "Delete Word",
    ConfirmDeleteWordMessage: "Deleting word '{1}'. Are you sure?",

    BtnYes: "Yes",
    BtnCancel: "Cancel",
    BtnSave: "Save",

    InfoDeleteCanceled: "Delete cancelled",
    InfoDeleteSucceeded: "Successfully deleted",
    InfoDeleteFailed: "Delete failed",
    InfoSavedSuccessfully: "Successfully saved",
    MissingImageAlt: "Missing image",
    InfoSharingWords: "Sharing words...",
    InfoSharingCategory: "Sharing folder...",
    InfoSharingFailed: "Share failed",
    ShareWords: "Share Words",
    sharingAllWords: "all words",

    EmptyShareCart: "No folders or words were selected for sharing yet",
    ShareButton: "Share...",
    AddToShareMenu: "Add To Sharing List",
    RemoveFromShareMenu: "Remove From Sharing List",
    EditMenu: "Edit...",
    DeleteMenu: "Delete",
    SelectColorMenuTitle: "Select Color",
    ChangeColor: "Select Color",

    FavoritesCategory: "Favorites",

    AddVideoSelected: "Video is selected",
    AddImageSelected: "Icon is selected",
    AddPlaceholderWordName: "Word name",
    AddPlaceholderCategoryName: "Folder name",
    AddPlaceholderSelectImage: "Select icon",
    AddPlaceholderSelectVideo: "Select video",
    AddLoadingCamera: "Loading camera...",
    AddTakePictureFailedOrCanceled: "Taking photo failed or cancelled",
    AddLoadingCameraRoll: "Loading...",
    AddLoadPictureFailedOrCanceled: "Loading image failed or cancelled",

    AddLoadVideoCameraFailedOrCanceled: "Shoting video failed or cancelled",
    AddLoadVideoFailedOrCanceled: "Loading video failed or cancelled",

    RestartApp: "Media files are loading, please close the App and retry later",
    LoadingMedia: "Media files are loading ({1} of {2})",

    ImportWordsErr: "Error importing words {1}",
    ErrWrongImportFile: "Wrong imported file format",
    SearchImageTitle: "Search Icon",
    EnterSearchHere: "enter search keywords here",
    BtnSearch: "Search",
    NoResultsMsg: "No Results Found",
    SyncToCloudMsg: "Syncronizes with your Google Drive",
    SyncToCloudTitle: "Sync with your Google Drive",
    ErrSyncFail: "Sync Failed\n {1}",
    SyncStatusNone: "Not Syncronized",
    SyncStatusLbl: "Sync Status",
    SyncErrorLbl: "Sync Error",
    ShareCartTitle: "Share List",
    ShareCartCategoryColumnTitle: "Folder",
    ShareCartWordNameColumnTitle: "Word",
    ItemRemovedFromShare: "Removed from the Sharing List",
    ItemAddedToShare: "Added to the Sharing List",

    ConfirmTitleSyncToServer: "Syncronizing all shared word to Google Drive",
    ConfirmMsgSyncToServer:
      "All shared words will be syncronized to your Google Drive and will be given read permission to anyone with a link. Do you approve?",
    ShareCancelled: "Share Cancelled",
    InfoSharingSucceeded: "Sharing completed successfully",
    InfoSharingFailed: "Sharing Failed\n {1}",
    NoWordSelected: "No Word Selected",
    SettingsConnectedGDrive: "Google Drive",
    NotLoggedIn: "Not connected yet",
    LoggedIn: "Connected to {1}",
    BtnLogout: "Logout",
    BtnReconsile: "Sync",
    ReconsileStarted: "Sync started",
    ShowOwnCategoriesFirst: "Show Own Folders First",
    InvalidCharachtersInName: "Invalid characters in name",
    EnterEditMode: "Press {1} seconds",
    __tutorial_overview__: "Get To Know IssieSign",
    __tutorial_editing__: "Editing and Sharing",
    "in-sync": "In Sync",
    MissingFolderFileID: "Folder {1} is not syncronized to the cloud",
    MissingWordFileID: "Word {1} is not synchronized to the cloud",
    ImportWordsCompleted: "Import Words Completed",
    AddedWords: "Added Words",
    AlreadyExistingWords: "Already Existing Words",
    SettingsAppType: "Choose Application",
    AddToFavorite: "Add To Favorites",
    RemoveFromFavorite: "Remove From Favorites",
    RemoveFromThisCategory: "Remove Shortcut",
    AddToAnotherCategory: "Add a Shortcut To Another Category...",
    CategoriesTitle: "Add To Category",
    QuizMode: "Quiz Mode",
    Quiz: "Quiz",
  },
};

function findMissing() {
  let missing = "";
  //English
  console.log("Missing in English:");
  Object.entries(strings.he).forEach(([key, value]) => {
    if (!strings.en[key]) {
      missing += '"' + key + '":' + '"' + value + '",\n';
    }
  });
  console.log(missing);
  missing = "";
  console.log("\n\nMissing in Arabic:");
  Object.entries(strings.he).forEach(([key, value]) => {
    if (!strings.ar[key]) {
      missing += '"' + key + '":' + '"' + value + '",\n';
    }
  });
  console.log(missing);

  missing = "";
  console.log("\n\nMissing in Hebrew:");
  Object.entries(strings.en).forEach(([key, value]) => {
    if (!strings.he[key]) {
      missing += '"' + key + '":' + '"' + value + '",\n';
    }
  });
  console.log(missing);
}
//findMissing();

var currStrings = strings[gLang];

export function setLanguage(lang, persist) {
  if (persist) {
    saveSettingKey(LANG_KEY, lang);
  }

  currStrings = strings[lang];
  gLang = lang;
  if (!currStrings) {
    currStrings = strings[DEFAULT_LANG];
    gLang = DEFAULT_LANG;
  }

  if (isBrowser()) {
    gPrefix = ".";
  }

  window?.document.documentElement.style.setProperty(
    "--dir",
    isRTL() ? "rtl" : "ltr",
  );
  window?.document.documentElement.style.setProperty(
    "--dirRev",
    isRTL() ? "ltr" : "rtl",
  );
  // window?.document.documentElement.style.setProperty('--rtl_f', isRTL() ? 1 : 0);
  // window?.document.documentElement.style.setProperty('--ltr_f', isRTL() ? 0 : 1);
}

export function isRTL() {
  return gLang === "he" || gLang === "ar";
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
      s = id;
    } else {
      s = s;
    }
  }

  return gPrefix + s;
}

export function fTranslate(id, ...args) {
  return replaceArgs(translate(id), args);
}

function replaceArgs(s, args) {
  return s.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number - 1] != "undefined" ? args[number - 1] : match;
  });
}
