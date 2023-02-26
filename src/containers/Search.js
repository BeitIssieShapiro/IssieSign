import React, { useEffect } from "react";
import '../css/App.css';
import Word from "./Word";
import Body from "./Body";
//const levenshtein = require('js-levenshtein');
import { getTheme, getThemeName, trace } from "../utils/Utils";
import { fTranslate } from '../utils/lang';
import { Word2 } from "../components/ui-elements";


function fuzzyMatch(str, searchStr) {

    return str && searchStr ? 
        str.toLowerCase().includes(searchStr.toLowerCase()):// || searchStr.length > 3 && levenshtein(str, searchStr) <= 2;
        false;
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
        const res = [];
        props.words.forEach(word=>{
            let found = fuzzyMatch(word.name, filterStr);
            if (!found && word.tags) {
                let foundTags = word.tags.filter(tag => tag.startsWith(filterStr));
                found = foundTags.length > 0;
            }
            if (found && !res.find(w=>w.id === word.id)) {
                res.push({...word});
            };
        });
        

        return props.currentCategory ? res : res.map(word => {
            if (word.categoryId) {
                const category = props.categories.find(cat => cat.id == word.categoryId);
                if (category) {
                    word.themeId = category.themeId;
                    word.category = category.name;
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
        <div scroll-marker="1" className='scrollable tileContainer' theme={getThemeName(props.themeId)} style={{
            width: props.isMobile ? '110%' : '100%',
            transform: 'translateX(' + props.scroll?.x + 'px)',
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
            <Word2 InSearch={true}
                words={
                    filterWords(props.searchStr)
                }
                pubSub={props.pubSub}
                editMode={props.editMode}
                shareCart={props.shareCart}
                themeId={props.themeId}
                dimensions={props.dimensions}
                allowSwipe={props.allowSwipe}
                scroll={props.wordScroll}
                categoryId={props.currentCategory}
                adultMode={props.adultMode && props.currentCategory}
            />
        </div>
    )
}

export default Search;
