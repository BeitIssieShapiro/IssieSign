
const getImageContent = (image):string => {
    return require("../images/adt/" + image);
};


export const imageLocalCall = (imageName:string) => {
    if (imageName.startsWith("file:")) {
        //todo android
        if (window.isAndroid) {
            return imageName;
        }
        return "issie-" + imageName; 
    }
    let res = getImageContent(imageName);

    return res;
};


export const svgLocalCall = (svgName:string) => {
    return require("../images/" + svgName);
};