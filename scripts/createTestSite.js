var fs = require('fs');


function create (lang) {
    var srcJson = '/Users/i022021/dev/Issie/IssieSign/jsons/' + lang + '/mainJson.js'

    let imgSrc = '../IssieSign-MediaNew/images/'+lang+'/'
    let videoImagesSrc = '/Users/i022021/dev/issie/IssieSign-MediaNew/videos/'+lang+'/ext-images/';

    // let imgSrc = lang+'/'
    // let videoImagesSrc = '/ext-images-he/';


    let rawdata = fs.readFileSync(srcJson);
    let model = JSON.parse(rawdata);

    let output = "<html><head> <meta charset=\"UTF-8\"></head><body><h1>List of words</h1>\n"
    output += "<div dir='rtl'>"
    output += `<table border="1"><tr><th>קטגוריה</th><th>שם</th><th>תמונה</th><th>סרטון</th><th>מילות חיפוש</th></tr>\n`
    model.categories.forEach(cat => {
        output += "<tr><td>" + cat.name + "(" + cat.id + `)</td><td><img src="${imgSrc}${cat.imageName}" width="150" height="150"/></td></tr>\n`
        cat.words.forEach(word => {
            output += `<tr>
    <td/>
    <td>${word.name}-${word.id}</td>
        <td>
            <img src="${imgSrc}${word.imageName}" width="80" height="80"/>
            ${word.imageName}
            ${word.imageName2 ? ('<img src=' +imgSrc + word.imageName2 + '" width="30" height="30"/>') : ""}
        </td>
    <td>
    <img src="${videoImagesSrc}${word.videoName}.jpg" width="180" height="80"/>
    ${word.videoName}
        
    </td>
    <td>${word.tags && word.tags.join(",")}</td>
</tr>\n`
        })
    })
    output += "</table></div></body></html>"


    saveFile("test_" + lang + ".html", output);
}

create("he");
create("ar")

function saveFile(path, content) {
        fs.open(path, 'w', (err, file) => {
            if (err) throw err;
            fs.writeSync(file, content);
            fs.closeSync(file);
        });
    }
