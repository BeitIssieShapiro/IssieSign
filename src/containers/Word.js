import React from "react";
import '../css/App.css';
import {jsonLocalCall} from "../apis/JsonLocalCall";
import Card2 from "../components/Card2";
import {wordsTranslateX, getTheme, calcWidth} from "../utils/Utils";
import IssieBase from "../IssieBase";


class Word extends IssieBase {
    constructor(props){
        super(props);
        this.state = this.getState(this.props);
    }
        
    getState(props) {
        if (props.words) {
            return  {words:props.words, categoryId:"1"}
        } else if (this.props.routeParams) {
            let mainJson = jsonLocalCall("main");
            let wordId = props.routeParams.wordId;
            
            for (const cat of mainJson.categories) {
                if (cat.id === wordId && cat.words) {
                    return {words:cat.words, categoryId:cat.id};
                }
            }
        } 
        return {words:[], categoryId:"1"}
    }

    componentWillReceiveProps(newProps) {
        this.setState(this.getState(newProps));
    }

    render() {

        var wordsElements = this.state.words.map((word) => {
            let themeId = this.state.categoryId;
                if (word.categoryId) {
                    themeId = word.categoryId;
                }
                return <Card2 key={word.id} cardName={word.name} vidName={word.videoName} cardUrl={"/video/" + word.videoName + "/" + themeId + "/" + word.name}
                                imageName={word.imageName} imageName2={word.imageName2} theme={getTheme(themeId)} />
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

            width = calcWidth(wordsElements.length, window.innerHeight, 
                window.innerWidth, tileH, tileW, this.isMobile(), this.props.isSearch !== undefined) ; 
          }

        width = Math.max(width, window.innerWidth);

        return (
            <div className="tileContainer" style={{width:width+"px", transform:'translateX(' + wordsTranslateX + 'px)'}}>
                    {wordsElements}
            </div>
        )
    }
}

export default Word;
