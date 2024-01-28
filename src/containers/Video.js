import {
    ArrowForwardRounded, Check, Clear, Delete, Favorite, FavoriteBorder, Pause, PauseCircleFilled, PlayArrow, PlayCircle,
    Replay,
    ReplayCircleFilled,
    SkipNext,
    SkipPrevious,
    SkipPreviousOutlined
} from "@mui/icons-material";
import React, { useEffect, useState, useRef, useCallback } from "react";
import FileSystem from "../apis/filesystem";
import { createPortal } from 'react-dom';

import '../css/video.css';
import { isElectron, trace } from "../utils/Utils";
import { imageLocalCall } from "../apis/ImageLocalCall";

const Video = React.memo(({ videoName, filePath, title, categoryId, isMobile, isLandscape, goBack,
    maxWidth, isFavorite, onFavoriteToggle, headerSize, onVideoEnded,
    onNext, onPrevious, autoNext, quizMode, getMultipleChoices }) => {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);
    const [ended, setEnded] = useState(false);
    const [overideQuiz, setOverideQuiz] = useState(false);
    const [showMultipleChoices, setShowMultipleChoices] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState(false);
    const [showMultipleChoiceAnswer, setShowMultipleChoiceAnswer] = useState([]);

    const [videoDimension, setVideoDimension] = useState({ w: window.innerWidth, h: window.innerWidth * 5 / 9 });
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    //const videoRef = useRef(null);

    const vidElem = document.getElementById("video");
    const vidHost = document.getElementById("videoHost");

    const onClick = useCallback(() => {
        if (ended || paused) {
            vidElem.play();
        } else if (playing) {
            vidElem.pause();
        }
    }, [ended, paused, playing])

    useEffect(() => {
        if (getMultipleChoices && !multipleChoices) {
            const choices = getMultipleChoices();
            trace("choices", choices)
            setMultipleChoices(choices);
        } 
    }, [showMultipleChoices, multipleChoices])
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
        if (onVideoEnded) {
            trace("OnVideoEnded")
            onVideoEnded();
        }

        if (onNext && autoNext && !quizMode) {
            setTimeout(() => {
                onNext()
                setOverideQuiz(false);
            }, 3000);
        } else if (quizMode && getMultipleChoices) {
            setShowMultipleChoices(true)
        }
    }

    const onNextClicked = () => {
        setOverideQuiz(false);
        setShowMultipleChoices(false);
        setMultipleChoices(undefined);
        onNext();
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
                if (isElectron()) {
                    videoContent = "videos/" + videoName;
                } else {
                    //iOS
                    if (decodeURIComponent(videoName)[0] < 'M') {
                        videoContent = "cdvfile:///_app_file_" + document.basePath + videoName;
                    } else {
                        videoContent = "cdvfile:///_app_file_" + document.basePath2 + videoName;
                    }
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

    if (vidElem) {
        vidElem.muted = quizMode && !overideQuiz;
    }

    trace("video QM:", quizMode, "mute", vidElem.muted)

    //calculate bottons location
    const buttonSize = 100;
    const freeHeightBelowVideoHost = window.innerHeight - (videoTop + videoHeight);

    const buttonsBottom = - Math.min(130, Math.max(freeHeightBelowVideoHost, 55));

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

        {
            quizMode && !overideQuiz && <div className="quizMode" style={{
                top: -videoHeight,
                width: videoWidth / 2,
                height: videoHeight * 2 / 3
            }}
                onClick={() => setOverideQuiz(true)}
            >
                <div className="quizInner">?</div>

            </div>
        }

        {showMultipleChoices && multipleChoices &&
            <div className="videoButtonsNew" style={{
                bottom: (videoHeight / 2) - (window.innerWidth / 10),
                justifyContent: "space-around", flexDirection: "row-reverse"
            }}>
                {multipleChoices.map((mc, i) => (<div className="quizBox"
                    style={{ width: window.innerWidth / 5, height: window.innerWidth / 5, }}
                    onClick={() => setShowMultipleChoiceAnswer([i, ...showMultipleChoiceAnswer])}
                >
                    <div>{i + 1}</div>
                    <div>{mc.name}</div>
                    <img src={imageLocalCall(mc.imageName, mc.userContent)} />
                    {showMultipleChoiceAnswer.some(x => x === i) && <div className="quiz-answer">
                        {mc.correct ? <Check style={{ color: "#00F501" }} /> : <Clear style={{ color: "red" }} />}
                    </div>}
                </div>))}
            </div>}


        <div className="videoButtonsNew" style={{ bottom: buttonsBottom }}>
            {onPrevious && <SkipPrevious style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={() => {
                onPrevious();
                setOverideQuiz(false);
            }} />}
            <div style={{ width: 10 }}></div>
            {playing && <Pause style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={() => vidElem.pause()} />}
            {paused && !ended && <PlayArrow style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={() => vidElem.play()} />}
            {ended && <Replay style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={() => {
                setShowMultipleChoices(false);
                vidElem.play()
            }} />}
            <div style={{ width: 10 }}></div>
            {onNext && (ended && autoNext && !quizMode ?
                <div class="progressCircle">
                    <svg class="progress" viewBox={"0 0 " + buttonSize + " " + buttonSize}>
                        <circle cx={"" + buttonSize / 2} cy={"" + buttonSize / 2} r={"" + buttonSize / 2 - 10} >
                            {/* <animate attributeName="stroke-dashoffset" attributeType="XML" from="10" to="251.2" dur="5s" repeatCount="indefinite" /> */}
                        </circle>
                    </svg>
                    <div>
                        <SkipNext style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={onNextClicked} />
                    </div>
                </div> :
                <SkipNext style={{ fontSize: buttonSize }} className="videoButtonNew-white" onClick={onNextClicked} />)
            }

        </div>
    </div>, document.getElementById("videoButtons"))
});

export default Video;
