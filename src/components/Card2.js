import React from "react";
import "../css/card.css";
import "../css/Tile.css";
import "../css/rope.css";
import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert';

import { imageLocalCall } from "../apis/ImageLocalCall";
import { getTheme, getThemeName, isMyIssieSign } from "../utils/Utils";
import { AddToShareButton, DeleteTilebutton, InfoButton, RemoveFromShareButton, Selected, TileButton } from "./ui-elements";
import ISLink from "./ISLink";
import { fTranslate, translate } from "../utils/lang";
import FileSystem from "../apis/filesystem";
import { Delete, Edit, MoreHoriz, Share } from "@mui/icons-material";

export const ClipType = {
    Clip: "clip",
    Binder: "binder",
    None:"none",
}

function Card2(props) {
    const reload = () => props.pubSub.refresh();
    let imageSrc = props.imageName ? imageLocalCall(props.imageName, props.userContent) : undefined;

    let image2 = props.imageName2 ? <img className="tileImg" src={imageLocalCall(props.imageName2, props.userContent)} alt="card Placeholder"></img> : "";
    let cardDouble = isMyIssieSign() ? {paddingRight: 10, paddingLeft:10} : {paddingRight: 35, paddingLeft:35, '--card-width': '165px'};
    let url = "";
    if (!props.noLink && !props.selected) {
        if (props.cardType === "file") {
            url = "/video/file/" + props.categoryId + "/" + encodeURIComponent(props.cardName) + "/" + encodeURIComponent(props.videoName);
        } else {
            url = "/video/" + encodeURIComponent(props.videoName) + "/" + props.categoryId + "/" + encodeURIComponent(props.cardName) + "/-";
        }
    }

    const sharedName = props.categoryId + "/" + props.cardName;
    const isShared = props.editMode && props.userContent && props.shareCart?.exists(sharedName);

    const addToShare = () => {
        if (!props.shareCart) return;

        if (props.shareCart?.exists(sharedName)) {
            props.shareCart.remove(sharedName);
            props.alert.success(translate("ItemRemovedFromShare"));
        } else {
            props.shareCart.add({
                name: sharedName,
                image: imageSrc,
            })
            props.alert.success(translate("ItemAddedToShare"));
        }
        reload();
    }

    const showWordInfo = () => {
        props.pubSub.publish({ command: 'show-entity-info', name: sharedName });
    }

    const deleteWord = () => {
        confirmAlert({
            title: translate("ConfirmTitleDeleteWord"),
            message: fTranslate("ConfirmDeleteWordMessage", props.cardName),
            buttons: [
                {
                    label: translate("BtnYes"),
                    onClick: () => {
                        FileSystem.get().deleteWord(props.categoryId, props.cardName).then(
                            () => {
                                props.pubSub.refresh();
                                if (isShared) {
                                    props.shareCart.remove(sharedName);
                                }
                                props.alert.success(translate("InfoDeleteSucceeded"));
                            },
                            //error
                            (e) => props.alert.error(translate("InfoDeleteFailed") + "\n" + e)
                        )
                    }
                },
                {
                    label: translate("BtnCancel"),
                    onClick: () => props.alert.info(translate("InfoDeleteCanceled"))
                }
            ]
        });
    }

    let translatedName = props.translate?translate(props.cardName): props.cardName;

    let innerBody = (
        <div className="card" style={cardDouble} theme={getThemeName(props.themeId)}>
            <div className={"header " + (props.clipType)
        }></div>
            <div className="main">
                {image2}
                {imageSrc ? <img className="tileImg" src={imageSrc} alt="card Placeholder"></img> : null}
            </div>
            <div className="footer">
                <h2 className="rtl tileFont">{translatedName}</h2>
                {props.editMode && !props.noMoreMenu && props.userContent &&
                    <TileButton size={24} onClick={() => {
                        props.pubSub.publish({
                            command: "open-slideup-menu", props: {
                                label: translatedName,
                                image: imageSrc,
                                type: "card",
                                //todo translate
                                buttons: [
                                    { caption: translate("EditMenu"), icon: <Edit />, callback: showWordInfo },
                                    {
                                        caption: isShared ?
                                            translate("RemoveFromShareMenu") :
                                            translate("AddToShareMenu"), icon: <Share />, callback: addToShare
                                    }, //todo unshare icon
                                    { caption: translate("DeleteMenu"), icon: <Delete />, callback: deleteWord }
                                ]
                            }
                        });
                    }}
                    >
                        <MoreHoriz style={{fontSize:35, color:'white'}}/>
                    </TileButton>
                }
            </div>
            {/* {props.selected ? <div style={{ display: 'flex', position: 'absolute', right: -17, bottom: -10, zIndex: 0 }}><Selected /></div> : null} */}
            {/* {props.editMode && props.userContent && <div className="cardEditButtons">
                {isShared ? <RemoveFromShareButton onClick={addToShare} position={0} />
                    : <AddToShareButton onClick={addToShare} position={0} />}
                <InfoButton onClick={showWordInfo} position={2} />

                <DeleteTilebutton onClick={deleteWord} position={1} />
            </div>
            } */}

        </div>)
    let body =
        <div className="rope-container">
            {innerBody}
        </div>
    return (
        <React.Fragment>
            <ISLink
                onLongPress={props.longPressCallback}
                onClick={props.onClick}
                url={url}
            >
                {body}
            </ISLink>
        </React.Fragment>


    );
}

export default withAlert()(Card2);
