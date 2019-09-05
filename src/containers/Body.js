import React from "react";
import '../css/App.css';
import { jsonLocalCall } from "../apis/JsonLocalCall";
import Tile2 from "../components/Tile2";

import { rootTranslateX, getThemeFlavor, calcWidth , ALLOW_ADD_KEY, getBooleanSettingKey} from "../utils/Utils";
import IssieBase from "../IssieBase";
import { listAdditionsFolders } from '../apis/file'


class Body extends IssieBase {
    constructor(props) {
        super(props);
        this.state = this.getState(props);
        setTimeout(() => listAdditionsFolders().then(addedCategories => {
            let elements = this.state.elements;
            let newWords = false;
            if (addedCategories.length > 0) {
                let i = 9000;
                for (let cat of addedCategories) {
                    newWords = true;
                    if (!this.state.categories.find(c => c.id === cat.name)) {
                        //only add category that is not an existing one

                        elements.push(<Tile2 key={i++} tileName={cat.name} tileUrl={"/word-added/" + cat.name + "/" + cat.name}
                            imageName={cat.nativeURL + "default.jpg"} themeFlavor="1" />);
                    }
                }
            }

            if (this.state.allowAddWord) {
                elements.push(<Tile2 key={9998} tileName={'הוסף'} tileUrl={"/add-category"}
                    imageName={'plus.jpg'} themeFlavor={1} />);
                newWords = true;
            }
            if (newWords) {
                this.setState({ elements });
            }


        }), 400);

    }

    getState(props) {
        let categories
        let allowAddWord = getBooleanSettingKey(ALLOW_ADD_KEY, false)
        if (props.categories === undefined) {
            let mainJson = jsonLocalCall("main");
            categories = mainJson.categories;
        } else {
            categories = props.categories;
        }
        let elements = categories.map((category) => {
            return <Tile2 key={category.id} tileName={category.name} tileUrl={"/word/" + encodeURIComponent(category.id) + "/" + encodeURIComponent(category.name)}
                imageName={category.imageName} themeFlavor={getThemeFlavor(category.id)} />
        });

        // let i = 9000;
        // for (let cat of addedCategory) {
        //     alert(JSON.stringify(cat));
        //     // elements.push(<Tile2 key={i++} tileName={cat.name} tileUrl={"/word-added/" + cat.name}
        //     //     imageName={cat.fullPath + "/default.jpg"} themeFlavor="1" />);
        // }


        return { elements: elements, categories, allowAddWord };
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

        if ((this.isMobile() && this.state.narrow) || this.props.isSearch) {
            width = '100%'
        } else {
            width = width + 'px';
        }

        console.log("Body: Height: " + window.innerHeight + ", window.innerWidth=" + window.innerWidth + ", Width: " + width);

        return (
            <div className="tileContainer" style={{ width: width, transform: 'translateX(' + (this.props.InSearch ? 0 : rootTranslateX) + 'px)' }}>
                {elements}
            </div>
        )
    }
}

export default Body;



