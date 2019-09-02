import React from "react";
import '../css/App.css';
import { jsonLocalCall } from "../apis/JsonLocalCall";
import Card2 from "../components/Card2";
import { wordsTranslateX, calcWidth } from "../utils/Utils";
import IssieBase from "../IssieBase";
import { AdditionsDirEntry, listWordsInFolder, deleteWord } from '../apis/file'


class Word extends IssieBase {
    constructor(props) {
        super(props);
        this.state = this.getState(this.props);
        setTimeout(() => AdditionsDirEntry(this.props.categoryId).then(async (additionsDir) => {
            if (additionsDir) {
                let words = this.state.words;

                let addedWords = await listWordsInFolder(additionsDir);
                words = [...words, ...addedWords]

                this.setState({ words });
            }
        }), 50);
    }

    getState(props) {
        if (props.words) {
            return { words: props.words, categoryId: "1" }
        }
        let mainJson = jsonLocalCall("main");

        if (this.props.type === "added") {

            return { words: [], categoryId: this.props.categoryId };
        }

        for (const cat of mainJson.categories) {
            if (cat.id === this.props.categoryId && cat.words) {
                return { words: cat.words, categoryId: cat.id };
            }
        }

    }

    componentWillReceiveProps(newProps) {
        this.setState(this.getState(newProps));
    }
    toggleSelect = (word, forceOff) => {

        if (forceOff || (this.state.selectedWord && this.state.selectedWord.id === word.id)) {
            //toggle off
            this.setState({ selectedWord: undefined });
            this.props.pubSub.publish({ command: "hide-all-buttons" });
        } else {

            this.setState({ selectedWord: word });
            if (this.props.pubSub) {

                this.props.pubSub.publish({
                    command: "show-delete", callback: () => {
                        if (this.state.selectedWord && window.confirm("האם למחוק מילה זו?")) {
                            deleteWord(this.state.selectedWord.videoName).then(
                                //Success:
                                () => {
                                    let removeElem = this.state.words.findIndex(w => w.id === this.state.selectedWord.id);
                                    if (removeElem >= 0) {
                                        let words = this.state.words;
                                        words.splice(removeElem, 1);
                                        this.setState({ words });
                                    }
                                    this.toggleSelect(null, true)
                                },
                                //error
                                (e) => alert("מחיקה נכשלה\n" + e)
                            );
                        }
                    }
                });
            }
        }

    }

    render() {

        var wordsElements = this.state.words.map((word) => {
            let themeId = this.state.categoryId;
            let selected = this.state.selectedWord && this.state.selectedWord.id === word.id;
            if (word.categoryId) {
                themeId = word.categoryId;
            }
            return <Card2 key={word.id} cardType={word.type === "file" ? "file" : "default"} cardName={word.name} videoName={word.videoName}
                imageName={word.imageName} imageName2={word.imageName2} themeId={themeId} longPressCallback={true ? () => this.toggleSelect(word) : undefined} selected={selected} />
        });

        wordsElements.push(<Card2 key={9999} cardName={'הוסף'} cardType="add" cardAddToCategory={this.state.categoryId}
            imageName={'plus.jpg'} themeId={this.state.categoryId} />);

        //calculate the average width, while considering double images
        var elementWidths = this.state.words.map((word) => {
            return word.imageName2 ? 300 : 220;
        });
        let width = 0;
        if (elementWidths.length > 0) {
            let widthSum = elementWidths.reduce(function (a, b) { return a + b; });
            let tileW = widthSum / elementWidths.length;

            //calculate best width:
            let tileH = 192;

            width = calcWidth(wordsElements.length, window.innerHeight,
                window.innerWidth, tileH, tileW, this.isMobile(), this.props.isSearch !== undefined);
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
