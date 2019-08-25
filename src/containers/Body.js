import React from "react";
import '../css/App.css';
import { jsonLocalCall } from "../apis/JsonLocalCall";
import Tile2 from "../components/Tile2";

import { rootTranslateX, getThemeFlavor, calcWidth } from "../utils/Utils";
import IssieBase from "../IssieBase";


class Body extends IssieBase {
    constructor(props) {
        super(props);
        this.state = this.getState(props);
    }

    getState(props) {
        let categories
        if (props.categories === undefined) {
            let mainJson = jsonLocalCall("main");
            categories = mainJson.categories;

        } else {
            categories = props.categories;
        }
        let elements = categories.map((category) => {
            return <Tile2 key={category.id} tileName={category.name} tileUrl={"/word/" + category.id}
                imageName={category.imageName} themeFlavor={getThemeFlavor(category.id)} />
        });
        return { elements: elements };
    }


    componentWillReceiveProps(props) {
        this.setState(this.getState(props));
    }

    render() {
        let elements = this.state.elements;

        //calculate best width:
        let tileH = 175, tileW = this.state.narrow ? 140 : 220;

        let width = calcWidth(elements.length, window.innerHeight,
            window.innerWidth, tileH, tileW, this.isMobile(), this.props.isSearch !== undefined);

        if (this.isMobile() && this.state.narrow || this.props.isSearch) {
            width = '100%'
        } else {
            width = width + 'px';
        }

        console.log("Body: Height: " + window.innerHeight + ", window.innerWidth=" + window.innerWidth + ", Width: " + width);

        return (
            <div className="tileContainer" style={{ width: width, transform: 'translateX(' + (this.props.InSearch?0:rootTranslateX) + 'px)' }}>
                {elements}
            </div>
        )
    }
}

export default Body;



