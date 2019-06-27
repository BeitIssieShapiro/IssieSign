
export var wordsTranslateX = 0;
export var rootTranslateX = 0;
export const ALLOW_SWIPE_KEY = "IssieSign_Settings_AllowSwipe";

export function saveSettingKey(key, value) {
    window.localStorage.setItem(key, value);
}

export function getBooleanSettingKey(key, defaultVal) {
    let value = window.localStorage.getItem(key);
    
    if (value) {
        if (typeof value === "boolean") {
            return value;
        } else {   
            return (value.toLowerCase() === "true");
        }
    }
    return Boolean(defaultVal);
}

export function saveWordTranslateX(newValue) {
    wordsTranslateX = newValue;
}
export function saveRootTranslateX(newValue) {
    rootTranslateX = newValue;
}

export const scrollRight = (() => {
    var curr = getTranslateX();
    var newVal = curr - getIncrement(curr, true);
    setTranslateX(newVal)
    return newVal;
});

export const scrollLeft = (() => {
    var curr = getTranslateX();
    var newVal = Number(curr) + getIncrement(curr);
    if (newVal > 0)
        newVal = 0;

    setTranslateX(newVal);
    return newVal;
});


function getIncrement(curr, toRight) {
    let containers = document.getElementsByClassName("tileContainer")
    let maxInc = 0;
    for (const container of containers) {
        var inc =  container.parentNode.clientWidth  - 50;
        if (inc >= container.clientWidth) {
            continue;
        }

        if (toRight) {
            var rightHidden = (container.clientWidth - inc) + curr;
            maxInc = Math.max( Math.min(inc, rightHidden), maxInc);
        } else {
            var leftHidden =  container.clientWidth - curr - inc;
            maxInc = Math.max(  Math.min(inc, leftHidden), maxInc);
        }
    }
    return maxInc;
}

function getTranslateX() {
    let container = document.getElementsByClassName("tileContainer")[0];
    let transform = container.style.transform;
    if (transform) {
        var transXRegex = /\.*translateX\((.*)px\)/i;
        return Number(transXRegex.exec(transform)[1]);
    }
    return 0;
}

export function setTranslateX(newVal) {
    let containers = document.getElementsByClassName("tileContainer");
    for (let cont of containers) {
        cont.style.transform = 'translateX(' +newVal+ 'px)';
    }
}

export function calcWidth(elementCount, windowHeight, windowWidth, tileH, tileW, isMobile, isSearch) {
    if (isMobile) {
        //scroll vertically by touch
        let cols = Math.max(Math.ceil(windowWidth / tileW), 1);
        return cols * ( tileW * 1.05);
    }

    let rows = Math.max(Math.floor( (windowHeight - 153) / tileH), 1);
    if (isSearch) {
        rows = Math.floor(rows/2);
    }
    let cols = Math.ceil(elementCount / rows);
    return cols * tileW;
}

//exluded: 8,12,20,14,6
var themes = [0,1,2,3,4,5,7,9,10,11,13,15,16,17,18,19,21,22,23];
export const getTheme = (categoryID) =>  {
    let count = themes.length;
    let index = (Number(categoryID)-1) % count;
    let mapIndex = Number(themes[index])+1;
    return themeMap[mapIndex.toString()];
}

export const getThemeFlavor = (categoryID) =>  {
    let count = themes.length;
    let index = (Number(categoryID)-1) % count;
    return Number(themes[index]);
}

export const themeMap = {
    "1": "flavor-0",
    "2": "flavor-1",
    "3": "flavor-2",
    "4": "flavor-3",
    "5": "flavor-4",
    "6": "flavor-5",
    "7": "flavor-6",
    "8": "flavor-7",
    "9": "flavor-8",
    "10": "flavor-9",
    "11": "flavor-10",
    "12": "flavor-11",
    "13": "flavor-12",
    "14": "flavor-13",
    "15": "flavor-14",
    "16": "flavor-15",
    "17": "flavor-16",
    "18": "flavor-17",
    "19": "flavor-18",
    "20": "flavor-19",
    "21": "flavor-20",
    "22": "flavor-21",
    "23": "flavor-22",
    "24": "flavor-23"
};

var videoMonitor = undefined;
export const VideoToggle = (on, addButtons) =>  { 
    let video = document.getElementById("player");
    document.getElementById("playerhost").style.visibility = (on?"visible":"hidden");
    if (!on) {
        video.pause();
        clearInterval(videoMonitor);
        videoMonitor = undefined
    } else if (addButtons) {
        if (videoMonitor === undefined)
            videoMonitor = setInterval(monitorVideo, 250);
    }
}

function monitorVideo() {
    let video = document.getElementById("player");
    if (video) {
        if (video.ended) {
            setButtons(0,0,1);
        } else if (video.paused) {
            setButtons(0,1,0);
        } else {
            setButtons(1,0,0);
        }
    }
}

function setButtons(pause, play, replay) {
    let pauseBtn = document.getElementById("pauseBtn");
    let playBtn = document.getElementById("playBtn");
    let replayBtn = document.getElementById("replayBtn");

    pauseBtn.style.display = (pause === 1?"block":"none");    
    playBtn.style.display = (play === 1?"block":"none");    
    replayBtn.style.display = (replay === 1?"block":"none");    
}
