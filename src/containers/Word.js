import React from "react";
import '../css/App.css';
import Card2 from "../components/Card2";
import { calcWidth } from "../utils/Utils";
import IssieBase from '../IssieBase'
import { withAlert } from 'react-alert'
import Rope from '../components/Rope'
import 'react-confirm-alert/src/react-confirm-alert.css';

const getBooleanFromString = (str) => str && str.length > 0 && str.charCodeAt(0) % 2 === 0

class Word extends IssieBase {

    static getDerivedStateFromProps(props, state) {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
        }

        return null;
    }


    render() {

        let wordsElements = [];
        let elementWidths = [];
        if (Array.isArray(this.props.words)) {
            wordsElements = this.props.words.map((word) => {
                //let selected = this.state.selectedWord && this.state.selectedWord.id === word.id;
                const themeId = word.themeId || this.props.themeId;


                return <Card2 key={word.id}
                    editMode={this.props.editMode}
                    category={word.category}
                    pubSub={this.props.pubSub}
                    shareCart={this.props.shareCart}
                    userContent={word.userContent}
                    cardType={word.userContent ? "file" : "default"} cardName={word.name} videoName={word.videoName}
                    imageName={word.imageName} imageName2={word.imageName2}
                    themeId={themeId}
                    //longPressCallback={word.userContent ? () => this.props.pubSub.publish({ command: "edit-mode" }) : undefined} 
                    //selected={selected}
                    binder={getBooleanFromString(word.name)} />
            });


            //calculate the average width, while considering double images
            elementWidths = this.props.words.map((word) => {
                return word.imageName2 ? 300 : 220;
            });
        }

        let width = 0;
        if (elementWidths.length > 0) {
            let widthSum = elementWidths.reduce(function (a, b) { return a + b; });
            let tileW = widthSum / elementWidths.length;

            //calculate best width:
            let tileH = 192;

            width = calcWidth(wordsElements.length, window.innerHeight,
                window.innerWidth, tileH, tileW, this.props.isMobile, this.props.InSearch !== undefined);
        }
        // if (this.state.words.find(f => f.imageName2)) {
        //     width += 100; //for double image icons
        // }

        width = Math.max(width, window.innerWidth);
        let linesWidth = width;
        if (this.props.InSearch) {
            if (window.innerWidth > 500) {
                width = '100%';
            } else {
                //width = '500px';
                width += 'px';
                //linesWidth = 500;
            }
        } else {
            width += 'px';
        }
        //build array of lines:
        let lineWidth = -1;
        let curLine = -1;
        let lines = [];
        for (let i = 0; i < wordsElements.length; i++) {
            let card = wordsElements[i];
            lineWidth += (card.imageName2 ? 300 : 200);
            if (curLine < 0 || lineWidth > linesWidth) {
                curLine++;
                lines.push([]);
                lineWidth = card.imageName2 ? 300 : 200;
            }
            lines[curLine].push(card);
        }

        return (
            // <div className={this.props.InSearch?"subTileContainer":"tileContainer"} style={{ width: width, transform: 'translateX(' + (this.props.InSearch ? 0 : wordsTranslateX) + 'px)' }}>
            //     {wordsElements}
            // </div>
            <div className={this.props.InSearch ? "subTileContainer wordContainer" : "tileContainer wordContainer"}
                style={{
                    flexDirection: 'column',
                    width: width,
                    transform: `translateX(${this.props.scroll?.x || 0}px) translateY(${this.props.scroll?.y || 0}px)`,
                    transitionDuration: this.props.allowSwipe ? '0s' : '1.7s',

                }}>
                {lines.map((line, i) => {
                    let ropeSize = line.length < 5 ? "S" : line.length > 15 ? "L" : "M";
                    //on high res go one up
                    // if (IssieBase.isHighResolution()) {
                    //     if (ropeSize === "L") {
                    //         ropeSize = "M";
                    //     } 
                    // }
                    return <Rope size={ropeSize} key={i}>
                        {line}
                    </Rope>
                })}
            </div>
        )
    }
}

export default withAlert()(Word);
