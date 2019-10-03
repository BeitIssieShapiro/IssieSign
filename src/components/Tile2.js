import React from "react";
import "../css/box.css";
import "../css/shelf.css";
import "../css/Tile.css";
import '../css/App.css';

import { imageLocalCall } from "../apis/ImageLocalCall";
import longPress from '../apis/longPress';

//import { A, navigate } from "hookrouter";
import { Link } from "react-router-dom";

function Tile2(props) {
    const longPressEvent = props.onLongPress ? longPress(() => props.onLongPress(), 500) : {};

    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : "image1.png";
    let body = <div>
        <div className="tileBox boxhost" theme="blue" theme-flavor={props.themeFlavor}
            style={{ 
                
                marginLeft: props.dimensions.marginLeftBox, width: props.dimensions.boxWidth }}>
            <div className="box" >
                <header>
                    <span></span>
                    <div></div>
                </header>
                <main>
                    <div style={{ width: props.dimensions.imageBoxWidth }}>
                        <img className="tileImg" src={imageSrc} alt="ללא תמונה" />
                        {props.selected ? <div style={{ display: 'flex', position: 'absolute', left: 10, top: 10, zIndex: 0 }}><img style={{ maxWidth: '25px', maxHeight: '25px' }} alt="" src={imageLocalCall("check.png")}></img></div> : null}
                    </div>

                </main>
            </div>
        </div>
        <div className="shelfhost">
            <div className="shelf" style={{ width: props.dimensions.shelfWidth }}>
                <div className="container">
                    <h2 className="rtl tileText">{props.tileName}</h2>
                </div>
            </div>
        </div>
    </div>

    return (
        <div {...longPressEvent} className="tileGroup" style={{ width: props.dimensions.tileGroupWidth }} >
            {props.tileUrl  != "" && !props.selected ? <Link to={props.tileUrl}>{body}</Link>: body}
        </div>
    );
}

export default Tile2;
