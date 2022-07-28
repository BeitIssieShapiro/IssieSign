import FileSystem from "./filesystem";

const getImageContent = (image):string => {
    try {
        return require("../images/adt/" + image);
    } catch (e) {
        console.log("Image not found", image);
        return undefined
    }
};


export const imageLocalCall = (imageName:string, isUserContent) => {
    if (imageName.startsWith("http")) return imageName;

    if (isUserContent || imageName.startsWith("file:")) {
        return FileSystem.get().getFilePath(imageName);
    }
    let res = getImageContent(imageName);

    return res;
};


export const svgLocalCall = (svgName:string) => {
    return require("../images/" + svgName);
};