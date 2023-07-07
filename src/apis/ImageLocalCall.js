import FileSystem from "./filesystem";

const getImageContent = (image): string => {
    try {

        return require("../images/adt/" + FileSystem.get().appTypePathPrefix + image);
    } catch (e) {
        console.log("Image not found", image);
        return undefined
    }
};


export const imageLocalCall = (imageName: string, isUserContent) => {
    if (imageName.startsWith("http")) return imageName;
    const sep = imageName.includes("?") ? "&" : "?"
    const cacheBuster = sep + "r=" + FileSystem.cacheBuster;
    if (imageName.startsWith("issie-")) return imageName + cacheBuster
    if (isUserContent || imageName.startsWith("file:")) {
        return FileSystem.get().getFilePath(imageName) + cacheBuster;
    }
    let res = getImageContent(imageName);

    return res;
};


export const svgLocalCall = (svgName: string) => {
    return require("../images/" + svgName);
};