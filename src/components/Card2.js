import React, { useState } from "react";
import "../css/card.css";
import "../css/Tile.css";
import "../css/rope.css";
import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert';

import { imageLocalCall } from "../apis/ImageLocalCall";
import { getTheme, getThemeName, isMyIssieSign, trace } from "../utils/Utils";
import { AddToShareButton, DeleteTilebutton, InfoButton, RemoveFromShareButton, Selected, TileButton } from "./ui-elements";
import ISLink from "./ISLink";
import { fTranslate, translate } from "../utils/lang";
import FileSystem from "../apis/filesystem";
import { Delete, Edit, Favorite, MoreHoriz, PlaylistAdd, PlaylistRemove, Share } from "@mui/icons-material";

export const ClipType = {
    Clip: "clip",
    Binder: "binder",
    None: "none",
}

function Card2(props) {

    const originalCategoryId = props.originalCategoryId || props.categoryId;

    const reload = () => props.pubSub.refresh();
    let imageSrc = props.imageName ? imageLocalCall(props.imageName, props.userContent) : undefined;

    let image2 = props.imageName2 ? <img className="tileImg img2" src={imageLocalCall(props.imageName2, props.userContent)} alt="card Placeholder"></img> : "";
    let cardDouble = isMyIssieSign() ? { paddingRight: 10, paddingLeft: 10 } : { paddingRight: 5, paddingLeft: 5, paddingTop: 5, '--card-width': '165px' };
    let url = "";
    if (!props.noLink && !props.selected) {
        if (props.cardType === "file") {
            url = "/video/file/" + originalCategoryId + "/" + encodeURIComponent(props.cardName) + "/" + encodeURIComponent(props.videoName);
        } else {
            url = "/video/" + encodeURIComponent(props.videoName) + "/" + originalCategoryId + "/" + encodeURIComponent(props.cardName) + "/-";
        }
    }

    const sharedName = originalCategoryId + "/" + props.cardName;
    const isShared = props.editMode && props.userContent && props.shareCart?.exists(sharedName);

    const addToShare = () => {
        if (!props.shareCart) return;

        if (props.shareCart?.exists(sharedName)) {
            props.shareCart.remove(sharedName);
            props.alert.success(translate("ItemRemovedFromShare"));
        } else {
            props.shareCart.add({
                name: sharedName,
                image: props.imageName,
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
                        FileSystem.get().deleteWord(originalCategoryId, props.cardName).then(
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

    const addToFavorites = () => {
        trace("addToFavorites");
        props?.onFavoriteToggle(originalCategoryId, props.name, true)
    }
    const removeFromFavorite = () => {
        trace("removeFromFavorite");
        props?.onFavoriteToggle(originalCategoryId, props.name, false)
    }
    const removeFromThisCategory = () => {
        trace("removeFromThisCategory");
        props?.onFavoriteToggle(originalCategoryId, props.name, false, props.categoryId);
    }
    const addToAnotherCategory = () => {
        trace("addToAnotherCategory");
        setTimeout(() => props.pubSub.publish({
            command: "open-slideup-menu", props: {
                label: translate("CategoriesTitle"),
                type: "categories",
                omitCategories: [props.categoryId, originalCategoryId],
                callback: (selectedCategoryId) => {
                    // add to this category
                    trace("addToAnotherCategory", selectedCategoryId);
                    props?.onFavoriteToggle(originalCategoryId, props.name, true, selectedCategoryId);
                }
            }
        }), 100);
    }
    const onWordMenu = () => {
        const buttons = props.userContent ?
            [
                { caption: translate("EditMenu"), icon: <Edit />, callback: showWordInfo },
                {
                    caption: isShared ?
                        translate("RemoveFromShareMenu") :
                        translate("AddToShareMenu"), icon: <Share />, callback: addToShare
                }, //todo unshare icon
                { caption: translate("DeleteMenu"), icon: <Delete />, callback: deleteWord }
            ] :
            [];

        trace("card menu", JSON.stringify(props))
        if (props.categoryId === FileSystem.FAVORITES_NAME) {
            buttons.push({ caption: translate("RemoveFromFavorite"), icon: <Favorite />, callback: removeFromFavorite })
        } else {
            buttons.push({ caption: translate("AddToFavorite"), icon: <Favorite />, callback: addToFavorites })
        }
        if (props.symLink) {
            buttons.push({ caption: translate("RemoveFromThisCategory"), icon: <PlaylistRemove />, callback: removeFromThisCategory })
        } else {
            buttons.push({ caption: translate("AddToAnotherCategory"), icon: <PlaylistAdd />, callback: addToAnotherCategory })
        }

        props.pubSub.publish({
            command: "open-slideup-menu", props: {
                height: buttons.length * 70 + 200,
                label: translatedName,
                image: imageSrc,
                type: "card",
                buttons
            }
        });
    }


    let translatedName = props.translate ? translate(props.cardName) : props.cardName;

    if (props.asListItem) {
        return <ISLink url={url} className="word-list-item">
            <div className="word-list-item-img"><img src={imageSrc} /></div>
            <div className="word-list-item-text">{translatedName}</div>
            <div style={{ color: "black" }}>{
                props.editMode && <TileButton size={24} onClick={onWordMenu}>
                    <MoreHoriz style={{ fontSize: 35, color: 'black' }} />
                </TileButton>
            }
            </div>
        </ISLink>
    }



    let innerBody = (
        <div className="card" style={cardDouble} theme={getThemeName(props.themeId)}>
            <div className={"header " + (props.clipType)
            }></div>
            <div className="main">
                {image2}
                {imageSrc ? <img className={"tileImg " + (props.imageName2 ? "img1" : "imgSingle")} src={imageSrc} alt="card Placeholder"></img> : null}
            </div>
            <div className="footer">
                <h2 className="rtl tileFont">{translatedName}</h2>
                {props.editMode && !props.noMoreMenu && //props.userContent &&
                    <TileButton size={24} onClick={onWordMenu}>
                        <MoreHoriz style={{ fontSize: 35, color: 'white' }} />
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
