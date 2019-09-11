import React from "react";
import '../css/App.css';
import Card2 from "../components/Card2";
import { wordsTranslateX, calcWidth } from "../utils/Utils";
import { deleteWord, shareWord } from '../apis/file'
import IssieBase from '../IssieBase'
import { reloadAdditionals } from "../apis/catalog";

class Word extends IssieBase {

    static getDerivedStateFromProps(props, state) {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
        }

        return null;
    }


    toggleSelect = (word, forceOff) => {
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
                        if (this.state.selectedWord && window.confirm("האם למחוק את המילה '" + this.state.selectedWord.name + "'?")) {
                            deleteWord(this.state.selectedWord.videoName).then(
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
                    }
                });
                this.props.pubSub.publish({
                    command: "show-share", callback: () => {
                        if (this.state.selectedWord) {
                            shareWord(this.state.selectedWord).then(
                                //Success:
                                () => {
                                    this.toggleSelect(null, true)
                                },
                                //error
                                (e) => alert("שיתוף נכשל\n" + e)
                            );
                        }
                    }
                });
            }
        }

    }

    render() {

        let wordsElements = [];
        let elementWidths = [];
        if (Array.isArray(this.props.words)) {
            wordsElements = this.props.words.map((word) => {
                let themeId = this.props.categoryId4Theme;
                let selected = this.state.selectedWord && this.state.selectedWord.id === word.id;
                if (word.categoryId) {
                    themeId = word.categoryId;
                }
                let selectable = word.type === "file"
                return <Card2 key={word.id} cardType={selectable ? "file" : "default"} cardName={word.name} videoName={word.videoName}
                    imageName={word.imageName} imageName2={word.imageName2} themeId={themeId} longPressCallback={selectable ? () => this.toggleSelect(word) : undefined} selected={selected} />
            });


            if (this.props.allowAddWord) {
                wordsElements.push(<Card2 key={9999} cardName={'הוסף'} cardType="add" cardAddToCategory={this.props.categoryId}
                    imageName={'plus.jpg'} themeId={this.props.categoryId4Theme} />);
            }

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
                window.innerWidth, tileH, tileW, this.props.isMobile, this.props.isSearch !== undefined);
        }
        // if (this.state.words.find(f => f.imageName2)) {
        //     width += 100; //for double image icons
        // }

        width = Math.max(width, window.innerWidth);

        if (this.props.InSearch) {
            width = '100%';
        } else {
            width += 'px';
        }
        return (
            <div className="tileContainer" style={{ width: width, transform: 'translateX(' + (this.props.InSearch ? 0 : wordsTranslateX) + 'px)' }}>
                {wordsElements}
            </div>
        )
    }
}

export default Word;
