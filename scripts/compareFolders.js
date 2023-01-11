
var fs = require('fs');

const path1 = "/Users/i022021/dev/Issie/IssieSign-MediaNew/videos/he/prod"
const path2 = "/Users/i022021/dev/Issie/IssieSign-MediaNew/videos/he/prod/compact"

fs.promises.readdir(path1).then(items1 => {
    fs.promises.readdir(path2).then(items2 => {
        items1.forEach(f1=>{
            if (!items2.find(f2=>f2 == f1)) {
                console.log("missing:", f1)
            }
        })
    });
})
