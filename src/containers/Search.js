import React from "react";
import '../css/App.css';
import Word from "./Word";
import Body from "./Body";
//const levenshtein = require('js-levenshtein');
import { trace } from "../utils/Utils";

function fuzzyMatch(str, searchStr) {
    return str.includes(searchStr);// || searchStr.length > 3 && levenshtein(str, searchStr) <= 2;
}

function Search(props) {

    const filterWords = (filterStr) => {
        trace("filterWord:" + filterStr)
        let res = props.words.filter(word => {
            let found = fuzzyMatch(word.name, filterStr);
            if (!found && word.tags) {
                let foundTags = word.tags.filter(tag => tag.includes(filterStr));
                found = foundTags.length > 0;
            }
            return found;
        });
        return res;
    }

    const filterCategories = (filterStr) => {
        trace("filterCategories:" + filterStr)
        return props.categories.filter(cat => {
            let found = fuzzyMatch(cat.name, filterStr);
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
            transform: 'translateX(' + props.scroll.x + 'px)',
            flexDirection: 'column',
            transitionDuration: props.allowSwipe?'0s':'1.7s',

        }}>
            <Body InSearch={true}
                categories={
                    filterCategories(props.searchStr)
                }
                dimensions={props.dimensions}
                pubSub={props.pubSub}
                editMode={props.editMode}
                shareCart={props.shareCart}
                allowSwipe={props.allowSwipe}
                scroll={{x:0,y:0}}
            />
            <Word InSearch={true}
                words={
                    filterWords(props.searchStr)
                }
                pubSub={props.pubSub}
                editMode={props.editMode}
                shareCart={props.shareCart}

                dimensions={props.dimensions}
                allowSwipe={props.allowSwipe}
                scroll={{x:0,y:0}}
            />
        </div>
    )
}

export default Search;
