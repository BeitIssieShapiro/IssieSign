import React from "react";
import "../css/card.css";
import "../css/Tile.css";

import { imageLocalCall } from "../apis/ImageLocalCall";
import Rope from "../components/Rope";
import { getTheme } from "../utils/Utils";
import longPress from '../apis/longPress';
import { A } from "hookrouter";

export default function Card2(props) {
    const longPressEvent = props.longPressCallback? longPress(() => props.longPressCallback(), 500):{};

    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : "image1.png";
    let image2 = props.imageName2 ? <img className="tileImg" src={imageLocalCall(props.imageName2)} alt="card Placeholder"></img> : "";
    let cardDouble = props.imageName2 ? { '--card-width': '100%' } : {};
    let url = "";
    if (!props.noLink) {
        if (props.cardType === "add") {
            url = "/add-word/" + props.cardAddToCategory
        } else if (props.cardType === "file") {
            url = "/video/file/" + props.themeId + "/" + props.cardName+"/"+encodeURIComponent(props.videoName);
        } else {
            url = "/video/" + props.videoName + "/" + props.themeId + "/" + props.cardName + "/-";
        }
    }

    return (
        <div {...longPressEvent} className="noTouchCallout">
            <A href={url}>
                <Rope>
                    <div className="card" style={cardDouble} theme={getTheme(props.themeId)}>
                        <div className="header clip"></div>
                        <div className="main">
                            {image2}
                            <img className="tileImg" src={imageSrc} alt="card Placeholder"></img>
                            {props.selected?<div style={{display:'flex',position:'absolute', left:10, top:10, zIndex:0}}><img  style={{maxWidth:'25px', maxHeight:'25px'}} alt="" src={imageLocalCall("check.png")}></img></div>:null}
                        </div>
                        <div className="footer">
                            <h2 className="rtl tileFont">{props.cardName}</h2>
                        </div>
                    </div>


                </Rope>
            </A>
        </div>
    );
}
