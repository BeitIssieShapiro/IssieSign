
import React, { useCallback, useEffect, useState } from "react";
import Tile2 from "./Tile2";
import Card2 from "./Card2";
import '../css/add.css';
import { AttachButton, CameraButton, RadioBtn, SearchWebButton, Spacer, TileButton, VideoButton } from "./ui-elements";
import { withAlert } from 'react-alert'
import Shelf from '../containers/Shelf'
import { translate } from "../utils/lang";
import FileSystem from "../apis/filesystem";
import SearchImage from "./search-image";
import { getAvailableThemes, trace } from "../utils/Utils";
import { Check, MoreHoriz } from "@mui/icons-material";


import { ReactComponent as AttachSVG } from '../images/attach.svg'
import { ReactComponent as CameraSVG } from '../images/camera.svg'
import { ReactComponent as VideoSVG } from '../images/video-cam.svg'
import { ReactComponent as ImageSVG } from '../images/image.svg'
import { ReactComponent as SearchSVG } from '../images/search.svg'
import { ReactComponent as PalleteSVG } from '../images/pallete.svg'
import { ReactComponent as SyncSVG } from '../images/sync2.svg'
import { ReactComponent as EditNameSVG } from '../images/edit-name.svg'

const imagePickerOptions = {
    //maximumImagesCount: 1,
    destinationType: 1,
    sourceType: 0,
    mediaType: 0,
    targetWidth: 394,
    targetHeight: 336,
    quality: 30,
    //width: 394,
    //height: 336
}

const cameraOptions = {
    quality: 30,
    targetWidth: 394,
    targetHeight: 336,
    mediaType: 0,
    allowEdit: false,
}

async function selectImage() {
    if (!navigator.camera) {
        alert("Image picker is not installed");
        return "file://nothing.jpg";
    }
    return new Promise((resolve, reject) => navigator.camera.getPicture(
        function (pic) {
            trace('Picked Image URI: ' + pic);
            resolve(pic);
        }, function (error) {
            trace('Error: ' + error);
            resolve("");
        },
        imagePickerOptions
    ));
}

async function selectVideo() {
    return new Promise((resolve, reject) => navigator.camera.getPicture((vid) => {
        resolve(vid)
    },
        err => {
            console.log(err);
            reject(err);
        }, {
        quality: 30,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: navigator.camera.MediaType.VIDEO
    }));
}

function isValid(fileName) {
    if (fileName.length === 0) {
        return false;
    }
    if (fileName.includes("%") ||
        fileName.includes("/") ||
        fileName.includes("*") ||
        fileName.includes("\\")) {
        return false;
    }
    if (fileName.toLowerCase() === "default") {
        return false
    }
    return true;
}

function AddEditItem(props) {
    const [themeId, setThemeId] = useState(props.themeId || "3");
    const [label, setLabel] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedVideo, setSelectedVideo] = useState("");
    const [syncOn, setSyncOn] = useState(false);
    const [selectInProgress, setSelectInProgress] = useState(false);
    const [showWebSearch, setShowWebSearch] = useState(false);
    const [invalidName, setInvalidName] = useState(false);
    const [edit, setEdit] = useState(false);

    const [imageDirty, setImageDirty] = useState(false);
    const [labelDirty, setLabelDirty] = useState(false);
    const [themeDirty, setThemeDirty] = useState(false);
    const [videoDirty, setVideoDirty] = useState(false);
    const [syncDirty, setSyncDirty] = useState(false);
    const [origElem, setOrigElem] = useState(undefined);


    useEffect(() => {
        if (props.addWord && props.wordId || !props.addWord && props.categoryId) {
            setEdit(true);
            if (props.addWord) {
                const word = FileSystem.get().findWord(props.categoryId, props.wordId);
                if (word) {
                    setOrigElem(word);
                    setLabel(word.name);
                    setSelectedImage(FileSystem.get().getFilePath(word.imageName));
                    setSelectedVideo(FileSystem.get().getFilePath(word.videoName));
                    setSyncOn(word.sync == FileSystem.IN_SYNC || word.sync == FileSystem.SYNC_REQUEST)

                }
            } else {
                const cat = FileSystem.get().findCategory(props.categoryId);
                if (cat) {
                    setOrigElem(cat);
                    setThemeId(cat.themeId);
                    setLabel(cat.name);
                    setSelectedImage(FileSystem.get().getFilePath(cat.imageName));
                    setSyncOn(cat.sync == FileSystem.IN_SYNC || cat.sync == FileSystem.SYNC_REQUEST)
                }
            }
        }
    }, [props.categoryId, props.wordId])

    useEffect(() => {
        props.pubSub.publish({ command: "set-themeId", themeId: themeId });
    }, [themeId]);

    const IsValidInput = () => {
        return (isValid(label) && selectedImage && selectedImage.length > 0
            && (!props.addWord || (selectedVideo && selectedVideo.length > 0)));
    }

    const saveCategory = useCallback(() => {
        FileSystem.get().saveCategory(label, themeId, selectedImage, origElem, syncOn, props.pubSub).then(
            () => {
                props.pubSub.publish({ command: 'refresh' });
                props.alert.success(translate("InfoSavedSuccessfully"));
                props.history.goBack()
            },
            (err) => props.alert.error(JSON.stringify(err))
        )
    }, [label, selectedImage, origElem, syncOn, themeId]);

    const saveWord = useCallback(() => {
        FileSystem.get().saveWord(props.categoryId, label,
            selectedImage, selectedVideo, origElem, syncOn, props.pubSub).then(
                () => {
                    props.pubSub.publish({ command: 'refresh' });
                    props.alert.success(translate("InfoSavedSuccessfully"));
                    props.history.goBack();
                },
                (err) => props.alert.error(err.description)
            )
    }, [props.categoryId, label, selectedImage, selectedVideo, origElem, syncOn]);




    let addWordMode = props.addWord;

    let vidName = selectedVideo.length > 0 ? translate("AddVideoSelected") : translate("AddPlaceholderSelectVideo");
    let imgName = selectedImage.length > 0 ? translate("AddImageSelected") : translate("AddPlaceholderSelectImage");

    return (
        <div className="addContainer showScroll" style={{ transform: `translateY(${props.scroll?.y || 0}px)` }}>
            {showWebSearch && <SearchImage
                pubSub={props.pubSub}
                onClose={() => setShowWebSearch(false)}
                onSelectImage={(url) => {
                    setShowWebSearch(false);
                    console.log("web image selected", url)
                    setSelectedImage(url);
                    setImageDirty(true);
                }} />}
            <div className="add-inner">
                <div className={"tileCardContainer " + (addWordMode ? "card-mode" : "tile-mode")}>
                    {addWordMode ?
                        <div className="addCardHost">
                            <Card2 binder="true" addMode={true} key="1" cardType="file" cardName={label} videoName={selectedVideo}
                                imageName={selectedImage} themeId={themeId} noLink="true" />
                        </div>
                        : <Shelf>
                            <Tile2 key="1" dimensions={props.dimensions} tileName={label} imageName={selectedImage} themeId={themeId} />
                        </Shelf>}
                </div>

                <Spacer height={15} />
                <div className="fieldsContainer">
                    {/*Name Selection */}
                    <EditNameSVG className="add-icon-style" />
                    <input type="text" className="addInput"
                        placeholder={addWordMode ? translate("AddPlaceholderWordName") : translate("AddPlaceholderCategoryName")}
                        onChange={(e) => {
                            const validName = isValid(e.target.value);
                            setLabel(e.target.value);
                            setLabelDirty(true);
                            setInvalidName(!validName);
                        }} value={label} />
                    {invalidName && <div style={{
                        color: "red",
                        fontSize: 20,
                    }}>{translate("InvalidCharachtersInName")}</div>}
                    <div />
                    <div className={isValid(label) ? "v-icon" : "x-icon"} />

                    <rowborder />

                    {/*Image Selection */}
                    <ImageSVG className="add-icon-style" />
                    {/* <input type="text" className="addInputReadonly" readOnly placeholder={translate("AddPlaceholderSelectImage")} */}
                    {/* value={imgName} /> */}
                    <label>{imgName}</label>
                    <div className="addButtons">
                        <CameraSVG className="add-icon-style" onClick={() => {
                            if (selectInProgress) return;
                            setSelectInProgress(true);
                            props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCamera") });

                            setTimeout(async () => navigator.camera.getPicture(
                                img => {

                                    FileSystem.getHttpURLForFile(img).then(imgUrl => {
                                        setSelectedImage(imgUrl);
                                        setImageDirty(true);
                                    }).finally(() => setSelectInProgress(false))
                                    props.pubSub.publish({ command: 'set-busy', active: false });
                                },
                                err => {
                                    props.alert.error(translate("AddTakePictureFailedOrCanceled"));
                                    setSelectInProgress(false);
                                    props.pubSub.publish({ command: 'set-busy', active: false });
                                },
                                cameraOptions), 300);
                        }}
                        />
                        <AttachSVG className="add-icon-style" onClick={async () => {
                            if (selectInProgress) return;
                            setSelectInProgress(true)
                            props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCameraRoll") });
                            setTimeout(async () => {
                                selectImage().then(
                                    img => {
                                        if (img && img.length > 0) {
                                            FileSystem.getHttpURLForFile(img).then(imgUrl => {
                                                setSelectedImage(imgUrl)
                                                setImageDirty(true);
                                            })
                                        } else {
                                            props.alert.error(translate("AddLoadPictureFailedOrCanceled"));
                                        }
                                    },
                                    err => props.alert.error(translate("AddLoadPictureFailedOrCanceled"))).catch(
                                        err => props.alert.error(translate("AddLoadPictureFailedOrCanceled"))
                                    ).finally(
                                        () => {
                                            props.pubSub.publish({ command: 'set-busy', active: false })
                                            setSelectInProgress(false);
                                        });
                            }, 300);
                        }} />

                        <SearchSVG className="add-icon-style" onClick={() => setShowWebSearch(true)} />
                    </div>
                    <div className={selectedImage ? "v-icon" : "x-icon"} />
                    <rowborder />

                    {/* Color selection */}
                    {/* <div className="image-icon" style={{ marginTop: 15 }} /> */}
                    {!addWordMode && <PalleteSVG className="add-icon-style" />}
                    {/* <input type="text" className="addInputReadonly" readOnly placeholder={translate("ChangeColor")} /> */}
                    {!addWordMode && <label>{translate("ChangeColor")} </label>}
                    {!addWordMode && <div className="addButtons">
                        <TileButton size={24} onClick={() => {
                            props.pubSub.publish({
                                command: "open-slideup-menu", props: {
                                    label: translate("SelectColorMenuTitle"),
                                    themeId: props.themeId,
                                    type: "colors",
                                    height: 250,
                                    buttons: getAvailableThemes().map((theme) => ({
                                        icon: <div theme="blue" theme-flavor={theme + ""}>
                                            <div className="tileColorBtn" style={{
                                                backgroundColor: "var(--box-background-color-1)"
                                            }} >{themeId == theme && <Check />}</div>
                                        </div>,
                                        callback: () => {
                                            setThemeId(theme);
                                            setThemeDirty(true);
                                        }
                                    }))
                                }
                            });
                        }}
                        >
                            <MoreHoriz style={{ fontSize: 35, color: "#493A25" }} />
                        </TileButton>
                    </div>
                    }
                    {!addWordMode && <div />}
                    {!addWordMode && <rowborder />}

                    {/* Movie selection */}
                    {addWordMode && <VideoSVG className="add-icon-style" />}
                    {/* {addWordMode && <input type="text" className="addInputReadonly" readOnly placeholder="בחר סרטון" value={vidName} />} */}
                    {addWordMode && <label>{vidName}</label>}
                    {addWordMode && <div className="addButtons">
                        <VideoSVG className="add-icon-style" onClick={() => {
                            if (selectInProgress) return;
                            setSelectInProgress(true);

                            props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCamera") });

                            setTimeout(async () => navigator.device.capture.captureVideo(
                                (mediaFiles) => {
                                    if (mediaFiles.length === 1) {
                                        let path = mediaFiles[0].fullPath;
                                        if (!path.startsWith("file://")) {
                                            path = "file://" + path;
                                        }
                                        setSelectedVideo(path);
                                        setVideoDirty(true);
                                        setSelectInProgress(false);
                                    }
                                    props.pubSub.publish({ command: 'set-busy', active: false })
                                },
                                (err) => {
                                    props.alert.error(translate("AddLoadVideoCameraFailedOrCanceled"));
                                    setSelectInProgress(false);
                                    props.pubSub.publish({ command: 'set-busy', active: false })
                                },
                                { limit: 1, duration: 15 }), 300);
                        }} />
                        <AttachSVG className="add-icon-style" onClick={async () => {
                            if (selectInProgress) return;
                            setSelectInProgress(true);
                            props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCameraRoll") });
                            setTimeout(async () => {
                                selectVideo().then(video => {
                                    let path = video;
                                    if (!path.startsWith("file://")) {
                                        path = "file://" + path;
                                    }
                                    setSelectedVideo(path);
                                    setVideoDirty(true);
                                },
                                    err => props.alert.error(translate("AddLoadVideoFailedOrCanceled")))
                                    .catch(err => props.alert.error(translate("AddLoadVideoFailedOrCanceled")))
                                    .finally(
                                        () => {
                                            props.pubSub.publish({ command: 'set-busy', active: false })
                                            setSelectInProgress(false);
                                        });
                            }, 300);
                        }} />
                    </div>
                    }
                    {addWordMode && <div className={selectedVideo.length > 0 ? "v-icon" : "x-icon"} />}
                    {addWordMode && <rowborder />}

                    {/*Sync To Cloud */}
                    <SyncSVG className="add-icon-style" />

                    <label>

                        {translate("SyncToCloudTitle")}
                        <div className="syncLine">
                            <div className="syncCaption">{translate("SyncStatusLbl") + ":"}</div>
                            <div className="syncCaption">{origElem?.sync ? origElem.sync : translate("SyncStatusNone")}</div>
                        </div>

                        <div className="syncLine">
                            {origElem?.syncErr && <div className="syncCaption">{translate("SyncErrorLbl") + ":"}</div>}
                            {origElem?.syncErr && <div className="syncCaption">{origElem.syncErr}</div>}
                        </div>
                    </label>
                    <div className="addButtons">
                        <RadioBtn
                            checked={syncOn}
                            onChange={(isOn) => {
                                setSyncOn(isOn);
                                setSyncDirty(true);
                            }}
                            onText={translate("Yes")}
                            offText={translate("No")}
                        />
                    </div>
                    <rowborder />
                </div >

                {/* {syncInProcess && <div className="syncinProcess" ><Sync className="rotate" /><div>{translate("SyncToCloudMsg")}</div></div>} */}



            </div>
            <div style={{ paddingTop: 20 }}>
                <input type="button" value={translate("BtnSave")} className="addButton" style={{ width: '150px' }} disabled={!IsValidInput() || (!labelDirty && !imageDirty && !syncDirty && !videoDirty && !themeDirty)}
                    onClick={props.addWord ? saveWord : saveCategory} />

            </div>
        </div >
    )

}


export default withAlert()(AddEditItem);
