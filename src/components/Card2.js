import React from "react";
import { Link } from "react-router";
import "../css/card.css";
import "../css/Tile.css";

import {imageLocalCall} from "../apis/ImageLocalCall";
import Rope from "../components/Rope";
import IssieBase from "../IssieBase";
import ListItem from "./ListItem";


class Card2 extends IssieBase {
    render() {
        // this.isMobile()
        if (false) {
            return (
                <ListItem Name={this.props.cardName} 
                          Url={this.props.cardUrl}
                          imageName={this.props.imageName}
                          imageName2={this.props.imageName2}/>
            );
        }
        let imageSrc = this.props.imageName ? imageLocalCall(this.props.imageName) : "image1.png";
        let image2 = this.props.imageName2?<img className="tileImg" src={imageLocalCall(this.props.imageName2)} alt="card Placeholder"></img>:"";
        let cardDouble = this.props.imageName2?{'--card-width':'100%'}:{};
 
        return (
        <Link to={this.props.cardUrl}>
            <Rope>
                    <div className="card" style={cardDouble} theme={this.props.theme}>
                        <div className="header clip"></div>
                        <div className="main">
                            {image2}
                            <img className="tileImg" src={imageSrc} alt="card Placeholder"></img>
                        </div>
                        <div className="footer">
                            <h2 className="rtl tileFont">{this.props.cardName}</h2>
                        </div>
                    </div>
             

            </Rope>
        </Link>
        );
    }
}

export default Card2;
