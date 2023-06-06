// This script copies images from source folder with sub folders into a flat new folder

const src = "/Users/i022021/Library/CloudStorage/OneDrive-SAPSE/Documents/BeirIssieShapiro/IssieSign/NewMedia/All/Images 2023";

// const removeSuffix = " עברית"
// const ignoreContaining = " ערבית"
// const target = "/Users/i022021/dev/Issie/IssieSign-MediaNew/images/he"
const ignoreContaining = " עברית"
const removeSuffix = " ערבית"
const target = "/Users/i022021/dev/Issie/IssieSign-MediaNew/images/ar"

var fs = require('fs');
var path = require('path');

fs.promises.readdir(src).then(items => {
    for (const folder of items) {
        if (folder.startsWith(".")) continue;

        const fullPath = path.join(src, folder);
        console.log("folder", folder)
        const files = fs.readdirSync(fullPath);
        for (const file of files) {
            if (!file.includes(ignoreContaining) && (file.endsWith(".png") || file.endsWith(".jpg"))) {

                const srcFile = path.join(fullPath, file);
                const stat = fs.statSync(srcFile);
                if (stat.isFile()) {
                    let fixedName = file
                    if (file.includes(removeSuffix)) {
                        fixedName = file.replace(removeSuffix, "")
                    }

                    if (file.includes(" (2)")) {
                        fixedName = file.replace(" (2)", " 2")
                    } else {
                        // look for match with "xxx (2).png"
                        const candidateImage2 = file.replace(".", " (2).")
                        const candidateImage2_2 = file.replace(".", " 2.")
                        if (files.find(f=>f == candidateImage2 || f == candidateImage2_2)) {
                            fixedName = file.replace(".", " 1.")
                        }
                    }



                    const targetFile = path.join(target, fixedName);
                    fs.copyFileSync(srcFile, targetFile, );
                    //console.log("sim-copy", srcFile, targetFile)
                }
            }
        }
    }
})

