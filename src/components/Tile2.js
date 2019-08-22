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
                          imageName={this.props.imageName} 
                          imageName2={this.props.imageName2} />
            );
        }

        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";

        return (

            <div className="tileGroup" style={{width:this.tileGroupWidth}}>
                <Link to={this.props.tileUrl}>
                <div className="tileBox boxhost" theme="blue" theme-flavor= {this.props.themeFlavor} 
                     style={{display: "border: 1px solid red", marginLeft:this.marginLeftBox, width:this.boxWidth}}>
                    <div className="box" >
                        <header>
                            <span></span>
                            <div></div>
                        </header>
                        <main>
                            <div style={{width:this.imageBoxWidth}}>
                                <img className="tileImg" src={imageSrc} alt="Category Placeholder" />
                            </div>
                        </main>
                    </div>
                    </div>
                    <div className="shelfhost">
                                <div className="shelf" style={{width:this.shelfWidth}}>
                                    <div className="container">
                                    <h2 className="rtl tileText">{this.props.tileName}</h2>
                                    </div>
                                </div>
                            </div>
                </Link>
                </div>
        );
    }
}
export default Tile2;
