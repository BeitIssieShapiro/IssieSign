
import React from "react";
import Tile2 from "./Tile2";
import Card2 from "./Card2";
import '../css/add.css';
import { AttachButton, CameraButton, SearchWebButton, VideoButton } from "./ui-elements";
import { withAlert } from 'react-alert'
import Shelf from '../containers/Shelf'
import { translate } from "../utils/lang";
import FileSystem from "../apis/filesystem";
import SearchImage from "./search-image";
import { trace } from "../utils/Utils";

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

class AddItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            label: "",
            selectedImage: "",
            selectedVideo: "",
            selectInProgress: false,
            showWebSearch: false
        }
    }

    IsValidInput = () => {
        return (isValid(this.state.label) && this.state.selectedImage && this.state.selectedImage.length > 0
            && (!this.props.addWord || (this.state.selectedVideo && this.state.selectedVideo.length > 0)));
    }

    saveCategory = async () => {
        FileSystem.get().saveCategory(this.state.label, this.state.selectedImage).then(
            () => {
                this.props.pubSub.publish({ command: 'refresh' });
                this.props.alert.show(
                    ("InfoSavedSuccessfully"));
                this.props.history.goBack()
            },
            (err) => this.props.alert.error(err)
        )
    }

    saveWord = async () => {
        FileSystem.get().saveWord(this.props.categoryId, this.state.label,
            this.state.selectedImage, this.state.selectedVideo).then(
                () => {
                    this.props.pubSub.publish({ command: 'refresh' });
                    this.props.alert.success(
                        ("InfoSavedSuccessfully"));
                    this.props.history.goBack();
                },
                (err) => this.props.alert.error(err)
            )
    }

    render() {
        let themeId = "3";
        if (this.props.categoryId4Theme) {
            themeId = this.props.categoryId4Theme;
        }

        let addWordMode = this.props.addWord;
        //let vidName = getFileName(this.state.selectedVideo);
        //let imgName = getFileName(this.state.selectedImage);

        let vidName = this.state.selectedVideo.length > 0 ? translate("AddVideoSelected") : ""
        let imgName = this.state.selectedImage.length > 0 ? translate("AddImageSelected") : ""
        return (
            <div style={{ width: '100%', height: '120%', backgroundColor: 'lightgray' }}>
                {this.state.showWebSearch && <SearchImage 
                    pubSub={this.props.pubSub}
                    onClose={()=>this.setState({ showWebSearch: false })} 
                    onSelectImage={(url)=>{
                        this.setState({ showWebSearch: false, selectedImage: url })

                    }}/>}
                <div style={{ display: 'flex', flexDirection: this.props.isLandscape ? 'row-reverse' : 'column', }}>
                    <div style={{ display: 'flex', justifyContent: 'center', width: this.props.isLandscape ? '35%' : '100%', zoom: '150%' }}>
                        {addWordMode ?
                            <div className="addCardHost">
                                <Card2 binder="true" addMode={true} key="1" cardType="file" cardName={this.state.label} videoName={this.state.selectedVideo}
                                    imageName={this.state.selectedImage} themeId={themeId} noLink="true" />
                            </div>
                            : <Shelf>
                                <Tile2 key="1" dimensions={this.props.dimensions} tileName={this.state.label} imageName={this.state.selectedImage} themeFlavor={themeId} />
                            </Shelf>}
                    </div>

                    <div style={{ color: 'black', direction: 'rtl', paddingTop: "5vh", fontSize: 40, textAlign: 'right', width: '100%' }}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr style={{ height: '10vh' }}>
                                    <td width="10%"></td>
                                    <td width="8%"><div className="title-icon" style={{ marginTop: 15 }} /></td>
                                    <td width="70%">
                                        <input type="text" className="addInput"
                                            placeholder={addWordMode ? translate("AddPlaceholderWordName") : translate("AddPlaceholderCategoryName")}
                                            onChange={(e) => {
                                                const validName = isValid(e.target.value);
                                                this.setState({ label: e.target.value, invalidName: !validName }, () => {

                                                })
                                            }} />
                                        {this.state.invalidName && <div style={{
                                            color: "red",
                                            fontSize: 20,
                                        }}>{translate("InvalidCharachtersInName")}</div>}
                                    </td>

                                    <td><div className={isValid(this.state.label) ? "v-icon" : "x-icon"} /></td>
                                </tr>
                                <tr style={{ height: '10vh' }}>
                                    <td></td>
                                    <td><div className="image-icon" style={{ marginTop: 15 }} /></td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <input type="text" className="addInputReadonly" readOnly placeholder={translate("AddPlaceholderSelectImage")} style={{ width: '90%' }}
                                                value={imgName} />

                                            <CameraButton onClick={() => {
                                                if (this.state.selectInProgress) return;
                                                this.setState({ selectInProgress: true });
                                                this.props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCamera") });

                                                setTimeout(async () => navigator.camera.getPicture(
                                                    img => {
                                                        this.setState({ selectedImage: img, selectInProgress: false });
                                                        this.props.pubSub.publish({ command: 'set-busy', active: false });
                                                    },
                                                    err => {
                                                        this.props.alert.error(translate("AddTakePictureFailedOrCanceled"));
                                                        this.setState({ selectInProgress: false });
                                                        this.props.pubSub.publish({ command: 'set-busy', active: false });
                                                    },
                                                    cameraOptions), 300);
                                            }}
                                            />
                                            <AttachButton onClick={async () => {
                                                if (this.state.selectInProgress) return;
                                                this.setState({ selectInProgress: true });
                                                this.props.pubSub.publish({ command: 'set-busy', active: true, text: translate("AddLoadingCameraRoll") });
                                                setTimeout(async () => {
                                                    selectImage().then(
                                                        img => {
                                                            if (img && img.length > 0) {
                                                                this.setState({ selectedImage: img })
                                                            } else {
                                                                this.props.alert.error(translate("AddLoadPictureFailedOrCanceled"));
                                                            }
                                                        },
                                                        err => this.props.alert.error(translate("AddLoadPictureFailedOrCanceled"))).catch(
                                                            err => this.props.alert.error(translate("AddLoadPictureFailedOrCanceled"))
                                                        ).finally(
                                                            () => {
                                                                this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                                this.setState({ selectInProgress: false })
                                                            });
                                                }, 300);
                                            }} />

                                            <SearchWebButton onClick={() => this.setState({ showWebSearch: true })} />
                                        </div>
                                    </td>

                                    <td><div className={this.state.selectedImage ? "v-icon" : "x-icon"} /></td>
                                </tr>
                                {addWordMode ?
                                    <tr style={{ height: '10vh' }}>
                                        <td></td>
                                        <td><div className="movie-icon" style={{ marginTop: 15 }} /></td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <input type="text" className="addInputReadonly" readOnly placeholder="בחר סרטון" style={{ width: '90%' }} value={vidName} />
                                                <VideoButton onClick={() => {
                                                    if (this.state.selectInProgress) return;
                                                    this.setState({ selectInProgress: true });
                                                    this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'טוען...' });

                                                    setTimeout(async () => navigator.device.capture.captureVideo(
                                                        (mediaFiles) => {
                                                            if (mediaFiles.length === 1) {
                                                                let path = mediaFiles[0].fullPath;
                                                                if (!path.startsWith("file://")) {
                                                                    path = "file://" + path;
                                                                }
                                                                this.setState({ selectedVideo: (path), selectInProgress: false })
                                                            }
                                                            this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                        },
                                                        (err) => {
                                                            this.props.alert.error(translate("AddLoadVideoCameraFailedOrCanceled"));
                                                            this.setState({ selectInProgress: false });
                                                            this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                        },
                                                        { limit: 1, duration: 15 }), 300);
                                                }} />
                                                <AttachButton onClick={async () => {
                                                    if (this.state.selectInProgress) return;
                                                    this.setState({ selectInProgress: true });
                                                    this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'טוען...' });
                                                    setTimeout(async () => {
                                                        selectVideo().then(video => {
                                                            let path = video;
                                                            if (!path.startsWith("file://")) {
                                                                path = "file://" + path;
                                                            }
                                                            this.setState({ selectedVideo: path })
                                                        },
                                                            err => this.props.alert.error(translate("AddLoadVideoFailedOrCanceled")))
                                                            .catch(err => this.props.alert.error(translate("AddLoadVideoFailedOrCanceled")))
                                                            .finally(
                                                                () => {
                                                                    this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                                    this.setState({ selectInProgress: false })
                                                                });
                                                    }, 300);
                                                }} />
                                            </div>

                                        </td>
                                        <td><div className={this.state.selectedVideo.length > 0 ? "v-icon" : "x-icon"} /></td>
                                    </tr>
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ paddingTop: 20 }}>
                    <input type="button" value={translate("BtnSave")} className="addButton" style={{ width: '150px' }} disabled={!this.IsValidInput()} onClick={async () =>
                        this.props.addWord ? this.saveWord() : this.saveCategory()
                    } />

                </div>
            </div>
        )
    }
}


export default withAlert()(AddItem);
