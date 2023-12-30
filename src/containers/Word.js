import React, { useEffect, useState } from "react";
import '../css/App.css';
import Card2, { ClipType } from "../components/Card2";
import { calcWidth, getBooleanFromString } from "../utils/Utils";
import { withAlert } from 'react-alert'
import Rope from '../components/Rope'
import 'react-confirm-alert/src/react-confirm-alert.css';


function Word(props) {
    useEffect(() => {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
        }
    }, [props.pubSub, props.categoryId]);

    let wordsElements = [];
    let elementWidths = [];
    if (Array.isArray(props.words)) {
        wordsElements = props.words.map((word) => {
            //let selected = state.selectedWord && state.selectedWord.id === word.id;
            const themeId = word.themeId || props.themeId;


            return <Card2 key={word.id}
                name={word.name}
                symLink={word.favorite || word.symLink}
                onFavoriteToggle={props.onFavoriteToggle}
                editMode={props.editMode}
                translate={word.translate}
                categoryId={props.categoryId}
                originalCategoryId={word.category}
                pubSub={props.pubSub}
                shareCart={props.shareCart}
                userContent={word.userContent}
                cardType={word.userContent ? "file" : "default"} cardName={word.name} videoName={word.videoName}
                imageName={word.imageName} imageName2={word.imageName2}
                themeId={themeId}
                //longPressCallback={word.userContent ? () => props.pubSub.publish({ command: "edit-mode" }) : undefined} 
                //selected={selected}
                clipType={getBooleanFromString(word.name) ? ClipType.Binder : ClipType.Clip} />
        });


        //calculate the average width, while considering double images
        elementWidths = props.words.map((word) => {
            return 230; //word.imageName2 ? 300 : 220;
        });
    }

    let width = 0;
    if (elementWidths.length > 0) {
        let widthSum = elementWidths.reduce(function (a, b) { return a + b; });
        let tileW = widthSum / elementWidths.length;

        //calculate best width:
        let tileH = 192;

        width = calcWidth(wordsElements.length, window.innerHeight,
            window.innerWidth, tileH, tileW, props.isMobile, props.InSearch !== undefined);
    }
    // if (state.words.find(f => f.imageName2)) {
    //     width += 100; //for double image icons
    // }

    width = Math.max(width, window.innerWidth);
    let linesWidth = width;
    if (props.InSearch) {
        if (window.innerWidth > 500) {
            width = '100%';
        } else {
            //width = '500px';
            width += 'px';
            //linesWidth = 500;
        }
    } else {
        width += 'px';
    }
    //build array of lines:
    let lineWidth = -1;
    let curLine = -1;
    let lines = [];

    for (let i = 0; i < wordsElements.length; i++) {
        let card = wordsElements[i];
        lineWidth += (card.imageName2 ? 300 : 200);
        if (curLine < 0 || lineWidth > linesWidth) {
            curLine++;
            lines.push([]);
            lineWidth = card.imageName2 ? 300 : 200;
        }
        lines[curLine].push(card);
    }


    return (
        <div scroll-marker="1" className={props.InSearch ? "subTileContainer wordContainer" : "scrollable tileContainer wordContainer"}
            style={{
                flexDirection: 'column',
                width: width,
                transform: `translateX(${props.scroll?.x || 0}px) translateY(${props.scroll?.y || 0}px)`,
                transitionDuration: props.allowSwipe ? '0s' : '1.7s',

            }}>
            {lines.map((line, i) => {

                return <Rope size={line.length} key={i}>
                    {line}
                </Rope>
            })}
        </div>
    )

}

export default withAlert()(Word);
