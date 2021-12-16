import {mainJson} from '../mainJson.js'
import {listAdditionsFolders, listWordsInFolder} from './file'

let gWordsFlat
let gAdditionalExistingCategories = []
let gAdditionalNewCategories = []
let gCategories

export function getAllWords() {
    if (gWordsFlat) return gWordsFlat;

    return getAllCategories().reduce((acc, cur) => {
        return acc.concat(cur.words.map((word) => {
            word['categoryId'] = cur.id;
            return word;
        }))
    }, []);
}

async function loadAdditional() {
    console.log("loadAdditional...")
    if (gAdditionalNewCategories) {
        return gAdditionalNewCategories;
    }
    gAdditionalExistingCategories = [];
    gAdditionalNewCategories = [];

    try {
        let addedCategories = await listAdditionsFolders()
        console.log("found " + addedCategories.length + " additional categories:");
        console.log(addedCategories.map(c => c.name) + " additional categories:");
        for (let i = 0; i< addedCategories.length;i++) {
            let words = await listWordsInFolder(addedCategories[i])
            if (mainJson.categories.find(c => c.id === addedCategories[i].name)) {
                //existing category
                gAdditionalExistingCategories.push({...addedCategories[i], id:addedCategories[i].name, words});
            } else {
                //new category
                //alert(addedCategories[i].name+" - "+JSON.stringify(words))
                gAdditionalNewCategories.push({...addedCategories[i], id:addedCategories[i].name, imageName:addedCategories[i].nativeURL + "default.jpg" , type:"added", words});
            }            
        }
        gCategories = getAllCategories();
        gWordsFlat = getAllWords();
    } catch (e) {
        console.log("Error loadAdditional:" + e);
        return Promise.reject(e)
    }
}

export function getAllCategories() {
    if (gCategories) {
        return gCategories
    }

    if (!gAdditionalNewCategories) {
        return mainJson.categories
    }

    return mainJson.categories.concat(gAdditionalNewCategories);
}

export function getWordsByCategoryID(categoryId) {
    //alert("x:" + JSON.stringify(gAdditionalExistingCategories) +","+ categoryId)
    let existingAddCategory = gAdditionalExistingCategories.find(c => c.id === categoryId)

    let foundCategory = getAllCategories().find(cat => cat.id === categoryId)
    //alert(JSON.stringify(foundCategory))
    return safeMergeWordsArray(foundCategory, existingAddCategory);
}

//refresh cache
export async function reloadAdditionals() {
    gAdditionalExistingCategories = undefined
    gAdditionalNewCategories = undefined
    gCategories = undefined
    gWordsFlat = undefined

    await loadAdditional()
}

function safeMergeWordsArray(a1, a2) {
    if (a1 && !a2) {
//        alert(JSON.stringify(a1.words))
        return a1.words
    } 
    if (!a1 && a2) {
        //alert("2")
        return a2.words
    }
    if (a1 && a2) {
 //       alert(JSON.stringify(a2.words))
        return a1.words.concat(a2.words)
    }
    return [];
}
