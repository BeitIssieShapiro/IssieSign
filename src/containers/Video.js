import React from "react";

import '../css/App.css';

import IssieBase from "../IssieBase";

class Video extends IssieBase {
 
    updateDimensions() {
        var videoElemHost = document.getElementById("playerhost")
        if (this.isLandscape() && this.isMobile()) {
            videoElemHost.style.top = "0px";
            videoElemHost.style.height = window.innerHeight
            videoElemHost.style.position = "relative";
            videoElemHost.style.zIndex = 0
        } else {
            videoElemHost.style.top = "150px";
            videoElemHost.style.position = "relative";
            videoElemHost.style.zIndex = 2
        }  
    }

    render() {
        let videoName = this.props.routeParams.videoName;
        let videoContent = "";
        if (document.basePath.startsWith("file")) {
            //iOS
            videoContent = document.basePath + "www/videos/" + videoName;
        } else {
            //Android
            videoContent = document.basePath + "videos/" + decodeURIComponent(videoName);
        }
        var videoElem = document.getElementById("player")
        videoElem.src = videoContent;

        this.updateDimensions()

        return (
           <div/>
        )
    }
}


export default Video;
