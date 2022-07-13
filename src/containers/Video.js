import React from "react";
import FileSystem from "../apis/filesystem";

import '../css/App.css';

class Video extends React.Component {
    constructor(props) {
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
            if (this.props.adultMode) {
                videoElemHost.style.width = '85%';
                //videoElemHost.style.alignSelf = 'center';
                //videoElemHost.style.right = '150px';
            }
            //videoElemHost.style.position = "absolute";
            //videoElemHost.style.width = '100%';
        }
    }

    render() {
        let videoContent = "";

        let videoName = this.props.videoName;
        if (videoName === 'file') {
            videoContent = FileSystem.get().getFilePath(this.props.filePath);
        } else {
            if (document.basePath.startsWith("file")) {
                //iOS
                videoContent = document.basePath + "www/videos/" + videoName;
            } else {
                //Android
                //movie files are shareded between document.basePath and document.basePath2
                if (decodeURIComponent(videoName)[0] < 'כ') {
                    videoContent = document.basePath + "videos/" + decodeURIComponent(videoName);
                } else {
                    videoContent = document.basePath2 + "videos/" + decodeURIComponent(videoName);
                }
            }
        }
        var videoElem = document.getElementById("player")

        // if (videoContent.startsWith("file")) {
        //     videoContent = "cdvfile"+videoContent.substr(4);
        // }
        //alert(videoContent)
        console.log("video: ", videoContent);
        videoElem.src = videoContent;


        //this.updateDimensions()

        return (
            <div />
        )
    }
}


export default Video;
