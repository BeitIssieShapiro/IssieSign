

export async function createDir(dirName) {
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(getDocDir(), (docDir) => {
        docDir.getDirectory("Additions", { create: true }, function (additionsDir) {
            additionsDir.getDirectory(dirName, { create: true }, function (newDir) {
                resolve(newDir);
            }, (e) => reject(e));
        }, (e) => reject(e));
    }, (e) => reject(e))
    );
}

export async function mvFileIntoDir(filePath, dirEntry, newFileName) {
    return new Promise((resolve) => window.resolveLocalFileSystemURL(filePath, (file) => {
        file.moveTo(dirEntry, newFileName, (res) => {
            resolve(res);
        });
    }));
}
//expects the filePath to be  .MOV filePath
export async function deleteWord(filePath) {
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath, (file) => {
        file.remove(()=>{
            let jpgFile = filePath.substring(0, filePath.length-4) + ".jpg";
            window.resolveLocalFileSystemURL(jpgFile, (jpgFileEntry) => {
                //resolve on both error or success
                jpgFileEntry.remove(()=>resolve(), ()=>resolve());
            },
            //resolve even if fails, assume missing file
            ()=>resolve())
        }, (e)=>reject(e))
    }));
}

export async function listAdditionsFolders() {
    if (!getDocDir() || !window.resolveLocalFileSystemURL) {
        console.log("no cordova files")
         return [{name:"test", nativeURL:"file:///none/"}];
        return [];
    }
    return new Promise( resolve => window.resolveLocalFileSystemURL(getDocDir() + "Additions/", (additionsDir) => {
        var reader = additionsDir.createReader();
        reader.readEntries(entries => {
            resolve(entries);
        },
            err => {
                //no folders?
                resolve([]);
            }
        );
    },
        err => /*not a folder?*/ resolve([])
    ));
}
export async function AdditionsDirEntry(folderName) {
    if (!getDocDir() || !window.resolveLocalFileSystemURL) {
        console.log("no cordova files")
        return undefined;
    }
 
    return new Promise( resolve => window.resolveLocalFileSystemURL(getDocDir() + "Additions/" + folderName, 
        additionsDir => resolve(additionsDir),
        err => resolve(undefined) //folder has no additions
        )
    );
}

export async function listWordsInFolder(dirEntry) {
    return new Promise( resolve =>{
        var reader = dirEntry.createReader();
        var words = [];
        reader.readEntries(entries => {
            for (let entry of entries) {
                if (entry.name === "default.jpg") continue;
                var period = entry.name.lastIndexOf('.');
                var fileName = entry.name.substring(0, period);
                var fileExt = entry.name.substring(period + 1);
                let wordIndex = words.findIndex(f => f.name === fileName)
                if (wordIndex < 0) {
                    words.push({name:fileName, id: 1000+ words.length, type:'file'})
                    wordIndex = words.length - 1;
                }
                if (fileExt === 'jpg') {
                    words[wordIndex].imageName = entry.nativeURL;
                } else {
                    words[wordIndex].videoName = entry.nativeURL;
                }
            }

            resolve(words);
        },
            err => {
                //no folders?
                resolve(words);
            }
        );

    });
}



function getDocDir() {
    return window['documents'];
}