import React from "react";
import '../css/App.css';
import {jsonLocalCall} from "../apis/JsonLocalCall";
import Word from "./Word";
import Body from "./Body";


class Search extends React.Component {
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
            return acc.concat(cur.words)
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
            <div>
                <Body categories={
                    this.filterCategories(this.props.routeParams.searchStr)
                } isSearch="true"/>
                <Word words={
                    this.filterWords(this.props.routeParams.searchStr)
                } isSearch="true"/>
            </div>
        )
    }
}

export default Search;
