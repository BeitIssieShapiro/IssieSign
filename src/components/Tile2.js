import React from "react";
import { Link } from "react-router";
import "../css/box.css";
import "../css/shelf.css";
import "../css/Tile.css";
import '../css/App.css';

import {imageLocalCall} from "../apis/ImageLocalCall";
import IssieBase from "../IssieBase";
import ListItem from "./ListItem";

class Tile2 extends IssieBase {

    render() {

        //this.isMobile()
        if (false) {
            return (
                <ListItem Name={this.props.tileName}
                          Url={this.props.tileUrl}
                          imageName={this.props.imageName} />
            );
        }

        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";
        let classNameShelf = this.state.narrow? "shelfMobile" : "shelf";
        let classNameTileGroup = this.state.narrow? "tileGroupMobile" : "tileGroup";
        let classNameTileBox = this.state.narrow? "tileBoxMobile" : "tileBox";
        let classNameBoxHost = this.state.narrow? "boxhostMobile" : "boxhost";

        let mobileText = "";
            if (this.isMobile()) {
                mobileText =
                    <div className="textContainer">
                        <span className="rtl tileTextMobile">{this.props.tileName}</span>
                    </div>
            }
        let notMobileText = "";
        if (!this.isMobile()) {
            notMobileText =
                <h2 className="rtl tileText">{this.props.tileName}</h2>
        }

        return (

            <div className={classNameTileGroup}>
                <Link to={this.props.tileUrl}>
                <div className={classNameTileBox + " " + classNameBoxHost} theme="blue" theme-flavor= {this.props.themeFlavor} style={{display: "border: 1px solid red"}}>

                    <div className="box" >
                        <header>
                            <span></span>
                            <div></div>
                        </header>
                        <main>
                            <div>
                                <img className="tileImg" src={imageSrc} alt="Category Placeholder" />
                            </div>
                        </main>
                    </div>
                    {mobileText}
                    </div>
                    <div className="shelfhost">
                                <div className={classNameShelf}>
                                    <div className="container">
                                        {notMobileText}
                                    </div>
                                </div>
                            </div>
                </Link>
                </div>
        );
    }
}
export default Tile2;
