import React from "react";
import '../css/App.css';
import {jsonLocalCall} from "../apis/JsonLocalCall";
import Card2 from "../components/Card2";
import {wordsTranslateX, getTheme} from "../utils/Utils";
import IssieBase from "../IssieBase";


class Word extends IssieBase {
    constructor(props){
        super(props);
        this.state = this.getState(this.props);
    }
    
    getState(props) {
        var state;
        if (props.words === undefined) {
            let mainJson = jsonLocalCall("main");
            let wordId = this.props.routeParams.wordId;
            
            mainJson.categories.forEach((category) => {
                if (category.id === wordId && category.words) {
                    state = {words:category.words, categoryId:category.id};
                }
            });

        } else {
            state = {words:props.words, categoryId:"1"}
        }
        return state;
    }

    componentWillReceiveProps(newProps) {
        this.setState(this.getState(newProps));
    }

    render() {
        var wordsElements = this.state.words.map((word) => {
                return <Card2 key={word.id} cardName={word.name} vidName={word.videoName} cardUrl={"/video/" + word.videoName + "/" + this.state.categoryId + "/" + word.name}
                                imageName={word.imageName} imageName2={word.imageName2} theme={getTheme(this.state.categoryId)} />
            });

        //calculate the average width, while considering double images
        var elementWidths = this.state.words.map((word) => {
            return word.imageName2 ? 300 : 220;
        });
        let width = 0;
        if (elementWidths.length > 0) {
            let widthSum = elementWidths.reduce(function(a, b) { return a + b; });
            let tileW = widthSum / elementWidths.length;

            //calculate best width:
            let tileH = 192;
            let rows = Math.max(Math.floor( (window.innerHeight - 153) / tileH), 1);
            let cols = Math.ceil(wordsElements.length / rows)
            width = cols * tileW;
        }
        width = Math.max(width, window.innerWidth);

        if (this.isMobile()) 
        return (
            <div className="listItems">
                <ul>
                    {wordsElements}
                </ul>
    
            </div>);


        return (
            <div className="tileContainer" style={{width:width+"px", transform:'translateX(' + wordsTranslateX + 'px)'}}>
                    {wordsElements}
            </div>
        )
    }
}

export default Word;
