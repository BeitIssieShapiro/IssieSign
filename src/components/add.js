
import React from "react";
import Tile2 from "./Tile2";
import Card2 from "./Card2";
import { createDir, mvFileIntoDir } from '../apis/file';
import { imageLocalCall } from "../apis/ImageLocalCall";


async function selectImage() {
    if (!window.imagePicker) {
        alert("Image picker is not installed");
        return;
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
        {
            maximumImagesCount: 1
        }
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
            quality: 100,
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
        this.state = { label: "", selectImage: "", selectedVideo: "" }
    }

    IsValidInput = () => {
        return isValid(this.state.label) && this.state.selectedImage && (!this.props.addWord || this.state.selectedVideo.length > 0);
    }

    saveCategory = async () => {
        let dirEntry = await createDir(this.state.label);
        await mvFileIntoDir(this.state.selectedImage, dirEntry, "default.jpg")
        alert("נשמר בהצלחה");
        await reloadAdditionals()
        this.props.history.goBack();
    }

    saveWord = async () => {
        let categoryId = this.props.categoryId;
        let dirEntry = await createDir(categoryId);
        await mvFileIntoDir(this.state.selectedVideo, dirEntry, this.state.label + ".mov")
        if (this.state.selectedImage.length > 0) {
            await mvFileIntoDir(this.state.selectedImage, dirEntry, this.state.label + ".jpg")
        }
        alert("נשמר בהצלחה");
        await reloadAdditionals();
        this.props.history.goBack();
    }

    render() {
        let themeId = "1";
        let addWordMode = this.props.addWord;
        return (
            <div >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {addWordMode ?
                        <Card2 key="1" cardType="file" cardName={this.state.label} videoName={this.state.selectedVideo}
                            imageName={this.state.selectedImage} themeId={themeId} noLink="true"/>
                        :
                        <Tile2 key="1" dimensions={this.props.dimensions} tileName={this.state.label} imageName={this.state.selectedImage} themeFlavor={themeId} />}
                </div>

                <div style={{ color: 'black', direction: 'rtl', paddingTop: 80, fontSize: 40, textAlign: 'right' }}>
                    <table>
                        <tbody>
                            <tr>
                                <td width="15%"></td>
                                <td width="30%">שם<font color="red">*</font></td>
                                <td width="60%">
                                    <input type="text" onChange={(e) => {
                                        this.setState({ label: e.target.value })
                                    }
                                    } />
                                </td>
                                <td><img alt="" style={{ maxWidth: '40px', maxHeight: '40px' }} src={isValid(this.state.label) ? imageLocalCall("check.png") : imageLocalCall("missing.png")}></img></td>
                            </tr>
                            <tr>
                                <td width="15%"></td>
                                <td width="30%">צלמית</td>
                                <td width="60%">
                                    <input type="button" value="..." className="browserButton" onClick={async () => {
                                        let img = await selectImage();
                                        this.setState({ selectedImage: img })
                                    }
                                    } />
                                </td>
                                <td><img alt="" style={{ maxWidth: '40px', maxHeight: '40px' }} src={this.state.selectedImage ? imageLocalCall("check.png") : imageLocalCall("missing.png")}></img></td>
                            </tr>
                            {addWordMode ?
                                <tr>
                                    <td width="15%"></td>
                                    <td width="30%">וידאו</td>
                                    <td width="60%">
                                        <input type="button" value="..." className="browserButton" onClick={async () => {
                                            let video = await selectVideo();
                                            //alert(JSON.stringify(video)) ;
                                            this.setState({ selectedVideo: video })
                                        }} />
                                    </td>
                                    <td><img  alt="" style={{ maxWidth: '40px', maxHeight: '40px' }} src={this.state.selectedVideo.length > 0 ? imageLocalCall("check.png") : imageLocalCall("missing.png")}></img></td>
                                </tr>
                                : null}
                        </tbody>
                    </table>
                </div>
                <div style={{ paddingTop: 50 }}>
                    <input type="button" value="שמור"  className="browserButton saveBtn" disabled={!this.IsValidInput()} onClick={async () =>
                        this.props.addWord ? this.saveWord() : this.saveCategory()
                    } />
                </div>
                {/* <input type="button" value="בדוק" onClick={async () => {
                    let cat = await listAdditionsFolders();
                    for (let c of cat) {
                        alert(JSON.stringify(c));
                    }

                }} /> */}
            </div>
        )
    }
}

export default AddItem;
