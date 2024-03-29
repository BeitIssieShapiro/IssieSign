import React from "react";
import '../css/App.css';
import Tile2 from "../components/Tile2";
import { withAlert } from 'react-alert'

import { calcWidth, getTheme } from "../utils/Utils";
import IssieBase from "../IssieBase";
import Shelf from "./Shelf";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getDecoration } from "../components/ui-elements"
import { translate, fTranslate } from "../utils/lang";
import FileSystem from "../apis/filesystem";
import { lineHeight } from "@mui/system";

class Body extends IssieBase {

    /*
    toggleSelect = (category, forceOff) => {
        if (!forceOff && (!category || !category.userContent)) return;

        if (forceOff || (this.state.selectedCategory && this.state.selectedCategory.id === category.id)) {
            //toggle off
            this.setState({ selectedCategory: undefined });
            this.props.pubSub.publish({ command: "hide-all-buttons" });
        } else {
            this.setState({ selectedCategory: category });
            if (this.props.pubSub && this.props.allowAddWord) {
                this.props.pubSub.publish({
                    command: "show-delete", callback: () => {
                        if (this.state.selectedCategory) {
                            confirmAlert({
                                title: translate("ConfirmTitleDeleteCategory"),
                                message: fTranslate("ConfirmDeleteCategoryMessage", category.name),
                                buttons: [
                                    {
                                        label: translate("BtnYes"),
                                        onClick: () => this.deleteCategory(category.name)
                                    },
                                    {
                                        label: translate("BtnCancel"),
                                        onClick: () => this.props.alert.info(translate("InfoDeleteCanceled"))
                                    }
                                ]
                            });

                        }
                    }
                });
            }
        }
    }

    deleteCategory(category) {
        FileSystem.get().deleteCategory(category).then(
            //Success:
            async () => {
                this.props.pubSub.publish({ command: "refresh" })
                this.toggleSelect(null, true)
                this.props.alert.success(translate("InfoDeleteSucceeded"));
            },
            //error
            (e) => this.props.alert.error(translate("InfoDeleteFailed") +"\n" + e)
        );
    }
    */

    render() {
        let elements = this.props.categories.map((category) => {
            return <Tile2
                key={category.id}
                tileName={category.name}
                userContent={category.userContent}
                pubSub={this.props.pubSub}
                editMode={this.props.editMode}
                shareCart={this.props.shareCart}
                tileUrl={"/word/" + encodeURIComponent(category.name) + "/" + encodeURIComponent(category.name)}
                imageName={category.imageName}
                themeId={category.userContent && category.themeId ? category.themeId : getTheme(category.id)}
                onLongPress={category.userContent && this.props.allowAddWord ? () => this.toggleSelect(category) : undefined}
                //selected={this.state.selectedCategory && this.state.selectedCategory.id === category.id}
                translate={category.translate}
                dimensions={this.props.dimensions}
            />
        });

        //calculate best width:
        let narrow = IssieBase.isMobile() && !IssieBase.isLandscape();
        let tileH = 163,
            //tileW = narrow ? 179 : 212;
            tileW = this.props.dimensions.tileGroupWidthNumeric;
        //let tileWidthAbs = narrow ? 178 : 220;

        let width = calcWidth(elements.length, this.props.dimensions.height,
            this.props.dimensions.width, tileH, tileW, this.props.isMobile, this.props.InSearch);


        width = Math.max(width, this.props.dimensions.width);
        //build array of lines:
        let lineWidth = 0;
        let curLine = -1;
        let lines = [];
        if (this.props.InSearch) {
            lines.push(elements);
        } else {
            for (let i = 0; i < elements.length; i++) {
                let card = elements[i];
                //card.props.dimensions.boxHeight = tileH - 28;
                lineWidth += tileW;
                if (curLine < 0 || lineWidth > width) {
                    curLine++;
                    lines.push([]);
                    lineWidth = tileW;
                }
                lines[curLine].push(card);
            }
        }

        // Calculate the height of one box:
        const adjustedTileH = (this.props.dimensions.height - 153) / lines.length;
        //console.log("boxHeight",lines.length, tileH, lines.length* tileH, adjustedTileH)

        if (lines.length > 1 && !this.props.isMobile && elements.length > 12) {
            lines.forEach(line => {
                line.forEach(card => card.props.dimensions.boxHeight = adjustedTileH - 30)
            });
        }

        //console.log("Body: narrow: "+(narrow?'yes':'no')+"Height: " + window.innerHeight + ", window.innerWidth=" + window.innerWidth + ", Width: " + width);
        let widthStr = width + 'px';
        if (this.props.isMobile && narrow) {
            widthStr = '100%'
        }

        return (
            <div scroll-marker="1" className={[this.props.InSearch ? "subTileContainer" : "scrollable tileContainer"]} style={{
                width: widthStr,
                flexWrap: 'wrap',
                transform: `translateX(${this.props.scroll?.x || 0}px) translateY(${this.props.scroll?.y || 0}px)`,
                transitionDuration: this.props.allowSwipe ? '0s' : '1.7s',
            }}>
                {lines.map((line, i) => (
                    <Shelf key={i}>
                        {getDecoration(i, tileW, line.length, width)}
                        {line}
                    </Shelf>
                ))}
            </div>
        )
    }

}

export default withAlert()(Body);



