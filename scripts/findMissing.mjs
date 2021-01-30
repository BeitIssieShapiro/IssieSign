var videos = '../Ext-Media/videos/he/'
var images = '../Ext-Media/images/he/'

import x from '../jsons/he/mainJson.js';
import fs  from 'fs'


let words = x.mainJson.categories.map(c=>c.words);
words = words.flat();

for (var i=0;i < words.length;i++) {
    if (!fs.existsSync(videos+words[i].videoName)) {
        console.log("Video: "+ videos+words[i].videoName);
    }

    if (!fs.existsSync(images+words[i].imageName)) {
        console.log("Image: "+ words[i].imageName);
    }
}


