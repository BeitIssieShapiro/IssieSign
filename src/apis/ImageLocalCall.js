
const getImageContent = (image):string => {
    return require("../images/adt/" + image);
};


export const imageLocalCall = (imageName:string) => {
    if (imageName.startsWith("file:")) {
        return imageName; 
    }
    let res = getImageContent(imageName);

    return res;
};


export const svgLocalCall = (svgName:string) => {
    return require("../images/" + svgName);
};