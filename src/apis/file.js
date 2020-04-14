import JSZip from 'jszip'

let isBrowser = () => {
    //for debug in browser
    return false;
}

let testWords = [{ name: "test word", id: 1000, type: 'file' }] //, { name: "test word2", id: 1001, type: 'file' }];
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
    console.log("move "+filePath + "to " + dirEntry);
    return new Promise((resolve) => window.resolveLocalFileSystemURL(filePath, (file) => {
        console.log("resolve local file to " + file);

        file.moveTo(dirEntry, newFileName, (res) => {
            console.log("move success");
            resolve(res);
        },
        (err)=>console.log("move failed" + err));
    }, (err)=>console.log("resolve local file failed"+ err)));
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

function share(text, title, mimetype, success, error) {
    if (typeof text !== "string") {
        text = "";
    }
    if (typeof title !== "string") {
        title = "Share";
    }
    if (typeof mimetype !== "string") {
        mimetype = "text/plain";
    }
    console.log("about to share via cordova exec")
    window.cordova.exec(success, error, "Share", "share", [text, title, mimetype]);
    console.log("share via cordova exec completed")
    return true;
};

export async function shareWord(word) {
    if (!word) return;

    let paths = [word.videoName, word.imageName];
    let zipPath = await zipWord(paths);
    zipPath = zipPath.replace("file://", "")
    share(zipPath, "", "", () => { }, (err) => alert(err));
}

function waitForCordova(ms) {
    if (isBrowser() || (window.cordova && window.cordova.file && window.resolveLocalFileSystemURL && getDocDir())) {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            if (window.cordova && window.cordova.file && window.resolveLocalFileSystemURL && getDocDir()) {
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
            console.log("Wait for cordova..." + attempts)
            attempts++;
        };


        if (!getDocDir() || !window.resolveLocalFileSystemURL) {
            console.log("no cordova files")
            resolve([]);
            return;
        }

        window.resolveLocalFileSystemURL(getDocDir() + "Additions/", (additionsDir) => {
            var reader = additionsDir.createReader();
            console.log("Reading Additions folder");
            reader.readEntries(entries => {
                resolve(entries);
            },
                err => {
                    //no folders?
                    console.log("Error loading Additions: ", err)
                    resolve([]);
                }
            );
        },
            err => /*not a folder?*/ resolve([])
        )
    }
    );
}
// export async function AdditionsDirEntry(folderName) {
//     if (isBrowser()) return Promise.resolve({});

//     if (!getDocDir() || !window.resolveLocalFileSystemURL) {
//         console.log("no cordova files")
//         return undefined;
//     }

//     return new Promise(resolve => window.resolveLocalFileSystemURL(getDocDir() + "Additions/" + folderName,
//         additionsDir => resolve(additionsDir),
//         err => resolve(undefined) //folder has no additions
//     )
//     );
// }

export async function listWordsInFolder(dirEntry) {
    if (isBrowser()) return Promise.resolve(testWords);

    if (!dirEntry || !dirEntry.createReader) return;

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
                if (fileExt === 'jpg' || fileExt === 'png') {
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

export async function zipWord(paths) {
    let zip = new JSZip();

    console.log("Zipping: ", paths)
    let handledFolders = {};
    let zipFileName = "word.zip";
    for (let i = 0; i < paths.length; i++) {
        let parts = paths[i].split("/");
        let folderName = decodeURIComponent(parts[parts.length - 2]);
        let fileName = decodeURIComponent(parts[parts.length - 1]);
        zipFileName = getFileNameWithoutExt(fileName) + ".zip";

        console.log('Adding file:', fileName, ' in folder: ', folderName);
        let folderZip = zip.folder(folderName);
        if (!handledFolders[folderName]) {
            handledFolders[folderName] = true;
            //look for default.jpg in the folder:
            parts[parts.length - 1] = "default.jpg"
            let defaultJpgPath = parts.join('/');
            console.log('Looking for ', defaultJpgPath);
            try {
                let defaultJpg = dataURL2Blob(await readFile(defaultJpgPath));
                console.log('Found default.jpg');
                folderZip.file("default.jpg", defaultJpg);
            } catch (e) {/*ok if missing*/ }
        }

        folderZip.file(fileName, dataURL2Blob(await readFile(paths[i])));
    }

    console.log("Generate Zip file");
    return zip.generateAsync({ type: "blob" }).then(
        async (fileBlob) => {
            //console.log("Generate finish, convert to blob");
            //let fileBlob = b64toBlob(content, "application/zip");
            //save to tmp file
            let fileName = window.cordova.file.tempDirectory + zipFileName;
            console.log("About to save blob to tmp file", fileName);
            await writeBlobToFile(fileName, fileBlob);
            console.log("blob saved");
            return fileName;
        }
    );
}

function dataURL2Blob(dataURL) {
    if (dataURL.startsWith('data:')) {
        //look for the ;
        let semicolonPos = dataURL.indexOf(';')
        if (semicolonPos > 0) {
            let mimeType = dataURL.substring(5, semicolonPos);
            let contentStart = dataURL.indexOf(',', semicolonPos);
            return b64toBlob(dataURL.substr(contentStart + 1), mimeType)
        }

    }
    return null;
}

async function writeBlobToFile(filePath, fileBlob) {
    let parts = filePath.split('/');
    let fileName = parts[parts.length - 1];
    parts.pop();
    let folderName = parts.join('/');
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(folderName,
        (dirEntry) => {
            dirEntry.getFile(fileName, { create: true },
                //Success
                (fileEntry) => fileEntry.createWriter((fileWriter) => {
                    fileWriter.onwriteend = function (evt) {
                        resolve();
                    };

                    fileWriter.write(fileBlob);
                })
                , (err) => {
                    console.log("save blob to file failed", JSON.stringify(err));
                    reject(err)
                }
            )
        }
    ));
}

const base64Prefix = "data:application/zip;base64,";


async function readFile(filePath) {
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath, (fileEntry) => {
        fileEntry.file(
            //success
            (file) => {
                console.log("About to read file");
                let reader = new FileReader();
                reader.onloadend = (evt) => {
                    console.log("Successfully read file");
                    resolve(evt.target.result);
                }
                reader.readAsDataURL(file);
            }
            , (err) => reject(err)
        )
    },
        (err) => reject(err)));

}

export async function receiveIncomingZip(filePath) {
    return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath, (fileEntry) => {
        fileEntry.file(
            //success
            (file) => {
                let reader = new FileReader();
                reader.onloadend = (evt) => {
                    console.log("Importing file into IssieSign");
                    let zipFile = new JSZip();
                    //console.log(JSON.stringify(evt.target.result))
                    if (!evt.target.result.startsWith(base64Prefix)) {
                        reject("unknown format of an input file");
                        return;
                    }

                    let retData = [];
                    zipFile.loadAsync(evt.target.result.substr(base64Prefix.length), { base64: true }).then(zipEntry => {
                        let fileAndFoldersCount = Object.keys(zipEntry.files).length;
                        let countSoFar = 0;
                        zipEntry.forEach(async (relativePath, fileObj) => {
                            //at this level, we expect only folder(s)
                            console.log("Zip entry:", relativePath, ", count:" + countSoFar);
                            if (fileObj.dir) {
                                countSoFar++;
                                console.log("Dir entry:", fileObj.dir ? "<Dir> " : "<File> ", relativePath);
                                //for each folder, we save it with all its file-only contents
                                let categoryName = relativePath.replace("/", "")
                                let category = { name: categoryName, words: [] }
                                retData.push(category);

                                let dirEntry = await createDir(categoryName);
                                let folder = zipEntry.folder(relativePath);
                                folder.forEach(async (inFilePath, inFileObj) => {
                                    if (!inFileObj.dir) {
                                        await saveZipEntryToFile(dirEntry, inFilePath, inFileObj).then(() => {
                                            let fileNameWithoutExt = getFileNameWithoutExt(inFilePath)
                                            if (fileNameWithoutExt !== "default" && !category.words.find(f => f === fileNameWithoutExt)) {
                                                category.words.push(fileNameWithoutExt)
                                            }
                                            countSoFar++;
                                        })
                                    } else {
                                        countSoFar++;
                                    }
                                    console.log("finish file:", inFilePath, ", count:" + countSoFar);
                                    if (countSoFar === fileAndFoldersCount) {
                                        console.log("Finish Load Zip")
                                        resolve(retData);
                                    }
                                });
                            }

                        });
                    },
                        (err) => {
                            console.log("Error reading zip:", err);
                            reject(err);
                        })
                };
                reader.readAsDataURL(file);
            },
            //fail
            (err) => { reject(err) }
        );
    }));
}


function saveZipEntryToFile(dirEntry, relativePath, zipFileObj) {
    return new Promise((resolve, reject) => {
        dirEntry.getFile(relativePath, { create: true },
            //Success
            (fileEntry) => {
                fileEntry.createWriter((fileWriter) => {
                    fileWriter.onwriteend = function (evt) {
                        resolve();
                    };

                    zipFileObj.async("base64").then(
                        content => fileWriter.write(b64toBlob(content, getContentType(relativePath))),
                        err => reject(err)
                    )
                })
            }
            ,//Fail
            err => reject(err)
        )


    })
}






function getDocDir() {
    return window['documents'];
}


/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function getFileNameWithoutExt(fileName) {
    let lastDot = fileName.lastIndexOf('.');
    if (lastDot > 0) {
        return fileName.substring(0, lastDot);
    }
    return fileName;
}

function getContentType(fileName) {
    let fnLower = fileName.toLowerCase();
    if (fnLower.endsWith(".jpg") || fnLower.endsWith(".jpeg")) {
        return "image/jpeg"
    }

    if (fnLower.endsWith(".mp4") || fnLower.endsWith(".mov")) {
        return "application/mp4"
    }
    if (fnLower.endsWith(".png")) {
        return "image/png"
    }
    if (fnLower.endsWith(".mpeg")) {
        return "video/mpeg"
    }

}