import React from "react";
import '../css/App.css';
import {jsonLocalCall} from "../apis/JsonLocalCall";
import Tile2 from "../components/Tile2";
import ListItem from "../components/ListItem";

import {rootTranslateX, saveRootTranslateX, getThemeFlavor} from "../utils/Utils";
import IssieBase from "../IssieBase";

var elements;
class Body extends IssieBase {
    constructor(props){
        super(props);

        let mainJson = jsonLocalCall("main");
        if (!elements) {
           elements = mainJson.categories.map((category) =>
                <Tile2 key={category.id} tileName={category.name} tileUrl={"/word/" + category.id}
                    imageName={category.imageName} themeFlavor={getThemeFlavor(category.id)}  />); 
        }

        this.state = {
            elements: elements
        };
    }


    render() {

        let elements = this.state.elements;

        //calculate best width:
        let tileH = 175, tileW = this.state.narrow?140:220;
        let rows = Math.max(Math.floor( (window.innerHeight - 153) / tileH), 1);
        console.log("Height: " + window.innerHeight + ", rows: " + rows)
        let cols = Math.ceil(elements.length / rows)
        let width = cols * tileW;

        if (this.isMobile()) 
            return (
                <div className="listItems">
                    <ul>
                        {elements}
                    </ul>
        
                </div>);

        return (
            <div className="tileContainer" style={{width:width+"px", transform:'translateX(' + rootTranslateX + 'px)'}}>
                {elements}
            </div>
        )
    }
}

export default Body;



