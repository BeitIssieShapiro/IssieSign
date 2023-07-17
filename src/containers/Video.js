import {
    ArrowForwardRounded, Favorite, FavoriteBorder, PauseCircleFilled, PlayCircle,
    ReplayCircleFilled
} from "@mui/icons-material";
import React, { useEffect, useState, useRef, useCallback } from "react";
import FileSystem from "../apis/filesystem";
import { createPortal } from 'react-dom';

import '../css/App.css';

const Video = React.memo(({ videoName, filePath, title, categoryId, isMobile, isLandscape, goBack,
    maxWidth, isFavorite, onFavoriteToggle, headerSize }) => {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);
    const [ended, setEnded] = useState(false);

    const [videoDimension, setVideoDimension] = useState({ w: window.innerWidth, h: window.innerWidth * 5 / 9 });
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const videoRef = useRef(null);

    const vidElem = document.getElementById("video");
    const vidHost = document.getElementById("videoHost");

    const onClick = useCallback(() => {
        if (ended || paused) {
            vidElem.play();
        } else if (playing) {
            vidElem.pause();
        }
    }, [ended, paused, playing])

    const onPlay = () => {
        setPlaying(true);
        setPaused(false);
        setEnded(false);
    };

    const onPause = () => {
        setPaused(true);
        setPlaying(false);
    }
    const onEnded = () => {
        setEnded(true);
        setPlaying(false);
        setPaused(true);
    }

    const onLoadedMetadata = (e) => setVideoDimension({ w: e.currentTarget.videoWidth, h: e.currentTarget.videoHeight });

    useEffect(() => {
        vidElem.addEventListener("click", onClick);
        vidElem.addEventListener("play", onPlay);
        vidElem.addEventListener("pause", onPause);
        vidElem.addEventListener("ended", onEnded);
        vidElem.addEventListener("loadedmetadata", onLoadedMetadata);


        return () => {
            vidElem.removeEventListener("click", onClick);
            vidElem.removeEventListener("play", onPlay);
            vidElem.removeEventListener("pause", onPause);
            vidElem.removeEventListener("ended", onEnded);
            vidElem.removeEventListener("loadedmetadata", onLoadedMetadata);
        }
    }, [onClick])

    useEffect(() => {
        vidHost.style.display = "block";

        return () => {
            vidHost.style.display = "none";
            vidElem.pause();
        }
    }, [])


    useEffect(() => {
        let videoContent = "";
        if (videoName === 'file') {
            videoContent = FileSystem.get().getFilePath(filePath);
        } else if (videoName.startsWith('http')) {
            videoContent = videoName;
        } else {
            if (!window.isAndroid) {
                //iOS
                if (decodeURIComponent(videoName)[0] < 'M') {
                    videoContent = "cdvfile:///_app_file_" + document.basePath + videoName;
                } else {
                    videoContent =  "cdvfile:///_app_file_" +document.basePath2 + videoName;
                }
            } else {
                //Android
                //movie files are shareded between document.basePath and document.basePath2
                // All files starting between A* to L* are in first assetpack
                if (decodeURIComponent(videoName)[0] < 'M') {
                    videoContent = document.basePath + "videos/" + decodeURIComponent(videoName);
                } else {
                    videoContent = document.basePath2 + "videos/" + decodeURIComponent(videoName);
                }
            }
        }
        vidElem.src = videoContent;
        console.log("start video: ", videoContent)

    }, [videoName, filePath])

    const headerSizeAct = isMobile && isLandscape ? 0 : headerSize;
    const innerHeight = window.innerHeight - 40 - headerSizeAct;

    useEffect(() => {
        const innerWidth = (maxWidth || window.innerWidth) - 20;
        const videoRatio = videoDimension.w / videoDimension.h;
        const screenRatio = innerWidth / innerHeight;

        if (screenRatio > videoRatio) {
            setVideoWidth(videoDimension.w * innerHeight / videoDimension.h);
            setVideoHeight(innerHeight + 13);
        } else {
            setVideoWidth(innerWidth);
            setVideoHeight(videoDimension.h * innerWidth / videoDimension.w + 13);
        }

    }, [window.innerHeight, window.innerWidth, isMobile, videoDimension, maxWidth]);

    const leftPos = maxWidth ? (maxWidth - videoWidth) / 2 : (window.innerWidth - videoWidth) / 2;

    const videoTop = headerSizeAct + Math.max((innerHeight - videoHeight) / 2 - 15, -2);
    if (vidHost) {
        vidHost.style.height = videoHeight + "px";
        vidHost.style.width = videoWidth + "px";
        vidHost.style.top = videoTop + "px";
        vidHost.style.left = leftPos + "px";
    }
    return createPortal(<div className="videoHostNew" >
        {isMobile && isLandscape && <div className="videoBackButtonMobile" >
            <ArrowForwardRounded style={{ fontSize: 80 }} className="videoButtonNew"
                onClick={goBack}
            />
        </div>
        }

        {videoDimension !== 0 && <div style={{
            position: "absolute",
            left: 30, top: -videoHeight + 30,
        }} onClick={() => onFavoriteToggle && onFavoriteToggle(categoryId, title, !isFavorite)}>
            {isFavorite ? <Favorite style={{ fontSize: 50 }} /> :
                <FavoriteBorder style={{ fontSize: 50 }} />}
        </div>}

        {(playing || paused || ended) && <div className="videoButtonsBackgroundNew" />}
        <div className="videoButtonsNew">
            {playing && <PauseCircleFilled style={{ fontSize: 100 }} className="videoButtonNew" onClick={() => vidElem.pause()} />}
            {paused && !ended && <PlayCircle style={{ fontSize: 100 }} className="videoButtonNew" onClick={() => vidElem.play()} />}
            {ended && <ReplayCircleFilled style={{ fontSize: 100 }} className="videoButtonNew" onClick={() => vidElem.play()} />}
        </div>
    </div>, document.getElementById("videoButtons"))
});

export default Video;
