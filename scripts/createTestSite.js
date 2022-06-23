
var srcJson = '/Users/i022021/Downloads/issieJson-he.json'
var targetMedia = '/Users/i022021/dev/issie/IssieSign-MediaNew'


var fs = require('fs');
let rawdata = fs.readFileSync(srcJson);
let model = JSON.parse(rawdata);


let output = "<html><head> <meta charset=\"UTF-8\"></head><body><h1>List of words</h1>\n"
output += "<div dir='rtl'>"
output += `<table border="1"><tr><th>קטגוריה</th><th>שם</th><th>תמונה</th><th>סרטון</th><th>מילות חיפוש</th></tr>\n`
model.categories.forEach(cat=>{
    output += "<tr><td>"+cat.name+"</td><td/></tr>\n"
    cat.words.forEach(word=>{
        output += `<tr>
    <td/>
    <td>${word.name}</td>
    <td><img src="../IssieSign-MediaNew/images/he/${word.imageName}" width="30" height="30"/></td>
    <td>
        <xvideo  width="80" height="40" >
            <source src="../IssieSign-MediaNew/videos/he/prod/${word.videoName}"
                type="video/mp4" preload="auto"/>
        </xvideo>
    </td>
    <td>${word.tags.join(",")}</td>
</tr>\n`
    })
})
output+= "</table></div></body></html>"

saveFile("test.html", output);

function saveFile(path, content) {
    fs.open(path, 'w',  (err, file) => {
        if (err) throw err;
        fs.writeSync(file, content);
        fs.closeSync(file);
    });
}
