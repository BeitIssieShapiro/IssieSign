import React from "react";
import "../css/box.css";
import "../css/shelf.css";
import "../css/Tile.css";
import '../css/App.css';

import { imageLocalCall } from "../apis/ImageLocalCall";
import ISLink from "./ISLink";
import { Selected } from "./ui-elements";

import { translate } from '../utils/lang';


function Tile2(props) {

    let imageSrc = props.imageName ? imageLocalCall(props.imageName) : undefined;
    let body = <div >
        <div className="tileBox boxhost" theme="blue" theme-flavor={props.themeFlavor}
            style={{
                width: props.dimensions.boxWidth
            }}>
            <div className="box">
                <header>
                    <span></span>
                    <div></div>
                </header>
                <main>
                    <div style={{ width: props.dimensions.imageBoxWidth }} >
                        {imageSrc ? <img className="tileImg" src={imageSrc} alt={translate("MissingImageAlt")} /> : null}
                        {props.selected ? <div style={{ display: 'flex', position: 'absolute', right: -17, bottom: -25, zIndex: 5 }}><Selected /></div> : null}
                    </div>

                </main>
            </div>
            <div className="tileText"  >
                {props.tileName}
            </div>
        </div>
        
    </div>

    return (
        <ISLink 
            onLongPress={props.onLongPress}
            url={props.selected?"":props.tileUrl}
            style={{ width: props.dimensions.tileGroupWidth }}
        >
            {body}
        </ISLink>

    );
}

export default Tile2;
