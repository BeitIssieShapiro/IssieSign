import { useEffect } from "react";
import ISLink from "../components/ISLink";
import { imageLocalCall } from "../apis/ImageLocalCall";
import { translate } from "../utils/lang";

import "../css/word-list.css";

export function WordList(props) {
    useEffect(() => {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
        }
    }, [props.pubSub, props.categoryId]);

    // let wordsElements = [];
    // let elementWidths = [];
    // if (Array.isArray(props.words)) {
    //     wordsElements = props.words.map((word) => {
    //         //let selected = state.selectedWord && state.selectedWord.id === word.id;
    //         const themeId = word.themeId || props.themeId;


    //         return <Card2 key={word.id}
    //             name={word.name}
    //             symLink={word.favorite || word.symLink}
    //             onFavoriteToggle={props.onFavoriteToggle}
    //             editMode={props.editMode}
    //             translate={word.translate}
    //             categoryId={props.categoryId}
    //             originalCategoryId={word.category}
    //             pubSub={props.pubSub}
    //             shareCart={props.shareCart}
    //             userContent={word.userContent}
    //             cardType={word.userContent ? "file" : "default"} cardName={word.name} videoName={word.videoName}
    //             imageName={word.imageName} imageName2={word.imageName2}
    //             themeId={themeId}
    //             //longPressCallback={word.userContent ? () => props.pubSub.publish({ command: "edit-mode" }) : undefined} 
    //             //selected={selected}
    //             clipType={getBooleanFromString(word.name) ? ClipType.Binder : ClipType.Clip} />
    //     });


    //     //calculate the average width, while considering double images
    //     elementWidths = props.words.map((word) => {
    //         return 230; //word.imageName2 ? 300 : 220;
    //     });
    // }

    // let width = 0;
    // if (elementWidths.length > 0) {
    //     let widthSum = elementWidths.reduce(function (a, b) { return a + b; });
    //     let tileW = widthSum / elementWidths.length;

    //     //calculate best width:
    //     let tileH = 192;

    //     width = calcWidth(wordsElements.length, window.innerHeight,
    //         window.innerWidth, tileH, tileW, props.isMobile, props.InSearch !== undefined);
    // }
    // // if (state.words.find(f => f.imageName2)) {
    // //     width += 100; //for double image icons
    // // }

    // width = Math.max(width, window.innerWidth);
    // let linesWidth = width;
    // if (props.InSearch) {
    //     if (window.innerWidth > 500) {
    //         width = '100%';
    //     } else {
    //         //width = '500px';
    //         width += 'px';
    //         //linesWidth = 500;
    //     }
    // } else {
    //     width += 'px';
    // }
    // //build array of lines:
    // let lineWidth = -1;
    // let curLine = -1;
    // let lines = [];

    // for (let i = 0; i < wordsElements.length; i++) {
    //     let card = wordsElements[i];
    //     lineWidth += (card.imageName2 ? 300 : 200);
    //     if (curLine < 0 || lineWidth > linesWidth) {
    //         curLine++;
    //         lines.push([]);
    //         lineWidth = card.imageName2 ? 300 : 200;
    //     }
    //     lines[curLine].push(card);
    // }


    return (
        <div scroll-marker="1" className={props.InSearch ? "subTileContainer wordContainer" : "scrollable tileContainer wordContainer"}
            style={{
                flexDirection: 'column',
                width: "100%",
                transform: `translateX(${props.scroll?.x || 0}px) translateY(${props.scroll?.y || 0}px)`,
                transitionDuration: props.allowSwipe ? '0s' : '1.7s',

            }}>
            {props.words.map(word => {
                let imageSrc = word.imageName ? imageLocalCall(word.imageName, word.userContent) : undefined;
                const cardType = word.userContent ? "file" : "default";
                let translatedName = word.translate ? translate(word.name) : word.name;
                // let image2 = props.imageName2 ? <img className="tileImg img2" src={imageLocalCall(props.imageName2, props.userContent)} alt="card Placeholder"></img> : "";
                // let cardDouble = isMyIssieSign() ? { paddingRight: 10, paddingLeft: 10 } : { paddingRight: 5, paddingLeft: 5, paddingTop: 5, '--card-width': '165px' };
                let url = "";
                if (cardType === "file") {
                    url = "/video/file/" + word.category + "/" + encodeURIComponent(translatedName) + "/" + encodeURIComponent(word.videoName);
                } else {
                    url = "/video/" + encodeURIComponent(word.videoName) + "/" + word.category + "/" + encodeURIComponent(translatedName) + "/-";
                }

                return <ISLink url={url} className="word-list-item">
                        <div className="word-list-item-img"><img src={imageSrc} /></div>
                        <div className="word-list-item-text">{translatedName}</div>
                    </ISLink>

            })
            }
        </div >
    )

}
