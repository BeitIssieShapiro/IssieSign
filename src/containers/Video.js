import React from "react";

import '../css/App.css';

class Video extends React.Component {
    constructor (props) {
        super(props);
        this.state = {}
    }
    
    componentDidMount() {
        this.updateDimensions()

    } 
    componentWillUnmount() {
        //VideoToggle(false);
        console.log("unmount video")
    }
    
    updateDimensions() {
        var videoElemHost = document.getElementById("playerhost");        

        let backBtn = document.getElementById("backBtn");
        if (this.props.isLandscape && this.props.isMobile) {
            videoElemHost.style.top = "0px";
            videoElemHost.style.height = window.innerHeight;
            backBtn.style.display = "block";

            //videoElemHost.style.width = '95%';
            //videoElemHost.style.position = "absolute";
        } else {
            console.log("not mobile landscape")
            videoElemHost.style.top = "150px";
            backBtn.style.display = "none";
            //videoElemHost.style.position = "absolute";
            //videoElemHost.style.width = '100%';
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


        //this.updateDimensions()

        return (
            <div />
        )
    }
}


export default Video;
