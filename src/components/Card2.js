import React from "react";
import "../css/card.css";
import "../css/Tile.css";

import { imageLocalCall } from "../apis/ImageLocalCall";
import Rope from "../components/Rope";
import { getTheme } from "../utils/Utils";
import longPress from '../apis/longPress';
import { Link } from "react-router-dom";

export default function Card2(props) {
    const longPressEvent = props.longPressCallback? longPress(() => props.longPressCallback(), 500):{};

    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : undefined;
    
    let image2 = props.imageName2 ? <img className="tileImg" src={imageLocalCall(props.imageName2)} alt="card Placeholder"></img> : "";
    let cardDouble = props.imageName2 ? { '--card-width': '100%' } : {};
    let url = "";
    if (!props.noLink && !props.selected) {
        if (props.cardType === "add") {
            url = "/add-word/" + encodeURIComponent(props.cardAddToCategory)
        } else if (props.cardType === "file") {
            url = "/video/file/" + props.themeId + "/" + encodeURIComponent(props.cardName)+"/"+encodeURIComponent(props.videoName);
        } else {
            url = "/video/" + encodeURIComponent(props.videoName) + "/" + props.themeId + "/" + encodeURIComponent(props.cardName) + "/-";
        }
    }
    let body = <Rope>
                    <div className="card" style={cardDouble} theme={getTheme(props.themeId)}>
                        <div className="header clip"></div>
                        <div className="main">
                            {image2}
                            {imageSrc?<img className="tileImg" src={imageSrc} alt="card Placeholder"></img>:null}
                            {props.selected?<div style={{display:'flex',position:'absolute', left:10, top:10, zIndex:0}}><img  style={{maxWidth:'25px', maxHeight:'25px'}} alt="" src={imageLocalCall("check.png")}></img></div>:null}
                        </div>
                        <div className="footer">
                            <h2 className="rtl tileFont">{props.cardName}</h2>
                        </div>
                    </div>
                </Rope>

    return (
        <div {...longPressEvent} className="noTouchCallout tileGroup">
            {url !== "" ? <Link to={url}>{body}</Link>:
             body}
        </div>
    );
}
