import React from "react";
import '../css/App.css';
import Card2 from "../components/Card2";
import Video from "../containers/Video";

import { VideoToggle } from "../utils/Utils";
//import { deleteWord, shareWord } from '../apis/file'
import IssieBase from '../IssieBase'
//import { reloadAdditionals } from "../apis/catalog";
import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { translate, fTranslate } from "../utils/lang";


class WordAdults extends IssieBase {

    static getDerivedStateFromProps(props, state) {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            console.log("set-catId " + props.categoryId)
        }

        return null;
    }

    render() {

        let wordsElements = [];
        let themeId = this.props.categoryId4Theme;
        if (Array.isArray(this.props.words)) {
            wordsElements = this.props.words.map((word) => {
                let selected = this.state.selectedWord && this.state.selectedWord.id === word.id;
                if (word.categoryId) {
                    themeId = word.categoryId;
                }
                let selectable = word.type === "file"
                return <Card2
                    editMode={this.props.editMode}
                    categoty={word.category}
                    pubSub={this.props.pubSub}
                    shareCart={this.props.shareCart}
                    userContent={word.userContent}
                    cardType={word.userContent ? "file" : "default"}
                    onClick={(url) => {
                        this.setState({ selected: word });
                        VideoToggle(true, !IssieBase.isMobile(), IssieBase.isLandscape());
                    }}
                    key={word.id}
                    cardName={word.name}
                    videoName={word.videoName}
                    imageName={word.imageName} imageName2={word.imageName2}
                    themeId={themeId}
                    //longPressCallback={selectable ? () => this.toggleSelect(word) : undefined} 
                    selected={selected}
                    binder={true} />
            });
        }

        return (
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'row', overflow: "auto"
            }}>
                <div style={{ width: window.innerWidth - 156 }}>
                    {this.state.selected ?
                        <Video
                            //categoryId={props.categoryId}
                            isLandscape={IssieBase.isLandscape()}
                            isMobile={IssieBase.isMobile()}
                            videoName={this.state.selected?.userContent?"file":this.state.selected?.videoName}
                            filePath={this.state.selected?.userContent ? this.state.selected?.videoName:""}
                            adultMode={true}
                        /> :
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 45, color: "black"
                            }}
                        >{translate("NoWordSelected")}</div>
                    }
                </div>
                <div style={{
                    flexDirection: 'col',
                    width: 155,
                    transform: `translateY(${this.props.scroll?.y || 0}px)`,
                    transitionDuration: '0s'
                }}>
                    {wordsElements.map((word, i) => (
                        <div key={i} style={{ marginTop: 30, marginRight: 15 }}>
                            {word}
                        </div>
                    ))}
                </div>
            </div >
        )
    }
}

export default withAlert()(WordAdults);
