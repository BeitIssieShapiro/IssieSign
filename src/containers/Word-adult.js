import React from "react";
import '../css/App.css';
import Card2, { ClipType } from "../components/Card2";
import Video from "../containers/Video";

import IssieBase from '../IssieBase'
import { withAlert } from 'react-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { translate } from "../utils/lang";


class WordAdults extends IssieBase {

    static getDerivedStateFromProps(props, state) {
        if (props.pubSub && props.categoryId) {
            props.pubSub.publish({ command: "set-categoryId", categoryId: props.categoryId });
            props.pubSub.publish({ command: "set-themeId", themeId: props.themeId });
        }

        return null;
    }

    render() {

        let wordsElements = [];
        let themeId = this.props.themeId;
        if (Array.isArray(this.props.words)) {
            wordsElements = this.props.words.map((word) => {

                return <Card2
                    editMode={this.props.editMode}
                    categoryId={this.props.categoryId || word.category}
                    pubSub={this.props.pubSub}
                    shareCart={this.props.shareCart}
                    userContent={word.userContent}
                    cardType={word.userContent ? "file" : "default"}
                    onClick={(url) => {
                        this.setState({ selected: word });
                        this.props.pubSub.publish({command:"set-current-word", categoryId: this.props.categoryId, title: word.name, isFavorite:word.isFavorite});
                    }}
                    key={word.id}
                    cardName={word.name}
                    videoName={word.videoName}
                    imageName={word.imageName} imageName2={word.imageName2}
                    themeId={themeId}
                    clipType={ClipType.None} />
            });
        }

        return (
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'row', overflow: "auto"
            }}>
                <div style={{ width: window.innerWidth - 156, position:"relative" }}>
                    {this.state.selected ?
                        <Video
                            isLandscape={IssieBase.isLandscape()}
                            isMobile={IssieBase.isMobile()}
                            videoName={this.state.selected?.userContent ? "file" : this.state.selected?.videoName}
                            filePath={this.state.selected?.userContent ? this.state.selected?.videoName : ""}
                            maxWidth={window.innerWidth - 156}
                        /> :
                        wordsElements.length && <div
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
                    display: "flex",
                    flexDirection: 'column',
                    alignItems:"center",
                    justifyContent: "flex-start",
                    width: 155,
                    transform: `translateY(${this.props.scroll?.y || 0}px)`,
                    transitionDuration: '0s',
                    borderLeft: wordsElements.length ? "solid gray 1px" : "",
                }}>
                    {wordsElements.map((word, i) => (
                        <div key={i} style={{ marginTop: 30 }}>
                            {word}
                        </div>
                    ))}
                </div>
            </div >
        )
    }
}

export default withAlert()(WordAdults);
