import FileSystem from "./apis/filesystem";
import JSZip from 'jszip'
import { translate } from "./utils/lang";
import { trace } from "./utils/Utils";


/** 
 * Item: 
 *   name: string  category/name
 *   category
 * */
export class ShareCart {
    static STORAGE_KEY = "IssieSign_ShareCart"
    constructor() {
        this.items = [];
        let itemsStr = window.localStorage.getItem(ShareCart.STORAGE_KEY);
        if (itemsStr?.length > 0) {
            this.items = JSON.parse(itemsStr);
        }

    }
    save() {
        window.localStorage.setItem(ShareCart.STORAGE_KEY, JSON.stringify(this.items));
    }

    add(item) {
        if (!this.exists(item.name)) {
            this.items.push(item);
            this.save();
        }
    }

    get(i) {
        if (i < this.items.length) {
            const [category, name] = this.items[i].name.split("/");
            return { category, name: name || translate("sharingAllWords"), image: this.items[i].image };
        }
    }

    remove(name) {
        this.items = this.items.filter(i => i.name !== name);
        this.save();
    }

    exists(name) {
        return this.items.find(i => i.name === name);
    }
    count() { return this.items.length }

    isAllSynced() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const [category, name] = item.name.split("/");

            let fCategory = FileSystem.get().findCategory(category);
            if (!fCategory) {
                throw new Error("Missing category: " + category);
            }
            if (fCategory.userContent && fCategory.sync !== FileSystem.IN_SYNC)
                return false;

            if (!name) {
                // sharing of all category
                if (fCategory.words.filter(w => w.userContent).some(w => w.sync !== FileSystem.IN_SYNC)) {
                    return false;
                }
            } else {
                let word = FileSystem.get().findWord(category, name);
                if (!word) {
                    throw new Error("Missing word: " + name);
                }
                if (word.userContent && word.sync !== FileSystem.IN_SYNC) {
                    return false;
                }
            }
        };
        return true
    }

    async setAllSynced() {
        this.items.forEach(item => {
            const [category, name] = item.name.split("/");


            let entity = name ?
                FileSystem.get().findWord(category, name) :
                FileSystem.get().findCategory(category);

            if (!entity) {
                throw new Error("Missing word or category: " + category + "/" + name);
            }
            trace("Set sync", entity.name)
            FileSystem.get().setSync(entity, true, false);
        });

        return FileSystem.get().sync();
    }

    async generateFile() {
        const fileJson = {
            categories: []
        };

        this.items.forEach(item => {
            const [category, name] = item.name.split("/");

            let jsonCategory = fileJson.categories.find(c => c.name === category);
            if (!jsonCategory) {
                // Add category if missing
                let fCategory = FileSystem.get().findCategory(category);
                jsonCategory = {
                    name: category,
                    themeId: fCategory.themeId,
                    words: []
                }
                if (fCategory.userContent) {
                    jsonCategory.imageFileId = fCategory.imageFileId;
                    if (!(fCategory.imageFileId?.length > 0)) {
                        throw (new Error(fTranslate(MissingFolderFileID, category)))
                    }
                    jsonCategory.userContent = true;
                }
                fileJson.categories.push(jsonCategory);
            }
            if (name) {
                let word = FileSystem.get().findWord(category, name);
                if (word) {
                    let jsonWord = {
                        name,
                        videoFileId: word.videoFileId,
                    }
                    if (word.imageFileId) {
                        jsonWord.imageFileId = word.imageFileId;
                    } else {
                        throw (new Error(fTranslate(MissingWordFileID, name)))
                    }

                    jsonCategory.words.push(jsonWord);
                }
            } else {
                // share whole category
                let fCategory = FileSystem.get().findCategory(category);
                fCategory.words.forEach(word => {
                    let jsonWord = {
                        name: word.name,
                        videoFileId: word.videoFileId,
                    }
                    if (word.imageFileId) {
                        jsonWord.imageFileId = word.imageFileId;
                    }

                    jsonCategory.words.push(jsonWord);
                });
            }
        });

        return this.zipFile(JSON.stringify(fileJson));
    }

    static LIST_FILE_NAME = "fileList.json";

    async unzipFile(filePath) {
        const base64Prefix = "data:application/zip;base64,";
        const base64Prefix2 = "data:application/x-zip-compressed;base64,";

        return FileSystem.readFile(filePath).then((fileContents) => {
            let skip = 0;
            if (fileContents.startsWith(base64Prefix)) {
                skip = base64Prefix.length;
            } else if (fileContents.startsWith(base64Prefix2)) {
                skip = base64Prefix2.length;
            } else {
                console.log("zip starts with " + fileContents.substring(0, 100));
                throw ("Unknown format of an imported zip file");
            }

            let zip = new JSZip();

            return zip.loadAsync(fileContents.substr(skip), { base64: true }).then(zipEntry => {
                // only expect one file
                const fileAndFoldersCount = Object.keys(zipEntry.files).length;

                if (fileAndFoldersCount !== 1) {
                    throw (translate(ErrWrongImportFile));
                }
                const zipFileObject = zipEntry.file(ShareCart.LIST_FILE_NAME);
                if (!zipFileObject) {
                    throw (translate(ErrWrongImportFile));
                }
                return zipFileObject.async('string');
            })
        })
    }


    async zipFile(fileContents) {
        let zip = new JSZip();

        zip.file(ShareCart.LIST_FILE_NAME, fileContents, { base64: false, binary: false });

        return zip.generateAsync({ type: "blob" }).then(
            (fileBlob) => {
                return FileSystem.writeToFile(window.cordova.file.cacheDirectory, "share.zip", fileBlob).then(() => window.cordova.file.cacheDirectory + "share.zip");
            }
        );
    }

    async importWords(url) {
        const addedWords = [];
        const existingWords = [];

        return this.unzipFile(url).then(async fileContents => {
            trace("Import words content", fileContents);
            const importJson = JSON.parse(fileContents);

            let existingCategories = FileSystem.get().getCategories();

            for (const cat of importJson.categories) {
                let importedCat = existingCategories.find(c => c.name === cat.name);
                let fullPath = FileSystem.getDocDir() + "Categories/";
                if (!importedCat) {
                    if (!cat.imageFileId) {
                        throw new Error("Unexpected missing Category's FileID");
                    }
                    //create the folder
                    await FileSystem.get().getDir(cat.name, true);

                    await FileSystem.gdriveDownload(cat.imageFileId, fullPath + cat.name + "/default.jpg", true);
                    await FileSystem.get().addCategory(cat.name, { imported: true, themeId: cat.themeId });
                    existingCategories = FileSystem.get().getCategories();
                    importedCat = existingCategories.find(c => c.name === cat.name);
                }

                for (const word of cat.words) {
                    // If word exists - ignore it
                    let existingWord = FileSystem.get().findWord(cat.name, word.name);
                    if (existingWord) {
                        existingWords.push(cat.name + "/" + word.name)
                    } else {
                        trace("Add new imported word", word.name);

                        if (word.imageFileId) {
                            let imageName = cat.name + "/" + word.name + ".jpg";
                            await FileSystem.gdriveDownload(word.imageFileId, fullPath + imageName, true);
                        }

                        let videoName = cat.name + "/" + word.name + ".mov";
                        await FileSystem.gdriveDownload(word.videoFileId, fullPath + videoName, true);

                        await FileSystem.get().addWord(cat.name, word.name, { imported: true });
                        addedWords.push(cat.name + "/" + word.name);
                    }
                }
            }
            
            return {
                newWords: addedWords,
                alreadyExistingWords: existingWords
            };

        });
    }
}