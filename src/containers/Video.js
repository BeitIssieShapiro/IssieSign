import React from "react";

import '../css/App.css';

import IssieBase from "../IssieBase";
import { VideoToggle } from "../utils/Utils";

class Video extends IssieBase {

    componentWillMount() {
        VideoToggle(true, !this.isMobile());
    }
    componentWillUnmount() {
        VideoToggle(false);
    }
    
    updateDimensions() {
        var videoElemHost = document.getElementById("playerhost")
        if (this.isLandscape() && this.isMobile()) {
            videoElemHost.style.top = "0px";
            videoElemHost.style.height = window.innerHeight
            videoElemHost.style.width = '95%';
            videoElemHost.style.position = "relative";
        } else {
            videoElemHost.style.top = "150px";
            videoElemHost.style.position = "relative";
            videoElemHost.style.width = '100%';
        }
    }

    render() {
        let videoContent = "";

        let videoName = this.props.videoName;
        if (videoName === 'file') {
            videoContent = this.props.filePath;
        } else {
            if (document.basePath.startsWith("file")) {
                //iOS
                videoContent = document.basePath + "www/videos/" + videoName;
            } else {
                //Android
                videoContent = document.basePath + "videos/" + decodeURIComponent(videoName);
            }
        }
        var videoElem = document.getElementById("player")
        
        // if (videoContent.startsWith("file")) {
        //     videoContent = "cdvfile"+videoContent.substr(4);
        // }
        //alert(videoContent)
        videoElem.src = videoContent;


        this.updateDimensions()

        return (
            <div />
        )
    }
}


export default Video;
