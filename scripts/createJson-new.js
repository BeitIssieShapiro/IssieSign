console.log("Start building JSON file for sign language app - New");

/*
Public Function abc()
    Set s = Application.Sheets("Sheet1")
    RowCount = 1
    For Each rw In s.Rows
        rw.Cells(1, 11).Value = rw.Cells(1, 1).Interior.ColorIndex
        RowCount = RowCount + 1
        If (RowCount > 1000) Then Stop
    Next

End Function

*/
const wordMap ={
    "בועות": "בועות סבון",
    "אחות (מקצוע)": "אחות",
    "בתיאבון":"בתאבון",
    "סליחה (מצטער)":"סליחה",
    "יופי/טוב":"יופי",
    "לא/אסור":"לא",
    "תורי (התור שלי)":"תורי",
    "מוסיקה":"מוזיקה",
    "הפסחא":"פסחא",
    "פינגוון":"פינגווין",
    "דוב":"דובי",
    "תרנגולת":"תרנגול",
    "אזניים":"אוזניים",
    "רגל":"רגליים",
    "מברשת שיניים":"מברשת שיניים ומשחה",
    "טלויזייה":"טלויזיה",
    "כיסא גלגלים":"כסא גלגלים",
    "מטרייה":"מטריה",
    "סיר שירותים":"סיר__2",
    "ספר/ סיפור":"ספר",
    "הליקופטר/מסוק":"מסוק",
    "מכונית/אוטו":"מכונית",
    "גבינה צהובה*":"גבינה צהובה",
    "דג למאכל?":"דג",
    "סוכרייה":"סוכריה",
    "ספגטי פסטה":"פסטה",
    "גן ילדים":"גן",
    "איש ואישה":"איש אישה",
    "בן דוד/בת דודה":"בן דוד",
    "דוד / דודה":"דוד ודודה",
    "ילד child":"ילד ילדה",
    "נכד / נכדה":"נכד נכדה",
    "אפשר מותר":"אפשר",
    "וורוד":"ורוד",
    "ציבעוני":"צבעוני",
    "לבכות/בוכה":"בוכה",
    "משועמם":"משעמם",
    "איכס/מגעיל/לא טעים":"לא טעים",
    "ארוך קצר":"ארוך וקצר",
    "גדול קטן":"גדול וקטן",
    "דומה שונה":"דומה ושונה",
    "הרבה קצת":"הרבה וקצת",
    "ישן חדש":"ישן וחדש",
    "יבש רטוב":"יבש ורטוב",
    "לאט מהר":"לאט ומהר",
    "למטה למעלה":"למטה ולמעלה",
    "מלא ריק":"מלא וריק",
    "מלוכלך נקי":"מלוכלך ונקי",
    "קרוב רחוק":"קרוב ורחוק",
    "שקט רועש":"שקט ורועש",
    "בפנים בחוץ":"בפנים ובחוץ",
    "גבוה נמוך":"גבוה ונמוך",
    "לפני אחרי":"לפני ואחרי",
    "חם קר":"חם וקר",
    "קשה-רך":"קשה ורך",
}


var sourceFile = '/Users/i022021/Downloads/issie-words.xlsx'
var targetFile = '/Users/i022021/Downloads/issieJson'
var imagePath = '/Users/i022021/dev/issie/IssieSign-Media/images/he'
var videoPath = '/Users/i022021/dev/issie/IssieSign-Media/videos/he/prodNew'
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
const STATUS_COL = "K"

const issieWordsWB = xlsx.readFile(sourceFile);
const issieWords = issieWordsWB.Sheets["Sheet1"];

let row = 2;
let currentCategoryHe = "";
let categoryIndex = 0;
let fileIndex = 0;

let categoryAr = {}, categoryHe = {};
let emptyRows = 0;
let missingFiles = 0;
while (issieWords[FILENAME_COL + row]?.v.length > 0 || emptyRows < 3) {
    if (issieWords[FILENAME_COL + row] === undefined) {
        emptyRows++;
        row++;
        continue;
    } else {
        emptyRows = 0;
    }
    let wordHe = issieWords[WORD_HE_COL + row]?.v;
    if (issieWords[CATEGOTY_COL + row]?.v?.length > 0) {
        if (categoryIndex > 0) {
            resAr.categories.push(categoryAr);
            resHe.categories.push(categoryHe);
        }

        categoryIndex++;
        fileIndex = categoryIndex * 100 + 1;

        categoryAr = { name: issieWords[WORD_AR_COL + row]?.v, id: categoryIndex, words: [] };
        categoryHe = { name: issieWords[CATEGOTY_COL + row].v, id: categoryIndex, words: [] };

        if (!categoryAr.name) {
            //console.log("ALERT:", "missing arabic category for ", currentCategoryHe, "row", row);
        }
        wordHe = currentCategoryHe;
        //console.log(categoryHe.name, categoryAr.name);
    }
    let wordAr = issieWords[WORD_AR_COL + row]?.v


    const imageName = issieWords[FILENAME_COL + row]?.v
    if (!imageName) {
        //console.log("ALERT:", "missing Filename", "row", row);
    }

    const wordHeObj = { name: cleanseName(wordHe), id: fileIndex, imageName: imageName + ".png", videoName: imageName + ".mp4" }
    if (!wordHeObj.name) {
        //console.log("ALERT:", "missing Hebrew word", "row", row);
    } else {
        // find the hebrew movie and icon:
        if (issieWords[STATUS_COL + row]?.v === 19) {
            let name = wordMap[wordHeObj.name] ? wordMap[wordHeObj.name] : wordHeObj.name;

            if (!fileExists(imagePath + "/" + name + ".png")) {
                console.log(missingFiles, "missing Hebrew image", name + ".png");
                missingFiles++;
            }
            let videoFilePath = videoPath + "/" + name;
            if (!fileExists(videoFilePath + ".mov")) {
                if (!fileExists(videoFilePath + ".mp4")) {
                    console.log(missingFiles, "missing Hebrew video", name);
                    missingFiles++;
                }
            }
        }
    }

    const wordArObj = { name: cleanseName(wordAr), id: fileIndex, imageName: imageName + ".png", videoName: imageName + ".mp4" }
    if (!wordArObj.name) {
        //console.log("ALERT:", "missing Arabic word", "row", row);
    }

    // Search words:
    const searchHe = issieWords[SEARCH_WORDS_HE_COL + row]?.v;
    const searchAr = issieWords[SEARCH_WORDS_AR_COL + row]?.v;

    addSearchWords(searchHe, wordHeObj);
    addSearchWords(searchAr, wordArObj);


    categoryAr.words.push(wordArObj);
    categoryHe.words.push(wordHeObj);

    //console.log("  " + wordHeObj.name, wordArObj.name);

    fileIndex++
    row++
}

//push last category:
resAr.categories.push(categoryAr);
resHe.categories.push(categoryHe);

console.log("processed rows", row - emptyRows - 1);
saveFile(resAr, "ar");
saveFile(resHe, "he");


function addSearchWords(searchWords, obj) {
    obj.tags = [];
    if (searchWords) {
        const keywords = searchWords.split(",");
        keywords.forEach(keyword => {
            obj.tags.push(keyword.trim());
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
    fs.open(targetFile + "-" + lang + ".json", 'w', function (err, file) {
        if (err) throw err;
        fs.writeSync(file, JSON.stringify(res, null, 2));
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

