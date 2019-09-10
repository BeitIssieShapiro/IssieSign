import React from "react";
import '../css/App.css';
import Word from "./Word";
import Body from "./Body";
import { rootTranslateX } from "../utils/Utils";



function Search(props) {

    const filterWords = (filterStr) => {
        //alert(JSON.stringify(props.words))
        console.log("filterWord:"+filterStr)
        let res = props.words.filter(function (word) {
            return word.name.includes(filterStr);
        });
        console.log(JSON.stringify(res))
        return res;
    }

    const filterCategories = (filterStr) => {
        console.log("filterCategories:"+filterStr)
        return props.categories.filter(function (cat) {
            return cat.name.includes(filterStr);
        });
    }

    return (
        <div className='tileContainer' style={{ width: props.isMobile ? '110%' : '1200px', transform: 'translateX(' + rootTranslateX + 'px)' }}>
            <Body InSearch={true} categories={
                filterCategories(props.searchStr)
            } isSearch="true" />
            <Word InSearch={true} words={
                filterWords(props.searchStr)
            } isSearch="true" />
        </div>
    )
}

export default Search;
