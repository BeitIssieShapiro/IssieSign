import React from "react";
import '../css/App.css';
import Tile2 from "../components/Tile2";

import { rootTranslateX, getThemeFlavor, calcWidth } from "../utils/Utils";
import IssieBase from "../IssieBase";
import {deleteCategory } from '../apis/file'
import {reloadAdditionals} from '../apis/catalog'

class Body extends IssieBase {


    toggleSelect = (category, forceOff) => {
        if (!forceOff && (!category || category.type !== 'added')) return;

        if (forceOff || (this.state.selectedCategory && this.state.selectedCategory.id === category.id)) {
            //toggle off
            this.setState({ selectedCategory: undefined });
            this.props.pubSub.publish({ command: "hide-all-buttons" });
        } else {
            this.setState({ selectedCategory: category });
            if (this.props.pubSub) {
                this.props.pubSub.publish({
                    command: "show-delete", callback: () => {
                        if (this.state.selectedCategory && window.confirm("מחיקת קטגוריה תמחק גם את כל המילים שבתוכה. האם למחוק את הקטגוריה:'" + category.name + "'?")) {
                            this.deleteCategory(category);
                        }
                    }
                });
            }
        }
    }

    deleteCategory(category) {
        deleteCategory(category).then(
            //Success:
            async () => {
                await reloadAdditionals();
                this.props.pubSub.publish({ command: "refresh" })
                this.toggleSelect(null, true)
            },
            //error
            (e) => alert("מחיקה נכשלה\n" + e)
        );        
    }

    render() {
        let elements = this.props.categories.map((category) => {
            return <Tile2 
                key={category.id} 
                tileName={category.name} 
                tileUrl={"/word/" + encodeURIComponent(category.id) + "/" + encodeURIComponent(category.name)}
                imageName={category.imageName} 
                themeFlavor={getThemeFlavor(category.type === "added" ?"1":category.id)} 
                onLongPress={category.type === "added" ? () => this.toggleSelect(category) : undefined} 
                selected={this.state.selectedCategory && this.state.selectedCategory.id === category.id}
                dimensions={this.props.dimensions}
            />
        });

        if (this.props.allowAddWord) {
            elements = elements.concat(<Tile2
                key={9998}
                tileName={'הוסף'}
                tileUrl={"/add-category"}
                imageName={'plus.jpg'}
                themeFlavor={1}
                dimensions={this.props.dimensions}
            />);
        }

        //calculate best width:
        let narrow = IssieBase.isMobile() && !IssieBase.isLandscape();
        let tileH = 175, tileW = narrow ? 140 : 220;

        let width = calcWidth(elements.length, window.innerHeight,
            window.innerWidth, tileH, tileW, this.props.isMobile, this.props.InSearch);

        if ((this.props.isMobile && narrow) || this.props.InSearch) {
            width = '100%'
        } else {
            width = width + 'px';
        }

        //console.log("Body: Height: " + window.innerHeight + ", window.innerWidth=" + window.innerWidth + ", Width: " + width);

        return (
            <div className={this.props.InSearch?"subTileContainer":"tileContainer"} style={{
                width: width, 
                transform: 'translateX(' + (this.props.InSearch ? 0 : rootTranslateX) + 'px)',
                
            }}>
                {elements}
            </div>
        )
    }

}

export default Body;



