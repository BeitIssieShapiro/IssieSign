import React from "react";
import '../css/App.css';
import Word from "./Word";
import Body from "./Body";
import { rootTranslateX } from "../utils/Utils";



function Search(props) {

    const filterWords = (filterStr) => {
        console.log("filterWord:"+filterStr)
        let res = props.words.filter( word => {
            let found = word.name.includes(filterStr);
            if (!found && word.tags) {
                let foundTags = word.tags.filter(tag => tag.includes(filterStr));
                found = foundTags.length > 0;
            }
            return found;
        });
        return res;
    }

    const filterCategories = (filterStr) => {
        console.log("filterCategories:"+filterStr)
        return props.categories.filter( cat => {
            let found = cat.name.includes(filterStr);
            if (!found && cat.tags) {
                let foundTags = cat.tags.filter(tag => tag.includes(filterStr));
                found = foundTags.length > 0;
            }
            return found;
        });
    }

    return (
        <div className='tileContainer' style={{ 
                width: props.isMobile ? '110%' : '100%', 
                transform: 'translateX(' + rootTranslateX + 'px)',
                flexDirection: 'column'
            }}>
            <Body InSearch={true} categories={
                    filterCategories(props.searchStr)    
                } 
                dimensions={props.dimensions}
                />
            <Word InSearch={true} 
                words={
                    filterWords(props.searchStr)
                } 
                dimensions={props.dimensions}
                />
        </div>
    )
}

export default Search;
