import React from "react";
import '../css/App.css';
import {jsonLocalCall} from "../apis/JsonLocalCall";
import Word from "./Word";
import Body from "./Body";
import { rootTranslateX } from "../utils/Utils";
import IssieBase from "../IssieBase";


class Search extends IssieBase {
    constructor(props){
        super(props);
        var mainJson = jsonLocalCall("main").categories;
        var words = mainJson.reduce((acc, cur) => {
                                                return acc.concat(cur.words)
                                            }, []);
        
        this.state = {words : words};
     }

    filterWords(filterStr){
        var mainJson = jsonLocalCall("main").categories;
        return mainJson.reduce((acc, cur) => {
            
            return acc.concat(cur.words.map((word)=>{
                word['categoryId'] = cur.id;
                return word;
            }))
        }, []).filter(function(word) {
            return word.name.includes(filterStr);
        });
    }

    filterCategories(filterStr){
        var mainJson = jsonLocalCall("main").categories;
        return mainJson.filter(function(cat) {
            return cat.name.includes(filterStr);
        });
    }

    render() {
        return (
            <div className='tileContainer' style={{width: this.isMobile()?'110%':'1200px', transform: 'translateX(' + rootTranslateX + 'px)'}}>
                <Body InSearch={true} categories={
                    this.filterCategories(this.props.routeParams.searchStr)
                } isSearch="true"/>
                <Word InSearch={true} words={
                    this.filterWords(this.props.routeParams.searchStr)
                } isSearch="true"/>
            </div>
        )
    }
}

export default Search;
