console.log("Start building JSON file for sign language app - New");

/*
Public Function abc()
    Set s = Application.Sheets("main")
    RowCount = 1
    For Each rw In s.Rows
        rw.Cells(1, 15).Value = rw.Cells(1, 1).Interior.ColorIndex
        RowCount = RowCount + 1
        If (RowCount > 1000) Then Stop
    Next

End Function

*/
const wordMap = {
    //    "בועות": "בועות סבון",
    //    "אחות (מקצוע)": "אחות",
    "בתיאבון": "בתאבון",
    //    "סליחה (מצטער)": "סליחה",
    //    "יופי/טוב": "יופי",
    //    "לא/אסור": "לא",
    //    "תורי (התור שלי)": "תורי",
    //    "מוסיקה": "מוזיקה",
    //    "הפסחא": "פסחא",
    //    "פינגוון": "פינגווין",
    // "תרנגולת": "תרנגול",
    // "אזניים": "אוזניים",
    // "רגל": "רגליים",
    // "מברשת שיניים": "מברשת שיניים ומשחה",
    "טלוויזיה": "טלויזיה",
    // "כיסא גלגלים": "כסא גלגלים",
    // "מטרייה": "מטריה",
    // "סיר שירותים": "סיר__2",
    // "ספר/ סיפור": "ספר",
    // "הליקופטר/מסוק": "מסוק",
    // "מכונית/אוטו": "מכונית",
    // "גבינה צהובה*": "גבינה צהובה",
    // "דג למאכל?": "דג",
    // "דג": "דג__2",
    // "דוב": "דב",
    // "סוכרייה": "סוכריה",
    // "ספגטי פסטה": "פסטה",
    // "גן ילדים": "גן",
    // "איש ואישה": "איש אישה",
    "בן דוד/בת דודה": "בני דודים",
    "דוד / דודה": "דודים",
    "ילד וילדה": "ילד ילדה",
    "נכד / נכדה": "נכדים",
    // "אפשר מותר": "אפשר",
    // "וורוד": "ורוד",
    // "ציבעוני": "צבעוני",
    // "לבכות/בוכה": "בוכה",
    // "משועמם": "משעמם",
    // "איכס/מגעיל/לא טעים": "לא טעים",
    // "ארוך קצר": "ארוך וקצר",
    // "גדול קטן": "גדול וקטן",
    // "דומה שונה": "דומה ושונה",
    // "הרבה קצת": "הרבה וקצת",
    // "ישן חדש": "ישן וחדש",
    // "יבש רטוב": "יבש ורטוב",
    // "לאט מהר": "לאט ומהר",
    // "למטה למעלה": "למטה ולמעלה",
    // "מלא ריק": "מלא וריק",
    // "מלוכלך נקי": "מלוכלך ונקי",
    // "קרוב רחוק": "קרוב ורחוק",
    // "שקט רועש": "שקט ורועש",
    // "בפנים בחוץ": "בפנים ובחוץ",
    // "גבוה נמוך": "גבוה ונמוך",
    // "לפני אחרי": "לפני ואחרי",
    // "חם קר": "חם וקר",
    // "קשה-רך": "קשה ורך",
    // "לבוש": "פריטי לבוש",

    // "אחות": "אחות__2",
    // "חלקי גוף": "איברי גוף",
    // "לחייך": "חיוך",
    // "יום הולדת": "יום הולדת שמח",
    // "יום הזיכרון (שואה, חיילים?)": "יום הזיכרון",


    // "יפה מכוער": "יפה ומכוער",
    // "ל\"ג בעומר": "לג בעומר",
    // "ביי ביי / להתראות": "להתראות",
    // "סיימתי": "לסיים",
    // "עוגייה": "עוגיה",
    // "פעולות": "פעלים",
    // "שמות תואר": "תיאורים",
    "": "",
}

const imageWordMap = {
    // "חלקי גוף":
    //     ["איברי גוף"],
    // "ארוך וקצר":
    //     ["ארוך וקצר", "ארוך וקצר 2"],
    // "הרבה וקצת":
    //     ["הרבה וקצת", "הרבה וקצת 2"],
    // "דומה ושונה":
    //     ["דומה ושונה", "דומה ושונה 2"],
    // "גבוה ונמוך":
    //     ["גבוה ונמוך", "גבוה ונמוך 2"],
    // "בפנים ובחוץ":
    //     ["בפנים ובחוץ", "בפנים ובחוץ 2"],
    // "גדול וקטן":
    //     ["גדול וקטן", "גדול וקטן 2"],
    // "הרבה וקצת":
    //     ["הרבה וקצת", "הרבה וקצת 2"],
    // "דומה ושונה":
    //     ["דומה ושונה", "דומה ושונה 2"],
    // "חבר וחברה":
    //     ["חבר וחברה", "חבר וחברה 2"],
    // "חם וקר":
    //     ["חם וקר", "חם וקר 2"],
    // "יבש ורטוב":
    //     ["יבש ורטוב", "יבש ורטוב 2"],
    // "יפה ומכוער":
    //     ["יפה ומכוער", "יפה ומכוער 2"],
    // "ישן וחדש":
    //     ["ישן וחדש", "ישן וחדש 2"],
    // "לאט ומהר":
    //     ["לאט ומהר", "לאט ומהר 2"],
    // "לפני ואחרי":
    //     ["לפני ואחרי", "לפני ואחרי 2"],
    // "מלא וריק":
    //     ["מלא וריק", "מלא וריק 2"],
    // "מלוכלך ונקי":
    //     ["מלוכלך ונקי", "מלוכלך ונקי 2"],
    // "קרוב ורחוק":
    //     ["קרוב ורחוק", "קרוב ורחוק 2"],
    // "שקט ורועש":
    //     ["שקט ורועש", "שקט ורועש 2"],
    // "למטה ולמעלה":
    //     ["למטה ולמעלה", "למטה ולמעלה 2"],
    // "קשה ורך":
    //     ["קשה ורך", "קשה ורך 2"],
    // "איש ואישה":
    //     ["איש אישה"],
    // "בני דודים":
    //     ["בן דוד"],
    // "דודים":
    //     ["דוד ודודה"],
    // "נכדים":
    //     ["נכד נכדה"],
}


var sourceFile = '/Users/i022021/dev/Issie/issie-words.xlsx'
var targetFile = '/Users/i022021/dev/Issie/IssieSign/jsons'
var imagePath = '/Users/i022021/dev/issie/IssieSign-MediaNew/images/he'
var videoPath = '/Users/i022021/dev/issie/IssieSign-MediaNew/videos/he/prod'
var colors = [
    "#2d9f8e",
    "#d95841",
    "#f8ca73",
    "#7c97be",
    "#85d5ee",
    "#dd81aa",
    "#e0f33c",
    "#8d8d8d",
    "#fbef5f",
    "#9d8ab5",
    "#bd5a6c",
    "#98c867",
    "#ffe7c6",
    "#fa8071",
    "#7f8000",
    "#61676c",
    "#fc66b2",
    "#4c70da",
    "#f77e29",
    "#abd6d0",
    "#d6d8e7",
    "#36802d",
    "#f1c5c1",
    "#d8a67a"
]

var fs = require('fs');
const xlsx = require("xlsx");

const resHe = { categories: [] };
const resAr = { categories: [] };


const CATEGOTY_COL = "A"
const CATEGOTY_COLOR_COL = "B"
const WORD_HE_COL = "C"
const WORD_AR_COL = "D"
const FILENAME_COL = "G"
const SEARCH_WORDS_HE_COL = "I"
const SEARCH_WORDS_AR_COL = "J"
const STATUS_COL = "O"

const issieWordsWB = xlsx.readFile(sourceFile);
const issieWords = issieWordsWB.Sheets["רשימה כולל הערות"];
const category2wordsHe = issieWordsWB.Sheets["עברית חלוקה לקטגוריות"];
const category2wordsAr = issieWordsWB.Sheets["ערבית חלוקה לקטגוריות"];
const USEFULT_WORDS = "__useful_words__"
let row = 2;
let emptyRows = 0;


function extractNum(val) {
    let value = val.trim();
    return parseInt((isNaN(value.substr(1)) ? value.substr(2) : value.substr(1)));
}

function parseRange(range) {
    const parts = range.split("-");
    if (parts.length == 1) {
        return [extractNum(parts[0])];
    }
    else {
        const from = extractNum(parts[0]);
        const to = extractNum(parts[1]);
        const ret = []
        for (let i = from; i <= to; i++) {
            ret.push(i);
        }
        return ret;
    }
}

// Build map of categories

const heMap = []
const arMap = []
const enMap = []
const defaultMap = [
    {
        "name": "FavoritesCategory",
        translate: true,
        "id": "__favorites__",
        "themeId": "2",
        "imageName": "favorites.png",
        "words": []
    },
    {
        "name": "TutorialsCategory",
        allowHide: true,
        translate: true,
        "id": "__tutorials__",
        "themeId": "3",
        "imageName": "tutorials.png",
        "words": [
            {
                name: "__tutorial_overview__",
                id: "__tutorial_overview__",
                translate: true,
                category: "TutorialsCategory",
                imageName: "tutorial-overview.jpg",
                videoName: "https://www.issieapps.com/videos/tutorials/{$LANG}/overview.mp4",
            },
            {
                name: "__tutorial_editing__",
                id: "__tutorial_editing__",
                translate: true,
                category: "TutorialsCategory",
                imageName: "tutorial-editing.png",
                videoName: "https://www.issieapps.com/videos/tutorials/{$LANG}/editing.mp4",
            }
        ]
    },
]

function setTutorialMovieLang(aMap, lang) {
    const tCat = aMap.find(cat => cat.id == "__tutorials__");
    tCat.words = tCat.words.map(word => ({ ...word, videoName: word.videoName.replace("{$LANG}", lang) }))
}


//Hebrew map
defaultMap.forEach(cat => heMap.push({ ...cat }))

setTutorialMovieLang(heMap, "he")
let catId = 1
const next = (letter) => String.fromCharCode(letter.charCodeAt(0) + 1)
for (let letter = 'A'; letter <= 'Z'; letter = next(letter)) {
    heMap.push(extractRanges4Category(category2wordsHe, letter, 1, catId++));
}
heMap.push(extractRanges4Category(category2wordsHe, 'AA', 1, catId++));
heMap.push(extractRanges4Category(category2wordsHe, 'AB', 1, USEFULT_WORDS));

//Arabic map
defaultMap.forEach(cat => arMap.push({ ...cat }))
setTutorialMovieLang(arMap, "ar")
catId = 1
for (let letter = 'A'; letter <= 'Z'; letter = next(letter)) {
    arMap.push(extractRanges4Category(category2wordsAr, letter, 1, catId++));
}
arMap.push(extractRanges4Category(category2wordsAr, 'AA', 1, catId++));
arMap.push(extractRanges4Category(category2wordsAr, 'AB', 1, USEFULT_WORDS));

//English map
defaultMap.forEach(cat => enMap.push({ ...cat }))

setTutorialMovieLang(enMap, "en")


function extractRanges4Category(sheet, letter, row, catId) {
    let header = sheet[letter + row]?.v;
    if (!header) {
        console.log("empty column")
    }
    const cat = { name: header, wordsRaw: [], id: catId + "" }

    if (header === "התבגרות" || header === "بلوغ") {
        cat.allowHide = true;
        cat.defaultHide = true;
    }

    if (catId === USEFULT_WORDS) {
        cat.sortByID = true;
    }

    row++
    let empty = 0;
    while (empty < 2) {
        const wordRange = sheet[letter + row]?.v;
        if (!wordRange) {
            empty++
        } else {
            cat.wordsRaw = cat.wordsRaw.concat(parseRange(wordRange));
        }
        row++;
    }
    return cat;
}


function getWord(row, lang, id) {
    const col = lang == "he" ? WORD_HE_COL : WORD_AR_COL;
    let wordName = issieWords[col + row]?.v
    if (!wordName && lang == "he") {
        wordName = issieWords[CATEGOTY_COL + row]?.v
    }

    const knownMissing = [288, 470, 523, 305, 347, 516, 523, 679, 742, 756, 760, 763, 806]
    if (!wordName || wordName.trim().length == 0) {
        if (!knownMissing.some(km => km == row)) {
            console.log("missing word", lang, row)
        }
        return undefined
    }
    if (wordName.includes("----")) return undefined;

    let imageName = issieWords[FILENAME_COL + row]?.v
    let imageName2 = undefined;
    let videoName = imageName;
    if (!imageName) {
        console.log("ALERT:", "missing Filename", "row", row);
    } else {
        imageName = imageName.trim();
        if (imageName.endsWith(" 1 2") || imageName.endsWith(" 1 2 3")) {
            let spacePos = imageName.indexOf(" ");
            videoName = imageName.substr(0, spacePos);
            imageName = videoName + " 1";
            imageName2 = videoName + " 2";
        }
    }

    const wordObj = {
        name: cleanseName(wordName),
        id: (1000 + row) + "",
        imageName: imageName + ".png",
        videoName: videoName.trim() + ".mp4"
    }
    if (imageName2) {
        wordObj.imageName2 = imageName2 + ".png"
    }

    const searchCol = lang == "he" ? SEARCH_WORDS_HE_COL : SEARCH_WORDS_AR_COL;
    const search = issieWords[searchCol + row]?.v;
    addSearchWords(search, wordObj);

    return wordObj;
}

function addWordsToCat(cat, lang) {
    if (cat.id !== "__favorites__" && cat.id !== "__tutorials__") {
        console.log("process cat", lang, cat.name);

        let wordId = parseInt(cat.id) * 100;
        cat.words = [];
        cat.wordsRaw?.forEach(row => {
            const wordObj = getWord(row, lang, wordId)
            if (wordObj) {
                wordId++;
                cat.words.push(wordObj)
            }
        })

        // extract image for category:
        let wordForCat = cat.words.find(w => w.name == cat.name);
        if (!wordForCat && cat.id == USEFULT_WORDS) {
            wordForCat = getWord(813, lang, "N/A")
        }
        if (!wordForCat) {
            console.log("word for cat is missing", JSON.stringify(cat));
        } else {
            cat.imageName = wordForCat.imageName;
        }

        delete cat.wordsRaw;
        delete cat.catRow;
    }
}

heMap.forEach(cat => addWordsToCat(cat, "he"));
arMap.forEach(cat => addWordsToCat(cat, "ar"));
enMap.forEach(cat => addWordsToCat(cat, "en"));

console.log("processed rows", row - emptyRows - 1);
saveFile({
    indexVersion: 1,
    categories: heMap
}, "he");

saveFile({
    indexVersion: 1,
    categories: arMap
}, "ar");

saveFile({
    indexVersion: 1,
    categories: enMap
}, "en");


function addSearchWords(searchWords, obj) {
    obj.tags = [];
    if (searchWords == "יתכן שחסר בעברית") return;
    if (searchWords) {
        const keywords = searchWords.split(/[, ]+/);
        keywords.forEach(keyword => {
            if (keyword.trim().length > 0) {
                obj.tags.push(keyword.trim());
            }
        })
    }
}

function fileExists(path) {
    try {
        let stats = fs.statSync(path);
        return true
    } catch (e) {

    }
    return false
}

function cleanseName(val) {
    if (val) {
        let newVal = val.trim()
        if (newVal.charAt(newVal.length - 1) == ".") {
            newVal = newVal.substr(0, newVal.length - 1)
        }
        return newVal;
    }
}
function saveFile(res, lang) {
    fs.open(targetFile + "/" + lang + "/mainJson.js", 'w', function (err, file) {
        if (err) throw err;
        fs.writeSync(file,
            "const mainJson = " +
            JSON.stringify(res, null, 2)
            + ";\n\nexports.mainJson = mainJson"
        );
        fs.closeSync(file);
    });
}
