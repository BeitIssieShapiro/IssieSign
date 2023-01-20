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

const heMap = [
    {
        "name": "FavoritesCategory",
        translate: true,
        "id": "__favorites__",
        "themeId": "2",
        "imageName": "favorites.png",
        "wordsRaw": []
    },
    {
        "name": "TutorialsCategory",
        allowHide: true,
        translate: true,
        "id": "__tutorials__",
        "themeId": "3",
        "imageName": "R587.png",
        "words": []
    },
]
const arMap = [
    {
        "name": "FavoritesCategory",
        translate: true,
        translate: true,
        "id": "__favorites__",
        "themeId": "2",
        "imageName": "favorites.png",
        "wordsRaw": []
    },
    {
        "name": "TutorialsCategory",
        allowHide: true,
        "id": "__tutorials__",
        "themeId": "3",
        "imageName": "R587.png",
        "words": []
    },

]

//Hebrew map
let catId = 1
const next = (letter) => String.fromCharCode(letter.charCodeAt(0) + 1)
for (let letter = 'A'; letter <= 'Z'; letter = next(letter)) {
    heMap.push(extractRanges4Category(category2wordsHe, letter, 1, catId++));
}
heMap.push(extractRanges4Category(category2wordsHe, 'AA', 1, catId++));

//Arabic map
catId = 1
for (let letter = 'A'; letter <= 'Z'; letter = next(letter)) {
    arMap.push(extractRanges4Category(category2wordsAr, letter, 1, catId++));
}
arMap.push(extractRanges4Category(category2wordsAr, 'AA', 1, catId++));


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

    const knownMissing = [288, 470, 523, 305, 347, 516, 523, 679, 742, 756, 760, 763]
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
        videoName: videoName + ".mp4"
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
    if (cat.id !== "__favorites__" && cat.id !== "__tutorials__") {
        const wordForCat = cat.words.find(w => w.name == cat.name);
        if (!wordForCat) {
            console.log("word for cat is missing", cat.name, cat.words.map(w => w.name));
        } else {
            cat.imageName = wordForCat.imageName;
        }
    }

    delete cat.wordsRaw;
}

heMap.forEach(cat => addWordsToCat(cat, "he"));
arMap.forEach(cat => addWordsToCat(cat, "ar"));

console.log("processed rows", row - emptyRows - 1);
saveFile({
    indexVersion: 1,
    categories: heMap
}, "he");

saveFile({
    indexVersion: 1,
    categories: arMap
}, "ar");





// let categoryAr = {}, categoryHe = {};
// while (issieWords[FILENAME_COL + row]?.v.length > 0 || emptyRows < 3) {
//     if (issieWords[FILENAME_COL + row] === undefined) {
//         emptyRows++;
//         row++;
//         continue;
//     } else {
//         emptyRows = 0;
//     }


//     let wordHe = issieWords[WORD_HE_COL + row]?.v;
//     if (!wordHe) {
//         //defaults to category name
//         wordHe = issieWords[CATEGOTY_COL + row]?.v;
//     }


//     if (issieWords[CATEGOTY_COL + row]?.v?.length > 0) {
//         if (categoryIndex > 0) {
//             resAr.categories.push(categoryAr);
//             resHe.categories.push(categoryHe);
//         }

//         categoryIndex++;
//         fileIndex = categoryIndex * 100 + 1;

//         categoryAr = { name: issieWords[WORD_AR_COL + row]?.v, id: categoryIndex, words: [] };
//         categoryHe = { name: issieWords[CATEGOTY_COL + row].v, id: categoryIndex, words: [] };

//         // if (categoryHe.name == "לבוש") {
//         //     console.log("stop")
//         // }

//         if (!categoryAr.name) {
//             console.log("ALERT:", "missing arabic category for ", currentCategoryHe, "row", row);
//         }
//         //wordHe = categoryHe.name;
//         //console.log(categoryHe.name, categoryAr.name);
//     }
//     let wordAr = issieWords[WORD_AR_COL + row]?.v


//     let imageName = issieWords[FILENAME_COL + row]?.v
//     let imageName2 = undefined;
//     let videoName = imageName;
//     if (!imageName) {
//         console.log("ALERT:", "missing Filename", "row", row);
//     } else {
//         imageName = imageName.trim();
//         if (imageName.endsWith(" 1 2") || imageName.endsWith(" 1 2 3")) {
//             let spacePos = imageName.indexOf(" ");
//             videoName = imageName.substr(0, spacePos);
//             imageName = videoName + " 1";
//             imageName2 = videoName + " 2";
//         }
//     }

//     const wordHeObj = {
//         name: cleanseName(wordHe),
//         id: fileIndex,
//         imageName: imageName + ".png",
//         videoName: videoName + ".mp4"
//     }
//     if (imageName2) {
//         wordHeObj.imageName2 = imageName2 + ".png"
//     }



//     // if (wordHeObj.name == "לבוש") {
//     //     console.log("stop")
//     // }

//     if (!wordHeObj.name) {
//         console.log("ALERT:", "missing Hebrew word", "row", row);
//     } else {
//         // find the hebrew movie and icon:
//         if (issieWords[STATUS_COL + row]?.v === 19 || issieWords[STATUS_COL + row]?.v === 7
//             || issieWords[STATUS_COL + row]?.v === 24 || issieWords[STATUS_COL + row]?.v === 22
//             || issieWords[STATUS_COL + row]?.v === 53) {

//             // let name = wordMap[wordHeObj.name] ? wordMap[wordHeObj.name] : wordHeObj.name;
//             // let imgName = name;
//             // let imgName2 = undefined;
//             // if (imageWordMap[wordHeObj.name]) {
//             //     imgName = imageWordMap[wordHeObj.name][0];
//             //     if (imageWordMap[wordHeObj.name].length == 2) {
//             //         imgName2 = imageWordMap[wordHeObj.name][1];
//             //     }
//             // }
//             let suffix = "missing"
//             if (issieWords[STATUS_COL + row]?.v === 24) {
//                 suffix = "wait-for-new"
//             }


//             if (!fileExists(imagePath + "/" + imgName + ".png")) {
//                 console.log(missingFiles, "Need Hebrew image ", imgName + ".png");
//                 missingFiles++;
//                 //fs.copyFileSync("missing.txt", targetMedia + "/images/he/" + wordHeObj.imageName + "-" + suffix)
//             } else {
//                 //fs.copyFileSync(imagePath + "/" + imgName + ".png", targetMedia + "/images/he/" + wordHeObj.imageName)
//                 wordHeObj.oldImageName = imgName + ".png";
//             }
//             if (suffix == "missing" && wordHeObj.imageName2) {
//                 console.log("stop")
//             }

//             if (wordHeObj.imageName2) {
//                 if (!fileExists(imagePath + "/" + imgName2 + ".png")) {
//                     console.log(missingFiles, "missing Hebrew image", imgName2 + ".png");
//                     missingFiles++;
//                     //fs.copyFileSync("/Users/i022021/dev/Issie/IssieSign/scripts/missing.txt", targetMedia + "/images/he/" + wordHeObj.imageName2 + "-" + suffix)
//                 } else {
//                     //fs.copyFileSync(imagePath + "/" + imgName2 + ".png", targetMedia + "/images/he/" + wordHeObj.imageName2)
//                     wordHeObj.oldImageName2 = imgName2 + ".png";
//                 }
//             }


//             if (imageWordMap[name]) {
//                 name = imageWordMap[name][0];
//             }

//             let videoFilePath = videoPath + "/" + name;
//             if (issieWords[STATUS_COL + row]?.v !== 24 && !fileExists(videoFilePath + ".mov")) {
//                 if (!fileExists(videoFilePath + ".mp4")) {
//                     console.log(missingFiles, "missing Hebrew video", name);
//                     missingFiles++;
//                     //fs.copyFileSync("missing.txt", targetMedia + "/videos/he/prod/" + wordHeObj.videoName + "-missing")
//                 } else {
//                     //fs.copyFileSync(videoFilePath + ".mp4", targetMedia + "/videos/he/prod/" + wordHeObj.videoName)
//                     wordHeObj.oldVideoName = name + ".mp4"
//                 }

//             } else {
//                 if (issieWords[STATUS_COL + row]?.v === 24) {
//                     //fs.copyFileSync("missing.txt", targetMedia + "/videos/he/prod/" + wordHeObj.videoName + "-wait-for-new")
//                 } else {
//                     //fs.copyFileSync(videoFilePath + ".mov", targetMedia + "/videos/he/prod/" + wordHeObj.videoName)
//                 }
//                 wordHeObj.oldVideoName = name + ".mov"
//             }
//         }
//         const searchHe = issieWords[SEARCH_WORDS_HE_COL + row]?.v;
//         addSearchWords(searchHe, wordHeObj);
//         categoryHe.words.push(wordHeObj);
//     }

//     // Arabic Word:
//     if (!(!wordAr || wordAr.length === 0 || wordAr.includes("----"))) {

//         const wordArObj = {
//             name: cleanseName(wordAr),
//             id: fileIndex,
//             imageName: imageName + ".png",
//             videoName: videoName + ".mp4"
//         }

//         if (imageName2) {
//             wordArObj.imageName2 = imageName2 + ".png"
//         }

//         if (!wordArObj.name) {
//             console.log("ALERT:", "missing Arabic word", "row", row);
//         }
//         const searchAr = issieWords[SEARCH_WORDS_AR_COL + row]?.v;
//         addSearchWords(searchAr, wordArObj);
//         categoryAr.words.push(wordArObj);
//     }

//     fileIndex++
//     row++
// }

// //push last category:
// resAr.categories.push(categoryAr);
// resHe.categories.push(categoryHe);

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

/*
var items = fs.readdirSync(sourceFile);

for (var i=0; items && i<items.length; i++) {
//    console.log(items[i]);
    var colorIndex = (i+1) % colors.length
    let category = {};
    category.name = items[i];
    //category.color = colors[colorIndex];
    category.id = categoryIndex.toString();
    category.imageName = items[i] + ".png"
    category.words = []
//    console.log("read words:" + sourceFile + '/' + category.name);
    try {
        var words = fs.readdirSync(sourceFile + '/' + category.name);
        if (words) {
            fileIndex = categoryIndex * 100 + 1;
            for (var j=0; j<words.length; j++) {
                var suffix = ""
                if (words[j].endsWith(".mov")) {
                    suffix = ".mov"
                } else if (words[j].endsWith(".mp4")) {
                    suffix = ".mp4"
                }



                if (suffix != "") {
//                    console.log(category.id + " " + words[j]);
                    var word = {};
                    word.name = words[j].replace(suffix, "");
                    //deal with duplicates
                    word.name = word.name.replace("__2", "");
                    word.id = fileIndex;
                    fileIndex++;
                    word.imageName = words[j].replace(suffix, ".png");

                    //test files exists
                    var pathToTest = imagePath + word.imageName
                    if (!fs.existsSync(pathToTest)) {
                        console.log("missing image: '" + category.name+ "' - '"+ word.imageName + "'");
                        word.imageName = "no_image.png"
                    }

                    //check if opossite image exists:
                    var pathToOpposite = pathToTest.replace(".png", " 2.png")
                    if (fs.existsSync(pathToOpposite)) {
                        word.imageName2 = word.imageName.replace(".png", " 2.png")
                    }




                    //word.videoName = words[j].replace(suffix, "_x264.mov");
                    word.videoName = words[j]

                    pathToTest = videoPath + word.videoName
                    if (!fs.existsSync(pathToTest)) {
                        console.log("missing video: '" +  word.videoName+ "'");
                    }

                    category.words.push(word);
                }
            }
        }
        categoryIndex++;

        res.categories.push(category);
    } catch(e){
        //console.log(e)
    }



}


*/

