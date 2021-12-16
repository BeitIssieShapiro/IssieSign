import React from "react";
import '../css/App.css';
import Card2 from "../components/Card2";
import Video from "../containers/Video";

import { VideoToggle } from "../utils/Utils";
import { deleteWord, shareWord } from '../apis/file'
import IssieBase from '../IssieBase'
import { reloadAdditionals } from "../apis/catalog";
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


    toggleSelect = async (word, forceOff) => {
        if (!forceOff && (!word || word.type !== 'file')) return;

        if (forceOff || (this.state.selectedWord && this.state.selectedWord.id === word.id)) {
            //toggle off
            this.setState({ selectedWord: undefined });
            this.props.pubSub.publish({ command: "hide-all-buttons" });
        } else {

            this.setState({ selectedWord: word });
            if (this.props.pubSub) {
                if (this.props.allowAddWord) {
                    this.props.pubSub.publish({
                        command: "show-delete", callback: () => {
                            if (this.state.selectedWord) {
                                confirmAlert({
                                    title: translate("ConfirmTitleDeleteWord"),
                                    message: fTranslate("ConfirmDeleteWordMessage", this.state.selectedWord.name),
                                    buttons: [
                                        {
                                            label: translate("BtnYes"),
                                            onClick: () => {
                                                deleteWord(this.state.selectedWord.videoName).then(
                                                    //Success:
                                                    async () => {
                                                        await reloadAdditionals();
                                                        this.props.pubSub.publish({ command: "refresh" })
                                                        this.toggleSelect(null, true)
                                                        this.props.alert.success(translate("InfoDeleteSucceeded"));
                                                    },
                                                    //error
                                                    (e) => this.props.alert.error(translate("InfoDeleteFailed") + "\n" + e)
                                                );
                                            }
                                        },
                                        {
                                            label: translate("BtnCancel"),
                                            onClick: () => this.props.alert.info(translate("InfoDeleteCanceled"))
                                        }
                                    ]
                                });
                            }
                        }
                    });
                }


                this.props.pubSub.publish({
                    command: "show-share", callback: () => {
                        console.log("Share pressed");
                        if (this.state.selectedWord) {
                            this.props.pubSub.publish({ command: 'set-busy', active: true, text: translate("InfoSharingWords") });
                            shareWord(this.state.selectedWord).then(
                                //Success:
                                () => this.toggleSelect(null, true),
                                //error
                                (e) => this.props.alert.error(translate("InfoSharingFailed") + "\n" + e)

                            ).finally(() =>
                                this.props.pubSub.publish({ command: 'set-busy', active: false })
                            );
                        }
                    }
                });
            }
        }
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

                    onClick={(url) => {
                        this.setState({ selected: word.videoName });
                    }}
                    key={word.id} cardType={selectable ? "file" : "default"}
                    cardName={word.name}
                    videoName={word.videoName}
                    imageName={word.imageName} imageName2={word.imageName2}
                    themeId={themeId} longPressCallback={selectable ? () => this.toggleSelect(word) : undefined} selected={selected}
                    binder={true} />
            });



        }

        VideoToggle(this.state.selected, !IssieBase.isMobile(), IssieBase.isLandscape());

        return (
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'row', overflow: "auto"
            }}>
                <div style={{ width: window.innerWidth - 156 }}>
                    {this.state.selected &&
                        <Video
                            //categoryId={props.categoryId}
                            isLandscape={IssieBase.isLandscape()}
                            isMobile={IssieBase.isMobile()}
                            videoName={this.state.selected}
                            filePath={""}
                            adultMode={true}
                        /> ||
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                justifyContent:"center",
                                alignItems:"center",
                                fontSize: 45, color: "black"
                            }}
                        >לא נבחרה מילה</div>
                    }
                </div>
                <div style={{
                    flexDirection: 'col',
                    width: 155,

                }}>
                    {wordsElements.map(word => (
                        <div style={{ marginTop: 30, marginRight: 15 }}>
                            {word}
                        </div>
                    ))}
                </div>
            </div >
        )
    }
}

export default withAlert()(WordAdults);
