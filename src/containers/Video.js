import {  ArrowForwardRounded, PauseCircleFilled, PlayCircle, 
    ReplayCircleFilled } from "@mui/icons-material";
import React, { useEffect, useState, useRef } from "react";
import FileSystem from "../apis/filesystem";

import '../css/App.css';

const Video = ({ videoName, filePath, isMobile, goBack, maxWidth }) => {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);
    const [ended, setEnded] = useState(false);

    const [videoUrl, setVideoUrl] = useState("");
    const [videoDimension, setVideoDimension] = useState(0);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        let videoContent = "";
        if (videoName === 'file') {
            videoContent = FileSystem.get().getFilePath(filePath);
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
        setVideoUrl(videoContent)

    }, [videoName, filePath])

    const headerSize = isMobile ? 0 : 150;

    useEffect(() => {
        const innerWidth = maxWidth || window.innerWidth;

        const wFactor = videoDimension.w / innerWidth;
        const hFactor = videoDimension.h / (window.innerHeight - headerSize);
        let fullWidth = (1 / wFactor) * videoDimension.w;
        let fullHeight = (1 / wFactor) * videoDimension.h;
        if (fullHeight > window.innerHeight - headerSize) {
            fullWidth = (1 / hFactor) * videoDimension.w;
            fullHeight = (1 / hFactor) * videoDimension.h;
        }

        setVideoWidth(fullWidth);
        setVideoHeight(fullHeight);

    }, [window.innerHeight, window.innerWidth, isMobile, videoDimension, maxWidth]);

    return (
        <div className="videoHostNew">
            <video
                //onTimeUpdate={handleProgress}
                ref={videoRef}
                playsInline={true}
                autoPlay={true}
                width={videoWidth}
                height={videoHeight}
                src={videoUrl}
                style={{ display: "flex", alignItems: "flex-start" }}
                onLoadedMetadata={(e) => {
                    setVideoDimension({ w: e.currentTarget.videoWidth, h: e.currentTarget.videoHeight })
                }}
                onClick={()=>{
                    if (ended || paused) {
                        videoRef.current?.play();
                    } else if (playing) {
                        videoRef.current?.pause();
                    }
                }}
                onPlay={() => {
                    setPlaying(true);
                    setPaused(false);
                    setEnded(false);
                }}
                onPause={() => {
                    setPaused(true);
                    setPlaying(false);
                }}
                onEnded={() => {
                    setEnded(true);
                    setPlaying(false);
                    setPaused(true);
                }}

            >
            </video>
            {isMobile && <div className="videoBackButtonMobile" >
                <ArrowForwardRounded style={{ fontSize: 80}} className="videoButtonNew"
                    onClick={goBack}
                />
            </div>
            }
            {(playing || paused || ended) && <div className="videoButtonsBackgroundNew" />}
            <div className="videoButtonsNew">
                {playing && <PauseCircleFilled style={{ fontSize: 100}} className="videoButtonNew" onClick={() => videoRef.current?.pause()} />}
                {paused && !ended && <PlayCircle style={{ fontSize: 100 }} className="videoButtonNew" onClick={() => videoRef.current?.play()} />}
                {ended && <ReplayCircleFilled style={{ fontSize: 100 }} className="videoButtonNew" onClick={() => videoRef.current?.play()} />}
            </div>
        </div>
    )
}

export default Video;
