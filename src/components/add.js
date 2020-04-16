
import React from "react";
import Tile2 from "./Tile2";
import Card2 from "./Card2";
import { createDir, mvFileIntoDir } from '../apis/file';
import { reloadAdditionals } from "../apis/catalog";
import '../css/add.css';
import { AttachButton, CameraButton, VideoButton } from "./ui-elements";
import { withAlert } from 'react-alert'

const imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 30,
    width: 394,
    height: 336
}

const cameraOptions = {
    quality: 30,
    targetWidth: 394,
    targetHeight: 336,
    mediaType: 0,
    allowEdit: true,
}

const videoOptions = {
    quality: 30,
    targetWidth: 394,
    targetHeight: 336,
    mediaType: 1,
}


function getFileName(pathStr) {
    if (!pathStr || pathStr.length === 0)
        return "";

    let parts = pathStr.split("/");
    return parts[parts.length - 1];
}

async function selectImage() {
    if (!window.imagePicker) {
        alert("Image picker is not installed");
        return "file://nothing.jpg";
    }
    return new Promise((resolve, reject) => window.imagePicker.getPictures(
        function (results) {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);

            }
            resolve(results[0]);
        }, function (error) {
            console.log('Error: ' + error);
            reject(error);
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
    if (fileName.includes("/") ||
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
            selectInProgress: false
        }
    }

    IsValidInput = () => {
        return isValid(this.state.label) && this.state.selectedImage && this.state.selectedImage.length > 0
            && (!this.props.addWord || this.state.selectedVideo && this.state.selectedVideo.length > 0);
    }

    saveCategory = async () => {
        let dirEntry = await createDir(this.state.label);
        await mvFileIntoDir(this.state.selectedImage, dirEntry, "default.jpg")
        this.props.alert.show("נשמר בהצלחה");
        reloadAdditionals().then(() => this.props.history.goBack())
    }

    saveWord = async () => {
        let categoryId = this.props.categoryId;
        let dirEntry = await createDir(categoryId);
        await mvFileIntoDir(this.state.selectedVideo, dirEntry, this.state.label + ".mov")
        if (this.state.selectedImage.length > 0) {
            await mvFileIntoDir(this.state.selectedImage, dirEntry, this.state.label + ".jpg")
        }
        this.props.alert.show("נשמר בהצלחה");
        reloadAdditionals().then(() => this.props.history.goBack());
    }

    render() {
        let themeId = "3";
        if (this.props.categoryId4Theme) {
            themeId = this.props.categoryId4Theme;
        }

        let addWordMode = this.props.addWord;
        //let vidName = getFileName(this.state.selectedVideo);
        //let imgName = getFileName(this.state.selectedImage);

        let vidName = this.state.selectedVideo.length>0?"נבחר וידאו עבור המילה":""
        let imgName = this.state.selectedImage.length>0?"נבחרה תמונה":""

        return (
            <div style={{ width: '100%', height:'120%', backgroundColor: 'lightgray' }}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', zoom: '150%' }}>
                    {addWordMode ?
                        <Card2 addMode={true} key="1" cardType="file" cardName={this.state.label} videoName={this.state.selectedVideo}
                            imageName={this.state.selectedImage} themeId={themeId} noLink="true" />
                        :
                        <Tile2 key="1" dimensions={this.props.dimensions} tileName={this.state.label} imageName={this.state.selectedImage} themeFlavor={themeId} />}
                </div>

                <div style={{ color: 'black', direction: 'rtl', paddingTop: 80, fontSize: 40, textAlign: 'right', width: '100%' }}>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr style={{ height: '120px' }}>
                                <td width="10%"></td>
                                <td width="8%"><div className="title-icon" style={{ marginTop: 15 }} /></td>
                                <td width="70%">
                                    <input type="text" className="addInput"
                                        placeholder={addWordMode ? "שם המילה" : "שם התיקיה"}
                                        onChange={(e) => {
                                            this.setState({ label: e.target.value })
                                        }} />
                                </td>

                                <td><div className={isValid(this.state.label) ? "v-icon" : "x-icon"} /></td>
                            </tr>
                            <tr style={{ height: '120px' }}>
                                <td></td>
                                <td><div className="image-icon" style={{ marginTop: 15 }} /></td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <input type="text" className="addInputReadonly" readOnly placeholder="בחר צלמית" style={{ width: '90%' }}
                                            value={imgName} />

                                        <CameraButton onClick={() => {
                                            if (this.state.selectInProgress) return;
                                            this.setState({ selectInProgress: true });
                                            this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'טוען מצלמה...' });

                                            setTimeout(async () => navigator.camera.getPicture(
                                                img => {
                                                    this.setState({ selectedImage: img, selectInProgress: false });
                                                    this.props.pubSub.publish({ command: 'set-busy', active: false });
                                                },
                                                err => {
                                                    this.props.alert.error('צילום נכשל או בוטל');
                                                    this.props.pubSub.publish({ command: 'set-busy', active: false });
                                                },
                                                cameraOptions), 300);
                                        }}
                                        />
                                        <AttachButton onClick={async () => {
                                            if (this.state.selectInProgress) return;
                                            this.setState({ selectInProgress: true });
                                            this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'טוען...' });
                                            setTimeout(async () => {
                                                selectImage().then(
                                                    img => this.setState({ selectedImage: img, selectInProgress: false }),
                                                    err => this.props.alert.error('טעינת תמונה נכשלה או בוטלה')).finally(
                                                        () => this.props.pubSub.publish({ command: 'set-busy', active: false }));
                                            }, 300);
                                        }} />
                                    </div>
                                </td>

                                <td><div className={this.state.selectedImage ? "v-icon" : "x-icon"} /></td>
                            </tr>
                            {addWordMode ?
                                <tr style={{ height: '120px' }}>
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
                                                        if (mediaFiles.length == 1) {
                                                            this.setState({ selectedVideo: ("file://" + mediaFiles[0].fullPath), selectInProgress: false })
                                                        }
                                                        this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                    },
                                                    (err) => {
                                                        this.props.alert.error("צילום וידאו נכשל או בוטל");
                                                        this.props.pubSub.publish({ command: 'set-busy', active: false })
                                                    },
                                                    { limit: 1, duration: 15 }), 300);
                                            }} />
                                            <AttachButton onClick={async () => {
                                                if (this.state.selectInProgress) return;
                                                this.setState({ selectInProgress: true });
                                                this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'טוען...' });
                                                setTimeout(async () => {
                                                    selectVideo().then(
                                                        video => this.setState({ selectedVideo: video, selectInProgress: false }),
                                                        err => this.props.alert.error('טעינת סרטון בוטלה או נכשלה')).finally(
                                                            () => this.props.pubSub.publish({ command: 'set-busy', active: false }));
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
                <div style={{ paddingTop: 20 }}>
                    <input type="button" value="שמור" className="addButton" style={{ width: '150px' }} disabled={!this.IsValidInput()} onClick={async () =>
                        this.props.addWord ? this.saveWord() : this.saveCategory()
                    } />

                </div>
            </div>
        )
    }
}


export default withAlert()(AddItem);
