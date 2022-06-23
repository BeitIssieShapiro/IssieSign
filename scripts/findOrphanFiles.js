


const srcJson = '/Users/i022021/Downloads/issieJson-he.json';
const mediaPath = '/Users/i022021/dev/issie/IssieSign-Media/'

var fs = require('fs');
let rawdata = fs.readFileSync(srcJson);
let model = JSON.parse(rawdata);

const existingFiles = [
    "אדום",
    "ארנבת",

];

const reshootFiles = [
    "איך",
    "איפה",
    "בית",
    "מי", 
    "מתחת",
    "עוגייה"

]

const knownOrphans = [
    "אנשים", //not found
    "בגדים", //not found
    "בובה", //reshoot
    "חג", //not found
    "טוסט", //found with questions?
    "יום הולדת", //not found
    "ליד", //not found
    "לעלות ולרדת", // not found
    "לצחוק", // not found
    "שבת", // not found
    "כפית", //missing file name in excel
]

const knownImageOrphans = [
    "לפני",
    "ארוך קצר",
    "קשה רך",
    "רך",
    "קצר",
    "גבוה נמוך",
    "נמוך",
    "אחרי",
    "בחוץ",
    "בפנים בחוץ",
    "גדול קטן",
    "הרבה קצת",
    "דומה שונה",
    "שונה",
    "למטה למעלה",
    "למעלה",
    "הרבה קצת",
    "קצת",
    "חבר חברה",
    "חם קר",
    "קר",
    "יבש רטוב",
    "רטוב",
    "יפה מכוער",
    "מכוער",
    "ישן חדש",
    "חדש",
    "ישן",
    "לאט מהר",
    "מהר",
    "לפני אחרי",
    "מלא ריק",
    "ריק",
    "מלוכלך נקי",
    "נקי",
    "קרוב רחוק",
    "רחוק",
    "שקט רועש",
    "רועש",
    "רועד",


    "בתיאבון", //exists without י
    "גירפה",
    "היפופטם", //exists in right spelling
    "זמן משחק שם קטגוריה", //duplicate with זמן משחק
    "זמנים שם קטגוריה", //same
    "יופי! טוב מאוד!", // dup with יופי
    "כנסיה", //dup with כנסייה
    "נעלים", //dup with נעליים
    "דוד דודה", // dup with דוד ודודה
    "כיסא גלגלים", //dup with כסא גלגלים
    "עיניים", //not found
    "עךה", //not found
    "ענן", // dup with עננים
    "פיזיותרפיסטית", //dup with פיזיותרפיסט
    "רופאת שיניים", //dup with רופא שיניים
    "מעדן_2", //dup with מעדן
    "תרנגולת", //dup with תרנגול
    "לקנח אף", //dup with לקנח את האף
    "על (2)", //dup with על

]

let items = fs.readdirSync(mediaPath + "videos/he/prod");
for (let i=0; items && i<items.length; i++) {
    if (items[i].startsWith(".")) continue;
    
    if (existingFiles.find(e=>items[i].startsWith(e + ".") )) continue;
    if (reshootFiles.find(e=>items[i].startsWith(e + "."))) continue;
    if (knownOrphans.find(e=>items[i].startsWith(e + "."))) continue;

    if (!model.categories.some(c=> c.words.some(w=>w.oldVideoName === items[i]))) {
        console.log(items[i])
    }
}

 items = fs.readdirSync(mediaPath + "images/he");
for (let i=0; items && i<items.length; i++) {
    if (items[i].startsWith(".")) continue;
    
    if (existingFiles.find(e=>items[i].startsWith(e + ".") )) continue;
    if (reshootFiles.find(e=>items[i].startsWith(e + "."))) continue;
    if (knownOrphans.find(e=>items[i].startsWith(e + "."))) continue;
    if (knownImageOrphans.find(e=>items[i].startsWith(e + "."))) continue;

    knownImageOrphans
    if (!model.categories.some(c=> c.words.some(w=>w.oldImageName === items[i] || w.oldImageName2 === items[i]))) {
        console.log("image:", items[i])
    }
}



