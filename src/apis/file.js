
let isBrowser = () => {
    //for debug in browser
    return false;
}

let testWords = [{ name: "test word", id: 1000, type: 'file' }, { name: "test word2", id: 1001, type: 'file' }];
let testCategories = [{ name: "test", nativeURL: "file:///none/" }];
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
    if (isBrowser()) {
        testWords = [];
        return;
    }
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath, (file) => {
        file.remove(() => {
            let jpgFile = filePath.substring(0, filePath.length - 4) + ".jpg";
            window.resolveLocalFileSystemURL(jpgFile, (jpgFileEntry) => {
                //resolve on both error or success
                jpgFileEntry.remove(() => resolve(), () => resolve());
            },
                //resolve even if fails, assume missing file
                () => resolve())
        }, (e) => reject(e))
    }));
}

export async function deleteCategory(category) {
    if (isBrowser()) {
        testCategories = [];
        return;
    }
    return new Promise((resolve, reject) =>
        window.resolveLocalFileSystemURL(category.nativeURL, (dir) =>
            dir.removeRecursively(
                //Success
                () => resolve(),
                //Fail
                (e) => reject(e)
            )
        ));
}

export function shareWord(word) {
    if (!word) return;

    alert("share: " + word.name)
    return Promise.resolve(true)
}

function waitForCordova(ms) {
    if (isBrowser() || (window.cordova && window.cordova.file)) {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            if (window.cordova && window.cordova.file) {
                resolve(true)
            }
            resolve(false)
        }, ms)
    })
}

export async function listAdditionsFolders() {
    if (isBrowser()) return testCategories;

    return new Promise(async (resolve) => {
        let attempts = 0;
        while (attempts < 5 && !(await waitForCordova(1000))) {
            attempts++;
        };

        if (!getDocDir() || !window.resolveLocalFileSystemURL) {
            console.log("no cordova files")
            resolve([]);
            return;
        }

        window.resolveLocalFileSystemURL(getDocDir() + "Additions/", (additionsDir) => {
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
        )
    }
    );
}
export async function AdditionsDirEntry(folderName) {
    if (isBrowser()) return Promise.resolve({});

    if (!getDocDir() || !window.resolveLocalFileSystemURL) {
        console.log("no cordova files")
        return undefined;
    }

    return new Promise(resolve => window.resolveLocalFileSystemURL(getDocDir() + "Additions/" + folderName,
        additionsDir => resolve(additionsDir),
        err => resolve(undefined) //folder has no additions
    )
    );
}

export async function listWordsInFolder(dirEntry) {
    if (isBrowser()) return Promise.resolve(testWords);

    return new Promise(resolve => {
        var reader = dirEntry.createReader();
        var words = [];
        reader.readEntries(entries => {
            for (let entry of entries) {
                if (entry.name === "default.jpg") continue;
                let period = entry.name.lastIndexOf('.');
                let fileName = entry.name.substring(0, period);
                let fileExt = entry.name.substring(period + 1);
                let wordIndex = words.findIndex(f => f.name === fileName)
                if (wordIndex < 0) {
                    words.push({ name: fileName, id: 1000 + words.length, type: 'file' })
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