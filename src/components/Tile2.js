import React from "react";
import "../css/box.css";
import "../css/shelf.css";
import "../css/Tile.css";
import '../css/App.css';

import { imageLocalCall } from "../apis/ImageLocalCall";
import IssieBase from "../IssieBase";
//import { A, navigate } from "hookrouter";
import { Link } from "react-router-dom";
class Tile2 extends IssieBase {

    render() {
        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";
        return (

            <div className="tileGroup" style={{ width: this.state.dimensions.tileGroupWidth }} >
                <Link to={this.props.tileUrl?this.props.tileUrl:""}>
                    <div className="tileBox boxhost" theme="blue" theme-flavor={this.props.themeFlavor}
                        style={{ display: "border: 1px solid red", marginLeft: this.state.dimensions.marginLeftBox, width: this.state.dimensions.boxWidth }}>
                        <div className="box" >
                            <header>
                                <span></span>
                                <div></div>
                            </header>
                            <main>
                                <div style={{ width: this.state.dimensions.imageBoxWidth }}>
                                    <img className="tileImg" src={imageSrc} alt="ללא תמונה" />
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="shelfhost">
                        <div className="shelf" style={{ width: this.state.dimensions.shelfWidth }}>
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
