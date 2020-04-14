import React from "react";
import '../css/App.css';
import Card2 from "../components/Card2";
import { wordsTranslateX, calcWidth } from "../utils/Utils";
import { deleteWord, shareWord } from '../apis/file'
import IssieBase from '../IssieBase'
import { reloadAdditionals } from "../apis/catalog";
import { withAlert } from 'react-alert'
import Rope from '../components/Rope'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class Word extends IssieBase {

    static getDerivedStateFromProps(props, state) {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            console.log("set-catId " + props.categoryId)
        }

        return null;
    }


    toggleSelect = async (word, forceOff) => {
        if (!forceOff && (!word || word.type !== 'file')) return;

        if (forceOff || (this.state.selectedWord && this.state.selectedWord.id === word.id)) {
            //toggle off
            this.setState({ selectedWord: undefined });
            this.props.pubSub.publish({ command: "hide-all-buttons" });
        } else {

            this.setState({ selectedWord: word });
            if (this.props.pubSub) {
                this.props.pubSub.publish({
                    command: "show-delete", callback: () => {
                        if (this.state.selectedWord) {
                            confirmAlert({
                                title: 'מחיקת מילה',
                                message: "האם למחוק את המילה '" + this.state.selectedWord.name + "'?",
                                buttons: [
                                    {
                                        label: 'כן',
                                        onClick: () => {
                                            deleteWord(this.state.selectedWord.videoName).then(
                                                //Success:
                                                async () => {
                                                    await reloadAdditionals();
                                                    this.props.pubSub.publish({ command: "refresh" })
                                                    this.toggleSelect(null, true)
                                                    this.props.alert.success("מחיקה בוצעה");
                                                },
                                                //error
                                                (e) => this.props.alert.error("מחיקה נכשלה\n" + e)
                                            );
                                        }
                                    },
                                    {
                                        label: 'בטל',
                                        onClick: () => this.props.alert.info('מחיקה בוטלה')
                                    }
                                ]
                            });
                        }
                    }
                });
            }
        }
        this.props.pubSub.publish({
            command: "show-share", callback: () => {
                console.log("Share pressed");
                if (this.state.selectedWord) {
                    this.props.pubSub.publish({ command: 'set-busy', active: true, text: 'משתף מילים...' });
                    shareWord(this.state.selectedWord).then(
                        //Success:
                        () => this.toggleSelect(null, true),
                        //error
                        (e) => this.props.alert.error("שיתוף נכשל\n" + e)

                    ).finally(() =>
                        this.props.pubSub.publish({ command: 'set-busy', active: false })
                    );
                }
            }
        });
    }


render() {

    let wordsElements = [];
    let elementWidths = [];
    let themeId = this.props.categoryId4Theme;
    if (Array.isArray(this.props.words)) {
        wordsElements = this.props.words.map((word) => {
            let selected = this.state.selectedWord && this.state.selectedWord.id === word.id;
            if (word.categoryId) {
                themeId = word.categoryId;
            }
            let selectable = word.type === "file"
            return <Card2 key={word.id} cardType={selectable ? "file" : "default"} cardName={word.name} videoName={word.videoName}
                imageName={word.imageName} imageName2={word.imageName2} themeId={themeId} longPressCallback={selectable ? () => this.toggleSelect(word) : undefined} selected={selected} />
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
        <div className={this.props.InSearch ? "subTileContainer" : "tileContainer"}
            style={{
                flexDirection: 'column',
                width: width, transform: 'translateX(' + (this.props.InSearch ? 0 : wordsTranslateX) + 'px)'
            }}>
            {lines.map((line) => (
                <Rope size={line.length < 5 ? "S" : line.length > 15 ? "L" : "M"}>
                    {line}
                </Rope>
            ))}
        </div>
    )
}
}

export default withAlert()(Word);
