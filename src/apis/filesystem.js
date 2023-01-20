import { isBrowser, saveSettingKey, trace, getAppName, HIDDEN_FOLDERS_KEY } from '../utils/Utils';
import axios from 'axios';
import { translate } from '../utils/lang';
import { mainJson } from '../mainJson';

let fileSystem;

export default class FileSystem {
    static INDEX_FILE = "index.json";
    static FAVORITES_ID = "__favorites__";
    static SCHEME_PREFIX = "";

    static cacheBuster = 0;
    static IN_SYNC = "in-sync";
    static SYNC_REQUEST = "sync-request";
    static SYNC_OFF_REQUEST = "sync-off-request";
    syncInProcess = false;
    hideFolders = [];

    setHideFolder(folderName, isOn) {
        const entry = this.hideFolders.find(hf => hf.name === folderName);
        if (entry) {
            entry.hide = isOn
        } else if (isOn) {
            this.hideFolders.push({ name: folderName, hide: true })
        }
        saveSettingKey(HIDDEN_FOLDERS_KEY, JSON.stringify(this.hideFolders));
    }

    loadHiddenFolders() {
        //sets the default hiddens:
        const defaultHiddenCategories = this.index?.categories.filter(cat => cat.defaultHide === true);

        const hiddenFolders = window.localStorage.getItem(HIDDEN_FOLDERS_KEY);
        if (hiddenFolders) {
            this.hideFolders = JSON.parse(hiddenFolders);
        }
        defaultHiddenCategories.forEach(cat => {
            if (!this.hideFolders.find(f => cat.name === f.name)) {
                this.hideFolders.push({ name: cat.name, hide: true });
            }
        })
    }

    index = isBrowser() ? ({
        categories: //mainJson.categories
        [
            {
                "name": "TutorialsCategory",
                "id": "1",
                "imageName": "R587.png",
                translate: true,
                allowHide: true,
                cloudLink: "testCategoryImageLink",
                "words": [
                    {
                        name: "מילה בעברית",
                        id: "מילה בעברית",
                        category: "בודק עברית",
                        imageName: "בודק עברית/אוזניים.png",
                        videoName: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                        userContent: true,
                        sync: "sync-request",
                        syncErr: "testError"
                    }
                ]
            },
            {
                "name": "מבוגרים",
                defaultHide: true,
                allowHide: true,
                "id": "15",
                "themeId": "2",
                "imageName": "favorites.png",
                "words": []
            },
            {
                "name": "FavoritesCategory",
                translate: true,
                "id": "__favorites__",
                "themeId": "2",
                "imageName": "favorites.png",
                "words": []
            },
            {
                "name": "פירות וירקות",
                "id": "פירות וירקות",
                "imageName": "איברי גוף.png",
                themeId: "4",
                userContent: true,
                "words": [
                    {
                        name: "מילה בעברית",
                        id: "מילה בעברית",
                        category: "בודק עברית",
                        imageName: "בודק עברית/אוזניים.png",
                        videoName: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                        userContent: true,
                        sync: "sync-request",
                        syncErr: "testError"
                    },
                    {
                        name: "מילה שלישית",
                        id: "100",
                        category: "בודק עברית",
                        imageName: "A8.png",
                        videoName: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                        sync: "sync-request",
                        syncErr: "testError"
                    },

                    {
                        "name": "בפנים ובחוץ",
                        "id": "1738",
                        "imageName": "V738 1.png",
                        "imageName2": "V738 2.png",
                        "tags": [
                            "בתוך"
                        ],
                        videoName: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                    }
                ]
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
        if (!isBrowser()) {
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

                                let reader = new FileReader();
                                reader.onloadend = (evt) => {
                                    let data = evt.target.result;
                                    this.index = JSON.parse(data);

                                    // merge the default content
                                    defaultContent.categories.forEach(defCat => {
                                        const existingCat = this.index.categories.find(ec => ec.id === defCat.id);
                                        if (existingCat) {
                                            //merge cat
                                            Object.entries(defCat).forEach(([key, value]) => {
                                                if (key == "words") {
                                                    existingCat.words = defCat.words.concat(existingCat.words);
                                                } else {
                                                    existingCat[key] = value;
                                                }
                                            })
                                        } else {
                                            this.index.categories.push(defCat);
                                        }
                                    })

                                    console.log("Successfully read the existing index file. categories:", this.index.categories.length);
                                    this.init = true;
                                    this.sortCategories();
                                    this.loadHiddenFolders();

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
                                        this.sortCategories();
                                        this.loadHiddenFolders();
                                        resolve()
                                    },
                                    (err) => reject(err)
                                );
                            })
                    })

            });
        } else {
            this.init = true;
            this.sortCategories();
            this.loadHiddenFolders()
        }
    }

    sortCategories() {
        this.index.categories.sort((a, b) => a.id === FileSystem.FAVORITES_ID ? -1 : (a.name < b.name ? -1 : 1));
    }

    getCategories() {
        if (!this.init) {
            throw ("FileSystem is not initialized")
        }

        let cat = this.index?.categories;
        if (cat) {
            cat = cat.filter(c => this.hideFolders.find(hf => hf.name === c.name)?.hide !== true);
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

    async addRemoveFavorites(categoryId, title, isAdd) {
        trace("addRemoveFavorites", categoryId, title);
        const favCategory = this.index.categories.find(c => c.id === FileSystem.FAVORITES_ID);
        if (!favCategory) {
            throw new Error("addToFavorite - no favorties category found");
        }

        let category
        if (isAdd) {
            category = this.index.categories.find(c => c.name === categoryId);
        } else {
            const favWord = favCategory.words.find(w => w.name === title);
            if (favWord) {
                category = this.index.categories.find(c => c.name === favWord.category);
            } else {
                trace("word not found in fav", categoryId, title, favCategory.words.map(w => w.id + "-" + w.name));
            }
        }

        if (!category) {
            throw new Error("Category not found");
        }

        const word = category.words?.find(w => w.name === title);
        if (!word) {
            throw new Error("Word " + title + " - not found");
        }

        word.favorite = isAdd;
        if (isAdd) {
            trace("Add favorite", categoryId, title);
            // verify word is not there yet:
            if (!favCategory.words.find(w => (w.name === word.name && w.category == categoryId))) {
                favCategory.words.push({ ...word, category: categoryId });
            }
        } else {
            trace("Remove favorite", categoryId, title);
            favCategory.words = favCategory.words.filter(w => (w.name !== word.name || w.category != categoryId));
        }

        return this.saveIndex();
    }

    saveCategory(label, themeId, imagePath, originalElem, syncOn, pubSub) {
        trace("saveCategory", label, imagePath, originalElem, syncOn)
        return new Promise(async (resolve, reject) => {
            if (!originalElem) {
                // New Category

                let dirEntry = await this.getDir(label, true);
                this.mvFileIntoDir(imagePath, dirEntry, "default.jpg").then(
                    () => {
                        // Update index.json
                        let indexCategory = this.findCategory(label)

                        if (indexCategory !== undefined) {
                            reject("unexpected new category already exists")
                            return;
                        }
                        let addProps = syncOn ? { sync: FileSystem.SYNC_REQUEST, themeId } : { themeId };

                        return this.addCategory(label, addProps).then(() => {
                            if (syncOn) {
                                this.sync(pubSub)
                            }
                            resolve()
                        });
                    }
                ).catch(err => reject(err))
            } else {

                // Editing Category
                let indexCategory = this.index.categories.find(c => c.name === originalElem.name);
                if (!indexCategory) {
                    throw new Error("Edit Category not found");
                }

                const origUrl = this.getFilePath(indexCategory.imageName);
                if (origUrl === imagePath && indexCategory.themeId == themeId &&
                    label === indexCategory.name &&
                    (syncOn && (indexCategory.sync === FileSystem.SYNC_REQUEST || indexCategory.sync === FileSystem.IN_SYNC) ||
                        !syncOn && (indexCategory.sync === FileSystem.SYNC_OFF_REQUEST || !indexCategory.sync)
                    )) {
                    // no change:
                    trace("save category - no change")
                    resolve();
                    return;
                }

                indexCategory.sync = FileSystem.getNewSyncState(indexCategory.sync, syncOn);
                indexCategory.themeId = themeId;
                indexCategory.words.forEach(word => {
                    word.sync = FileSystem.getNewSyncState(word.sync, syncOn);
                });

                let dirEntry = await this.getDir(indexCategory.name, false);
                if (label !== indexCategory.name) {
                    indexCategory.name = label;
                    indexCategory.id = label;
                    //update the image names
                    indexCategory.imageName = label + "/default.jpg";

                    // change all words' image/video names
                    indexCategory.words.forEach(word => {
                        word.category = label;
                        if (word.imageName) {
                            const parts = word.imageName.split("/");
                            word.imageName = label + "/" + parts[1];
                        }
                        const videoParts = word.videoName.split("/");
                        word.videoName = label + "/" + videoParts[1];
                    })

                    if (indexCategory.folderId) {
                        indexCategory.renamed = true;
                    }
                    dirEntry.getParent(
                        (parentDir => {
                            dirEntry.moveTo(parentDir, label,
                                (movedEntry) => {
                                    if (origUrl !== imagePath) {
                                        //now replaces the image
                                        return this.mvFileIntoDir(imagePath, movedEntry, "default.jpg")
                                            .then(() => this.saveIndex().then(() => {
                                                if (indexCategory.imageFileId) {
                                                    indexCategory.imageFileIdReplaced = true;
                                                }
                                                resolve()
                                                this.sync(pubSub);
                                                return;
                                            }))
                                            .catch(err => reject(err))
                                    } else {
                                        return this.saveIndex().then(() => {
                                            resolve();
                                            this.sync(pubSub);
                                            return;
                                        });
                                    }
                                },
                                (err) => {
                                    reject(err)
                                    return;
                                }
                            )
                        }),
                        (err) => {
                            reject(err)
                            return;
                        })

                } else {
                    // no change to name
                    if (origUrl !== imagePath) {
                        //replaces the image
                        if (indexCategory.imageFileId) {
                            indexCategory.imageFileIdReplaced = true;
                        }
                        FileSystem.cacheBuster++;

                        return this.mvFileIntoDir(imagePath, dirEntry, "default.jpg")
                            .then(() => this.saveIndex().then(() => {
                                resolve();
                                return this.sync(pubSub);
                            }))
                            .catch(err => reject(err))
                    } else {
                        // only sync changed
                        return this.saveIndex().then(() => {
                            resolve()
                            this.sync(pubSub);
                        });
                    }
                }
            }
        })
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

    async saveWord(category, label, imagePath, videoPath, originalElem, syncOn, pubSub) {
        trace("saveWord", label, imagePath, videoPath, originalElem, syncOn);

        return new Promise(async (resolve, reject) => {
            try {
                if (!originalElem) {
                    // New Word
                    let dirEntry = await this.getDir(category, true);
                    let imageName = "";
                    await this.mvFileIntoDir(videoPath, dirEntry, label + ".mov")
                    if (imagePath.length > 0) {
                        imageName = label + ".jpg";
                        await this.mvFileIntoDir(imagePath, dirEntry, imageName);
                    }

                    const addProps = syncOn ? { sync: FileSystem.SYNC_REQUEST } : undefined;

                    return this.addWord(category, label, addProps).then(() => {
                        if (syncOn) {
                            // trigger and not wait for it
                            this.sync(pubSub)
                        }
                        resolve()
                    });
                } else {
                    let indexWord = this.findWord(originalElem.category, originalElem.name);
                    if (!indexWord) {
                        reject(new Error("Edited word not found"));
                        return;
                    }

                    const origImageUrl = this.getFilePath(indexWord.imageName);
                    const origVideoUrl = this.getFilePath(indexWord.videoName);
                    if (origImageUrl === imagePath &&
                        origVideoUrl === videoPath &&
                        label === indexWord.name &&
                        (syncOn && (indexWord.sync === FileSystem.SYNC_REQUEST || indexWord.sync === FileSystem.IN_SYNC) ||
                            !syncOn && (indexWord.sync === FileSystem.SYNC_OFF_REQUEST || !indexWord.sync)
                        )) {
                        // no change:
                        trace("save word - no change")
                        resolve();
                        return;
                    }

                    let dirEntry = await this.getDir(indexWord.category, false);
                    if (label !== indexWord.name) {
                        indexWord.name = label;
                        indexWord.id = label;

                        indexWord.renamed = true;
                    }

                    if (origImageUrl?.length > 0 && imagePath?.length > 0 && origImageUrl !== imagePath) {
                        await this.mvFileIntoDir(imagePath, dirEntry, label + ".jpg");
                        indexWord.imageFileIdReplaced = true;
                    } else if (indexWord.renamed) {
                        await this.mvFileIntoDir(origImageUrl, dirEntry, label + ".jpg");
                    }
                    indexWord.imageName = indexWord.category + "/" + label + ".jpg";

                    if (origVideoUrl?.length > 0 && videoPath?.length > 0 && origVideoUrl !== videoPath) {
                        await this.mvFileIntoDir(imagePath, dirEntry, label + ".mov");
                        indexWord.videoFileIdReplaced = true;
                    } else if (indexWord.renamed) {
                        await this.mvFileIntoDir(origVideoUrl, dirEntry, label + ".mov");
                    }
                    indexWord.videoName = indexWord.category + "/" + label + ".mov";

                    if (label !== indexWord.name) {
                        indexWord.name = label;
                        indexWord.id = label;

                        indexWord.renamed = true;
                    }

                    indexWord.sync = FileSystem.getNewSyncState(indexWord.sync, syncOn);
                    return this.saveIndex().then(
                        () => {
                            this.sync(pubSub);
                            resolve()
                        },
                        (err) => reject(err)
                    )
                }
            } catch (e) { reject(e) }
        });
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
            throw new Error("Word not found: " + wordName);
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
        if (isBrowser()) return;

        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(FileSystem.getDocDir(),

            (docDir) => {
                this.cachedAllWords = undefined;
                docDir.getFile(FileSystem.INDEX_FILE, { create: true },
                    //Success
                    (indexFile) => indexFile.createWriter((indexFileWriter) => {
                        indexFileWriter.onwriteend = function (evt) {
                            resolve();
                        };

                        const userContentJson = {
                            indexVersion: this.index.indexVersion,
                            categories: [],
                        };
                        this.index.categories.forEach(cat => {
                            if (cat.userContent) {
                                userContentJson.categories.push(cat);
                            } else {
                                const userWords = cat.words?.filter(w => w.userContent);
                                if (userWords?.length > 0) {
                                    userContentJson.categories.push({
                                        ...cat, words: userWords,
                                    })
                                }
                            }
                        })

                        var blob = new Blob([JSON.stringify(userContentJson)], { type: "text/plain" });
                        indexFileWriter.write(blob);
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
                },
                (err) => reject(err)
            ),
            (err) => reject(err)
        ));
    }

    getFilePath(name, forUpload) {
        if (name.startsWith("file://")) {
            if (window.isAndroid) {
                // const assetPrefix = "file://android_asset/";
                // let skip = 7;
                // if (name.startsWith(assetPrefix)) {
                //     // option 1: file://android_asset/...
                //     skip = assetPrefix.length;
                // } else if (name.startsWith(window.filesPrefix)) {
                //     // option 2: file:///data/user/0/com.issieshapiro.myissiesign/
                //     skip = window.filesPrefix.length;
                // }
                // return document.basePath + name.substr(skip);
                trace("not expected to arrive here!")
                throw new Error("getFilePath with file:// in android - not expected")
            }
            return "issie-" + name;
        } else if (name.startsWith("http")) {
            return name;
        }

        const relPath = "Categories/" + decodeURIComponent(name);

        if (forUpload && window.isAndroid) {
            let filePath = window.documents + relPath;
            if (filePath.startsWith("file://")) {
                filePath = filePath.substr(7);
            }
            return filePath;
        }
        if (window.isAndroid) {
            return "https://localhost/__cdvfile_files__/" + relPath;
        }
        //return "https://localhost/__cdvfile_documents__/" + relPath;
        return "issie-" + FileSystem.getDocDir() + relPath;
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
                    },
                    err => reject(err))
            }

            trace("move file", filePath)
            if (filePath.startsWith("issie-")) {
                filePath = filePath.substr(6);
            }
            window.resolveLocalFileSystemURL(filePath, (file) => {
                trace("found file")
                file.moveTo(dirEntry, newFileName,
                    (res) => {
                        trace("move succeeded", dirEntry.fullPath, newFileName);
                        resolve(res)
                    },
                    (err) => reject(err)
                )
            },
                (err) => reject(err)
            )
        });
    }

    static async getHttpURLForFile(filePath) {
        trace("getHttpURLForFile", filePath);
        return new Promise((resolve, reject) => window.resolveLocalFileSystemURL(filePath,
            (file) => {
                trace("getHttpURLForFile -result", file.toURL(), file.fullPath);
                resolve(file.toURL())
            },
            (err) => reject(err)
        ));
    }

    static getNewSyncState = (currentState, isOn) => {
        if (isOn) {
            if (currentState === FileSystem.IN_SYNC || currentState === FileSystem.SYNC_OFF_REQUEST) {
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

    async setSync(entity, isOn, triggerSync) {
        if (entity.words) {
            //category
            const indexCat = this.index.categories.find(c => c.name === entity.name);
            if (!indexCat.userContent)
                return;

            indexCat.sync = FileSystem.getNewSyncState(indexCat.sync, isOn)
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
                indexCat.sync = FileSystem.getNewSyncState(indexCat.sync, isOn)

            const word = indexCat.words.find(w => w.name === entity.name);
            if (!word.userContent)
                return;
            word.sync = FileSystem.getNewSyncState(word.sync, isOn);
        }

        if (triggerSync) {
            return this.sync();
        }
    }

    // returns only after all sync files are done
    async sync(pubSub) {
        if (this.syncInProcess) {
            return
        }
        this.syncInProcess = true;

        if (pubSub) {
            pubSub.publish({ command: "long-process", msg: translate("SyncToCloudMsg") });
        }

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
            if (pubSub) {
                pubSub.publish({ command: "long-process-done" });
            }
        }
    }

    async syncOne(entity, parentEntity, categoriesToUnsync) {
        trace("SyncOne entity", entity)
        if (entity.sync === FileSystem.IN_SYNC) {
            if (entity.imageFileIdReplaced || entity.renamed || entity.videoFileIdReplaced) {
                if (entity.imageFileIdReplaced) {
                    await FileSystem.gdriveDelete(entity.imageFileId);
                    delete entity.imageFileIdReplaced;
                    delete entity.imageFileId;
                    entity.sync = FileSystem.SYNC_REQUEST;
                }

                if (entity.videoFileIdReplaced) {
                    await FileSystem.gdriveDelete(entity.videoFileId);
                    delete entity.videoFileIdReplaced;
                    delete entity.videoFileId;
                    entity.sync = FileSystem.SYNC_REQUEST;
                }

                if (entity.renamed) {
                    if (entity.words) {
                        // Category renamed
                        await FileSystem.gdriveRename(entity.folderId, entity.name);
                    } else {
                        // Word renamed - rename both files
                        if (entity.imageFileId) {
                            await FileSystem.gdriveRename(entity.imageFileId, entity.name + ".jpg");
                        }
                        if (entity.videoFileId) {
                            await FileSystem.gdriveRename(entity.videoFileId, entity.name + ".mov");
                        }
                    }
                    delete entity.renamed;
                }
                await this.saveIndex();
            }
        }

        if (entity.sync === FileSystem.SYNC_REQUEST) {
            if (entity.words) {
                const folderId = entity.folderId ? entity.folderId : "";

                const relPath = entity.name + "/" + "default.jpg";
                const properties = {
                    themeId: entity.themeId,
                }
                await this.gdriveUpload(this.getFilePath(relPath, true), relPath, folderId, false, properties).then(
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
                        const response = await this.gdriveUpload(this.getFilePath(entity.imageName, true), entity.imageName, parentEntity.folderId, false, null)
                        entity.imageFileId = response.fileId;
                        parentEntity.folderId = response.folderId;
                    }
                    const response = await this.gdriveUpload(this.getFilePath(entity.videoName, true), entity.videoName, parentEntity.folderId, false, null)
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
    async gdriveUpload(filePath, relPath, folderId, isAppData, properties) {

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
                if (!rootFolderId) {
                    trace("No root folder found");
                    rootFolderId = "";
                }
            }


            window.plugins.gdrive.uploadFile(filePath, relPath, folderId, rootFolderId, rootFolderName, false, properties,
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

    static async gdriveRename(id, newName) {
        return new Promise((resolve, reject) => {
            window.plugins.gdrive.rename(id, newName,
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
        if (isBrowser()) return "";

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
    async reconsile() {

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
                    console.log("download def file", defFile)
                    const localCat = this.findCategory(catName);
                    if (!localCat) {

                        // create it locally
                        // verify folder exists
                        await this.getDir(catName, true);
                        await FileSystem.gdriveDownload(defFile.id, fullPath + catName + "/default.jpg", false);
                        await this.addCategory(catName,
                            {
                                sync: FileSystem.IN_SYNC,
                                imageFileId: defFile.id,
                                folderId: f.id,
                                themeId: defFile.properties?.themeId || "3",
                            });
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