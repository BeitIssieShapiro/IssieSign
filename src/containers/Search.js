import React, { useEffect } from "react";
import '../css/App.css';
import Word from "./Word";
import Body from "./Body";
//const levenshtein = require('js-levenshtein');
import { getTheme, getThemeName, trace } from "../utils/Utils";
import { fTranslate } from '../utils/lang';


function fuzzyMatch(str, searchStr) {
    return str.toLowerCase().includes(searchStr.toLowerCase());// || searchStr.length > 3 && levenshtein(str, searchStr) <= 2;
}

function Search(props) {
    //const [filter, setFilter] = useState(props.filterStr);

    useEffect(() => {
        props.pubSub.publish({ command: "set-title", title: fTranslate("SearchTitle", props.searchStr) });
    }, [props.searchStr]);

    useEffect(() => {
        props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
    }, [props.themeId]);

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

        return props.currentCategory ? res : res.map(word => {
            if (word.categoryId) {
                const category = props.categories.find(cat => cat.id == word.categoryId);
                if (category) {
                    word.themeId = category.themeId;
                }
            }
            return word;
        });
    }

    const filterCategories = (filterStr) => {
        trace("filterCategories:" + filterStr)
        return props.categories.filter(cat => {
            let found = fuzzyMatch(cat.name, filterStr);
            if (!found && cat.tags) {
                let foundTags = cat.tags.filter(tag => tag.toLowerCase().includes(filterStr.toLowerCase()));
                found = foundTags.length > 0;
            }
            return found;
        });
    }

    return (
        <div className='tileContainer' theme={getThemeName(props.themeId)} style={{
            width: props.isMobile ? '110%' : '100%',
            transform: 'translateX(' + props.scroll.x + 'px)',
            flexDirection: 'column',
            transitionDuration: props.allowSwipe ? '0s' : '1.7s',

        }}>
            {!props.currentCategory && <Body InSearch={true}
                categories={
                    filterCategories(props.searchStr)
                }
                dimensions={props.dimensions}
                pubSub={props.pubSub}
                editMode={props.editMode}
                shareCart={props.shareCart}
                allowSwipe={props.allowSwipe}
                scroll={{ x: 0, y: 0 }}
                themeId={props.themeId}
            />}
            <Word InSearch={true}
                words={
                    filterWords(props.searchStr)
                }
                pubSub={props.pubSub}
                editMode={props.editMode}
                shareCart={props.shareCart}
                themeId={props.themeId}
                dimensions={props.dimensions}
                allowSwipe={props.allowSwipe}
                scroll={{ x: 0, y: 0 }}
                categoryId={props.currentCategory}
            />
        </div>
    )
}

export default Search;
