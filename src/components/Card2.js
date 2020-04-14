import React from "react";
import "../css/card.css";
import "../css/Tile.css";
import "../css/rope.css";

import { imageLocalCall } from "../apis/ImageLocalCall";
import Rope from "../components/Rope";
import { getTheme } from "../utils/Utils";
import longPress from '../apis/longPress';
import { Link } from "react-router-dom";
import { Selected } from "./ui-elements";

export default function Card2(props) {
    const longPressEvent = props.longPressCallback ? longPress(() => props.longPressCallback(), 500) : {};

    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : undefined;

    let image2 = props.imageName2 ? <img className="tileImg" src={imageLocalCall(props.imageName2)} alt="card Placeholder"></img> : "";
    let cardDouble = props.imageName2 ? { '--card-width': '100%' } : {};
    let url = "";
    if (!props.noLink && !props.selected) {
        if (props.cardType === "add") {
            url = "/add-word/" + encodeURIComponent(props.cardAddToCategory)
        } else if (props.cardType === "file") {
            url = "/video/file/" + props.themeId + "/" + encodeURIComponent(props.cardName) + "/" + encodeURIComponent(props.videoName);
        } else {
            url = "/video/" + encodeURIComponent(props.videoName) + "/" + props.themeId + "/" + encodeURIComponent(props.cardName) + "/-";
        }
    }
    let innerBody = (
        <div className="card" style={cardDouble} theme={getTheme(props.themeId)}>
            <div className="header clip"></div>
            <div className="main">
                {image2}
                {imageSrc ? <img className="tileImg" src={imageSrc} alt="card Placeholder"></img> : null}
            </div>
            <div className="footer">
                <h2 className="rtl tileFont">{props.cardName}</h2>
            </div>
            {props.selected ? <div style={{ display: 'flex', position: 'absolute', right: -17, bottom: -10, zIndex: 0 }}><Selected /></div> : null}
        </div>)
    let body =
        <div className="rope-container">

            {innerBody}
        </div>

    return (
        <div {...longPressEvent} className="noTouchCallout tileGroup">
            {props.addMode?<div style={{height:'40px', width:'100%'}}></div>:null}
            {url !== "" ? <Link to={url}>{body}</Link> :
                body}
        </div>
    );
}
