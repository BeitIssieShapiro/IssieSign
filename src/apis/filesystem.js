import { isBrowser, saveSettingKey, HIDE_TUTORIAL_KEY } from '../utils/Utils';
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
                tutorial:true,
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
            console.log("fs not init")
        }

        let cat = this.index?.categories;
        if (cat && this.hideTutorial) {
            cat = cat.filter(c=>!c.tutorial);
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
            // already exists -  unexpected
            console.log("Category already exists", label);
            throw ("Category already exists");
        }
        return this.addCategory(label);
    }

    async addCategory(name) {
        this.index.categories.push({
            name,
            id: name,
            imageName: name + "/default.jpg",
            words: [],
            userContent: true,
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

    async addWord(category, name) {
        // update index
        let indexCategory = this.index.categories.find(c => c.name === category)

        if (indexCategory === undefined) {
            console.log("Missing Category", category);
            throw ("Missing Category: " + category);
        }
        const newWord = {
            name,
            id: name,
            category,
            imageName: category + "/" + name + ".jpg",
            videoName: category + "/" + name + ".mov",
            userContent: true,

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
            throw "word not found: " + wordName;
        }
        let dirEntry = await this.getDir(categoryName, false);
        if (word.imageName.length > 0) {
            console.log("deleting: ", word.imageName)
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
        console.log("find category", name)
        return this.index.categories.find(c => c.name === name);
    }

    findWord(category, name) {
        console.log("find", category, name)
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
                        console.log("failed saving index file", JSON.stringify(err));
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
                        console.log("save to file failed", JSON.stringify(err));
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
        console.log("move " + JSON.stringify(filePath) + " to " + dirEntry);

        return new Promise((resolve) => {
            if (filePath.startsWith("http")) {
                // Downloads the content
                axios.get(filePath, {
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
                                console.log("save file from URL failed", JSON.stringify(err));
                                reject(err)
                            }
                        )
                    })
            }
            window.resolveLocalFileSystemURL(filePath, (file) => {
                console.log("resolve local file to " + file);

                file.moveTo(dirEntry, newFileName, (res) => {
                    console.log("move success");
                    resolve(res);
                },
                    (err) => console.log("move failed" + err));
            }, (err) => console.log("resolve local file failed" + JSON.stringify(err)))
        });
    }


    async setSync(entity, isOn, triggerSync) {
        console.log("set sync", entity.name, isOn ? "on" : "off")
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

                console.log("synced category", JSON.stringify(category))

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
        // Start syncing entity
        console.log("Sync entity", entity)
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

        return new Promise((resolve, reject) => {
            const rootFolderId = this.index.rootFolderId, rootFolderName = "MyIssieSign";

            window.plugins.gdrive.uploadFile(filePath, relPath, folderId, rootFolderId, rootFolderName, false,
                (response) => {
                    console.log("upload response", JSON.stringify(response));

                    // sets the rootFolderId
                    if (!this.index.rootFolderId) {
                        this.index.rootFolderId = response.rootFolderId;
                        this.saveIndex.then(() => response);
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
                    console.log("Download response", JSON.stringify(response));
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
                    console.log("Delete response", JSON.stringify(response));
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        })
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