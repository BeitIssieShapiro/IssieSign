

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
        return [{name:"test", nativeURL:"file:///none"}];
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
 
    if (!getDocDir() || !window.resolveLocalFileSystemURL) {
        console.log("no cordova files")
        return [{name:"test", nativeURL:"file:///none"}];
    }
    return new Promise( resolve => window.resolveLocalFileSystemURL(getDocDir() + "Additions/" + folderName, 
        additionsDir => resolve(additionsDir),
        err => resolve([]) //folder has no additions
        )
    );
}

export async function listWordsInFolder(dirEntry) {
    return new Promise( resolve =>{
        var reader = dirEntry.createReader();
        var words = [];
        reader.readEntries(entries => {
            for (let entry of entries) {
                if (entry.name == "default.jpg") continue;
                
                let nameParts = entry.name.split(".");
                let wordIndex = words.findIndex(f => f.name === nameParts[0])
                if (wordIndex < 0) {
                    words.push({name:nameParts[0], id: 1000+ words.length, type:'file'})
                    wordIndex = words.length - 1;
                }
                if (nameParts[1] === 'jpg') {
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
//    return cordova.file.documentsDirectory
}