import { isBrowser, saveSettingKey, HIDE_TUTORIAL_KEY, trace, getAppName } from '../utils/Utils';
import axios from 'axios';

let fileSystem;

export default class FileSystem {
    static INDEX_FILE = "index.json";

    static SCHEME_PREFIX = window.isAndroid ? "" : "issie-";


    static IN_SYNC = "in-sync";
    static SYNC_REQUEST = "sync-request";
    static SYNC_OFF_REQUEST = "sync-off-request";
    syncInProcess = false;
    hideTutorial = window.localStorage.getItem(HIDE_TUTORIAL_KEY) || false;

    setHideTutorial(isOn) {
        saveSettingKey(HIDE_TUTORIAL_KEY, isOn);
        this.hideTutorial = isOn;
    }



    index = isBrowser() ? ({
        categories: [
            {
                "name": "בודק עברית",
                "id": "בודק עברית",
                "imageName": "איברי גוף.png",
                tutorial: true,
                userContent: true,
                cloudLink: "testCategoryImageLink",
                "words": [
                    {
                        name: "מילה בעברית",
                        id: "מילה בעברית",
                        category: "בודק עברית",
                        imageName: "בודק עברית/אוזניים.png",
                        videoName: "בודק עברית/אוזניים.mov",
                        userContent: true,
                        sync: "sync-request",
                        syncErr: "testError"
                    }
                ]
            },
            {
                "name": "test2",
                "id": "test2",
                "imageName": "איברי גוף.png",
                userContent: true,
                "words": []
            }
        ]

    }) : undefined;
    cachedAllWords = undefined;

    static get() {
        return fileSystem;
    }

    static getDocDir() {
        return window['documents'];
    }

    async init(defaultContent, pubSub) {
        console.log("Init file system");
        this.pubSub = pubSub;
        if (isBrowser()) return;
        return new Promise(async (resolve, reject) => {
            let attempts = 0;
            while (attempts < 5 && !(await waitForCordova(1000))) {
                console.log("Wait for cordova..." + attempts)
                attempts++;
            };

            return window.resolveLocalFileSystemURL(FileSystem.getDocDir(),
                (docDir) => {
                    docDir.getFile(FileSystem.INDEX_FILE, { create: false, exclusive: false },
                        (indexFile) => {
                            console.log("index file exists");
                            // todo sync with existing

                            let reader = new FileReader();
                            reader.onloadend = (evt) => {
                                let data = evt.target.result;
                                this.index = JSON.parse(data);
                                console.log("Successfully read the existing index file. categories:", this.index.categories.length);
                                this.init = true;
                                resolve();
                            }
                            indexFile.file(
                                (f) => reader.readAsText(f),
                                (err) => reject(err)
                            );

                        },
                        () => {
                            this.index = { ...defaultContent };
                            this.saveIndex().then(
                                () => {
                                    this.init = true;
                                    resolve()
                                },
                                (err) => reject(err)
                            );
                        })
                })

        });
    }

    getCategories() {
        if (!this.init) {
            throw ("FileSystem isnot initialized")
        }

        let cat = this.index?.categories;
        if (cat && this.hideTutorial) {
            cat = cat.filter(c => !c.tutorial);
        }
        return cat || [];
    }

    getAllWords() {
        if (this.cachedAllWords) return this.cachedAllWords;

        let words = this.getCategories().reduce((acc, cur) => {
            return acc.concat(cur.words.map((word) => {
                word['categoryId'] = cur.id;
                return word;
            }))
        }, []);
        if (words.length > 0) {
            this.cachedAllWords = words
        }
        return words;
    }

    async saveCategory(label, imagePath) {
        let dirEntry = await this.getDir(label, true);
        await this.mvFileIntoDir(imagePath, dirEntry, "default.jpg")

        // Update index.json
        let indexCategory = this.index.categories.find(c => c.name === label)

        if (indexCategory !== undefined) {
            throw ("Category already exists");
        }
        return this.addCategory(label);
    }

    async addCategory(name, addProps) {
        this.index.categories.push({
            name,
            id: name,
            imageName: name + "/default.jpg",
            words: [],
            userContent: true,
            ...addProps
        });
        return this.saveIndex();
    }

    async saveWord(category, label, imagePath, videoPath) {
        let dirEntry = await this.getDir(category, true);
        let imageName = "";
        await this.mvFileIntoDir(videoPath, dirEntry, label + ".mov")
        if (imagePath.length > 0) {
            imageName = label + ".jpg";
            await this.mvFileIntoDir(imagePath, dirEntry, imageName);
        }


        return this.addWord(category, label)
    }

    async addWord(category, name, addProps) {
        // update index
        let indexCategory = this.index.categories.find(c => c.name === category)

        if (indexCategory === undefined) {
            throw ("Missing Category: " + category);
        }
        const newWord = {
            name,
            id: name,
            category,
            imageName: category + "/" + name + ".jpg",
            videoName: category + "/" + name + ".mov",
            userContent: true,
            ...addProps
        };
        if (indexCategory.sync == FileSystem.IN_SYNC || indexCategory.sync == FileSystem.SYNC_REQUEST) {
            newWord.sync = FileSystem.SYNC_REQUEST;
        }
        indexCategory.words.push(newWord);
        return this.saveIndex();
    }

    async deleteWord(categoryName, wordName) {
        // todo delete from cloud
        let word = this.findWord(categoryName, wordName);
        if (!word) {
            throw "Word not found: " + wordName;
        }
        let dirEntry = await this.getDir(categoryName, false);
        if (word.imageName.length > 0) {
            trace("deleting: ", word.imageName)
            let imgParts = word.imageName.split("/");
            dirEntry.getFile(imgParts[1], { create: false },
                //Success
                (imgFile) => imgFile.remove()
            );
        }
        let vidParts = word.videoName.split("/");

        dirEntry.getFile(vidParts[1], { create: false },
            //Success
            (videoFile) => videoFile.remove()
        );

        let indexCat = this.index.categories.find(c => c.name === categoryName);
        indexCat.words = indexCat.words.filter(w => w.name !== word.name);

        return this.saveIndex();
    }

    findCategory(name) {
        return this.index.categories.find(c => c.name === name);
    }

    findWord(category, name) {
        let indexCat = this.index.categories.find(c => c.name === category);
        if (indexCat) {
            return indexCat.words.find(w => w.name == name)
        }
    }

    async deleteCategory(category) {
        // todo delete from cloud
        let dirEntry = await this.getDir(category, false);
        dirEntry.removeRecursively();

        this.index.categories = this.index.categories.filter(c => c.name !== category);
        return this.saveIndex();
    }

    async saveIndex() {
        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(FileSystem.getDocDir(),

            (docDir) => {
                this.cachedAllWords = undefined;
                docDir.getFile(FileSystem.INDEX_FILE, { create: true },
                    //Success
                    (indexFile) => indexFile.createWriter((indexFileWriter) => {
                        indexFileWriter.onwriteend = function (evt) {
                            resolve();
                        };

                        indexFileWriter.write(JSON.stringify(this.index));
                    })
                    , (err) => {
                        trace("Failed saving the index file", JSON.stringify(err));
                        reject(err)
                    }
                )
            }));
    }

    static async writeToFile(dirPath, fileName, fileContents) {
        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(dirPath,
            (dirEntry) => {
                dirEntry.getFile(fileName, { create: true },
                    //Success
                    (fileEntry) => fileEntry.createWriter((fileWriter) => {
                        fileWriter.onwriteend = function (evt) {
                            resolve();
                        };

                        fileWriter.write(fileContents);
                    })
                    , (err) => {
                        trace("Save to file failed", JSON.stringify(err));
                        reject(err)
                    }
                )
            }
        ));
    }

    static readFile(filePath) {
        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath,
            (fileEntry) => fileEntry.file(
                //success
                (file) => {
                    let reader = new FileReader();
                    reader.onloadend = (evt) => {
                        resolve(evt.target.result);
                    }
                    reader.readAsDataURL(file);
                }
            )
        ));
    }

    getFilePath(name) {
        return FileSystem.SCHEME_PREFIX + FileSystem.getDocDir() + "Categories/" + decodeURIComponent(name);
    }

    async getDir(dirName, createIfMissing) {
        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(FileSystem.getDocDir(), (docDir) => {
            docDir.getDirectory("Categories", { create: createIfMissing },
                (additionsDir) => {
                    additionsDir.getDirectory(dirName, { create: true }, function (newDir) {
                        resolve(newDir);
                    },
                        (e) => reject(e)
                    );
                }, (e) => reject(e));
        }, (e) => reject(e))
        );
    }

    async mvFileIntoDir(filePath, dirEntry, newFileName) {

        return new Promise((resolve, reject) => {
            if (filePath.startsWith("http")) {
                // Downloads the content
                return axios.get(filePath, {
                    responseType: 'blob',
                    headers: {
                        'accept': 'image/jpeg'
                    }
                }).then(
                    res => {
                        dirEntry.getFile(newFileName, { create: true },
                            //Success
                            (fileEntry) => fileEntry.createWriter((fileWriter) => {
                                fileWriter.onwriteend = function (evt) {
                                    resolve();
                                };

                                fileWriter.write(res.data);
                            })
                            , (err) => {
                                reject(err)
                            }
                        )
                    })
            }

            window.resolveLocalFileSystemURL(filePath, (file) =>
                file.moveTo(dirEntry, newFileName,
                    (res) => resolve(res),
                    (err) => reject(err)
                ),
                (err) => reject(err)
            )
        });
    }


    async setSync(entity, isOn, triggerSync) {
        const getNewState = (currentState) => {
            if (isOn) {
                if (currentState === FileSystem.IN_SYNC) {
                    return FileSystem.IN_SYNC;
                } else {
                    return FileSystem.SYNC_REQUEST;
                }
            } else {
                if (!currentState || currentState === FileSystem.SYNC_REQUEST) {
                    return undefined;
                } else {
                    return FileSystem.SYNC_OFF_REQUEST
                }
            }
        }

        if (entity.words) {
            //category
            const indexCat = this.index.categories.find(c => c.name === entity.name);
            if (!indexCat.userContent)
                return;

            indexCat.sync = getNewState(indexCat.sync)
            await this.saveIndex();

            // implicitly set all category to same
            for (const word of indexCat.words) {
                await this.setSync(word, isOn, false);
            }

        } else {
            //Word
            const indexCat = this.index.categories.find(c => c.name === entity.category);

            // Implicit set the category to sync
            if (indexCat.userContent && isOn)
                indexCat.sync = getNewState(indexCat.sync)

            const word = indexCat.words.find(w => w.name === entity.name);
            if (!word.userContent)
                return;
            word.sync = getNewState(word.sync);
        }

        if (triggerSync) {
            return this.sync();
        }
    }

    // returns only after all sync files are done
    async sync() {
        if (this.syncInProcess) {
            return
        }
        this.syncInProcess = true;
        try {
            const categoriesToUnsync = [];
            for (let i = 0; i < this.index.categories.length; i++) {
                const category = this.index.categories[i];
                if (category.userContent) {
                    await this.syncOne(category, undefined, categoriesToUnsync);
                }

                trace("Sync category", JSON.stringify(category))

                for (let j = 0; j < category.words.length; j++) {
                    const word = category.words[j];
                    await this.syncOne(word, category, categoriesToUnsync);
                }
            }

            for (const cat of categoriesToUnsync) {
                await FileSystem.gdriveDelete(cat.folderId);
                delete cat.folderId;
                await this.saveIndex();
            }
        } finally {
            this.syncInProcess = false;
        }
    }

    async syncOne(entity, parentEntity, categoriesToUnsync) {
        trace("SyncOne entity", entity)
        if (entity.sync === FileSystem.SYNC_REQUEST) {
            if (entity.words) {
                const folderId = entity.folderId ? entity.folderId : "";

                const relPath = entity.name + "/" + "default.jpg";
                await this.gdriveUpload(this.getFilePath(relPath), relPath, folderId, false).then(
                    async (response) => {
                        entity.sync = FileSystem.IN_SYNC;
                        entity.imageFileId = response.fileId;
                        entity.folderId = response.folderId;
                        delete entity.syncErr
                        await this.saveIndex();
                    },
                    async (err) => {
                        entity.sync = FileSystem.SYNC_ERROR;
                        entity.syncErr = err;
                        await this.saveIndex();
                        throw err;
                    }
                );
            } else {
                try {
                    if (entity.imageName.length > 0) {
                        const response = await this.gdriveUpload(this.getFilePath(entity.imageName), entity.imageName, parentEntity.folderId, false)
                        entity.imageFileId = response.fileId;
                        parentEntity.folderId = response.folderId;
                    }
                    const response = await this.gdriveUpload(this.getFilePath(entity.videoName), entity.videoName, parentEntity.folderId, false)
                    entity.videoFileId = response.fileId;
                    parentEntity.folderId = response.folderId;
                    entity.sync = FileSystem.IN_SYNC;
                    await this.saveIndex();
                } catch (err) {
                    entity.sync = FileSystem.SYNC_ERROR;
                    entity.syncErr = err;
                    await this.saveIndex();
                    throw err;
                }
            }
        } else if (entity.sync === FileSystem.SYNC_OFF_REQUEST) {
            if (entity.imageFileId) {
                await FileSystem.gdriveDelete(entity.imageFileId);
            }
            delete entity.imageFileId
            if (entity.words) {
                // return the folderId to be deleted at the end
                categoriesToUnsync.push(entity);
            } else {
                if (entity.videoFileId) {
                    await FileSystem.gdriveDelete(entity.videoFileId);
                }
                delete entity.videoFileId
            }

            delete entity.sync;
            delete entity.syncErr;
            return this.saveIndex();
        }
    }

    //return file-key
    async gdriveUpload(filePath, relPath, folderId, isAppData) {

        // remove file:// or issie-file://
        let pos = filePath.indexOf("file://");
        if (pos >= 0) {
            filePath = filePath.substr(pos + 7);
        }

        return new Promise(async (resolve, reject) => {
            let rootFolderId = this.index.rootFolderId, rootFolderName = getAppName();

            if (!rootFolderId) {
                // try to find it in the users' Drive first
                rootFolderId = await this.findRootFolder();
            }


            window.plugins.gdrive.uploadFile(filePath, relPath, folderId, rootFolderId, rootFolderName, false,
                (response) => {
                    // sets the rootFolderId
                    if (!this.index.rootFolderId) {
                        this.index.rootFolderId = response.rootFolderId;
                        this.saveIndex().then(() => response);
                    }

                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        })
    }

    static async gdriveDownload(fileId, targetPath, isAnonymous) {

        let pos = targetPath.indexOf("file://");
        if (pos >= 0) {
            targetPath = targetPath.substr(pos + 7);
        }

        return new Promise((resolve, reject) => {
            window.plugins.gdrive.downloadFile(targetPath, fileId, isAnonymous,
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        })
    }

    static async gdriveDelete(fileId) {
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.deleteFile(fileId,
                (response) => {
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        })
    }

    static async whoAmI() {
        trace("Who Am I")
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.whoAmI(
                (response) => {
                    resolve(response);
                    trace("WhoAmI returned", response);
                },
                (error) => {
                    reject(error);
                }
            );
        })
    }

    static async logout() {
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.logout(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    resolve(error);
                }
            );
        })
    }

    // if not found, return undefined
    async findRootFolder() {
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.findFolder(getAppName(), "",
                (response) => {
                    trace("Found root folders", response.folders.length)
                    if (response.folders.length == 0) {
                        resolve(undefined);
                        return;
                    }
                    if (response.folders.length > 1 && this.index.rootFolderId) {
                        // look for one that matches the rootFolderId
                        if (response.folders.some(f => f.id === this.index.rootFolderId)) {
                            resolve(this.index.rootFolderId);
                            return;
                        }
                    }
                    resolve(response.folders[0].id);
                },
                (err) => {
                    trace("Error root folders", err)
                    reject(err);
                }
            );
        })
    }

    async listFiles(parentFolderId) {
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.fileList(parentFolderId,
                (response) => {
                    trace("list files", response?.files?.length)
                    resolve(response?.files);
                },
                (error) => {
                    reject(error);
                }
            );
        })
    }
    async sile() {

        const rootFolderId = await this.findRootFolder(getAppName());
        trace("Found root ID", rootFolderId)
        if (!rootFolderId) {
            // If not found - nothing to reconsile
            return
        }

        //save it
        this.index.rootFolderId = rootFolderId;
        await this.saveIndex();

        const filesAndFolder = await this.listFiles(rootFolderId);
        const seenFolders = []
        const fullPath = FileSystem.getDocDir() + "Categories/";
        for (const f of filesAndFolder) {
            // skip files at this level
            trace("process folder", JSON.stringify(f))
            if (f.mimeType !== "application/vnd.google-apps.folder") continue;
            const catName = f.name;
            if (seenFolders.find(seenF => seenF == catName)) continue;

            seenFolders.push(catName);

            // Get folder's files
            const catFiles = await this.listFiles(f.id);
            if (catFiles?.length > 0) {
                // get the category image
                const defFile = catFiles.find(catFile => catFile.name == "default.jpg")
                if (defFile) {
                    // download the file
                    
                    const localCat = this.findCategory(catName);
                    if (!localCat) {
                        // create it locally
                        // verify folder exists
                        await this.getDir(catName, true);
                        await FileSystem.gdriveDownload(defFile.id, fullPath + catName + "/default.jpg", false);
                        await this.addCategory(catName, {sync: FileSystem.IN_SYNC});
                    }
                }

                for (const catFile of catFiles) {
                    if (!catFile.name.endsWith(".mov")) continue;
                    const wordName = catFile.name.substring(0, catFile.name.length - 4);
                    trace("process word", wordName);

                    let localWord = this.findWord(catName, wordName);
                    if (!localWord) {
                        await FileSystem.gdriveDownload(catFile.id, fullPath + catName + "/" + catFile.name, false);

                        await this.addWord(catName, wordName);
                        localWord = this.findWord(catName, wordName);
                        localWord.videoFileId = catFile.id;

                        const imageFile = catFiles.find(f => f.name == wordName + ".jpg");
                        if (imageFile) {
                            await FileSystem.gdriveDownload(imageFile.id, fullPath + catName + "/" + imageFile.name, false);
                            localWord.imageFileId = imageFile.id;
                        } else {
                            localWord.imageName = "";
                        }
                        localWord.sync = FileSystem.IN_SYNC;
                        await this.saveIndex();
                    }
                }
            }

            console.log("folder", JSON.stringify(f));
        }

    }


}


export function waitForCordova(ms) {
    if (isBrowser() || (window.cordova && window.cordova.file && window.resolveLocalFileSystemURL && window['documents'])) {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            if (window.cordova && window.cordova.file && window.resolveLocalFileSystemURL && window['documents']) {
                resolve(true)
            }
            resolve(false)
        }, ms)
    })
}


fileSystem = new FileSystem();