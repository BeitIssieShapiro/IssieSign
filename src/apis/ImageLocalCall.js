import FileSystem from "./filesystem";

const getImageContent = (image): string => {
    try {
        return require("../images/adt/" + image);
    } catch (e) {
        console.log("Image not found", image);
        return undefined
    }
};


export const imageLocalCall = (imageName: string, isUserContent) => {
    const cacheBuster = "?r=" + FileSystem.cacheBuster;
    if (imageName.startsWith("http") || imageName.startsWith("issie-")) return imageName + cacheBuster
    if (isUserContent || imageName.startsWith("file:")) {
        return FileSystem.get().getFilePath(imageName) + cacheBuster;
    }
    let res = getImageContent(imageName);

    return res;
};


export const svgLocalCall = (svgName: string) => {
    return require("../images/" + svgName);
};