import React from "react";
import "../css/box.css";
import "../css/shelf.css";
import "../css/Tile.css";
import '../css/App.css';
import { confirmAlert } from 'react-confirm-alert';
import { withAlert } from 'react-alert'

import { AddToShareButton, DeleteTilebutton, InfoButton, RemoveFromShareButton, Selected, TileButton } from "./ui-elements";
import { imageLocalCall } from "../apis/ImageLocalCall";
import ISLink from "./ISLink";

import { fTranslate, isRTL, translate } from '../utils/lang';
import FileSystem from "../apis/filesystem";
import { Delete, Edit, MoreHoriz, Share } from "@mui/icons-material";


function Tile2(props) {

    let imageSrc = props.imageName ? imageLocalCall(props.imageName, props.userContent) : undefined;

    const addToShare = () => {
        if (!props.shareCart) return;

        if (props.shareCart?.exists(props.tileName)) {
            props.shareCart.remove(props.tileName);
            props.alert.success(translate("ItemRemovedFromShare"));
        } else {
            props.shareCart.add({
                name: props.tileName,
                image: imageSrc,
            })
            props.alert.success(translate("ItemAddedToShare"));
        }
        props.pubSub.refresh()
    }

    const showCategoryInfo = () => {
        console.log("info", props.tileName)
        props.pubSub.publish({ command: 'show-entity-info', name: props.tileName });
        //props.history.push("/add-category");
    }

    const deleteCategory = () => {
        confirmAlert({
            title: translate("ConfirmTitleDeleteCategory"),
            message: fTranslate("ConfirmDeleteCategoryMessage", props.tileName),
            buttons: [
                {
                    label: translate("BtnYes"),
                    onClick: () => FileSystem.get().deleteCategory(props.tileName).then(
                        () => {
                            props.pubSub.refresh();
                            props.alert.success(translate("InfoDeleteSucceeded"));
                        },
                        //error
                        (e) => props.alert.error(translate("InfoDeleteFailed") + "\n" + e)
                    )
                },
                {
                    label: translate("BtnCancel"),
                    onClick: () => props.alert.info(translate("InfoDeleteCanceled"))
                }
            ]
        });
    }
    const isShared = props.editMode && props.userContent && props.shareCart?.exists(props.tileName);
    let body = <div >
        <div className="tileBox boxhost" theme="blue" theme-flavor={props.themeId}
            style={{
                width: props.dimensions.boxWidth
            }}>
            <div className="box">
                <header>
                    <span></span>
                    <div></div>
                </header>
                <main>
                    <div style={{ width: props.dimensions.imageBoxWidth }} >
                        {imageSrc ? <img className="tileImg" src={imageSrc} alt={translate("MissingImageAlt")} /> : null}
                        {props.selected ? <div style={{ display: 'flex', position: 'absolute', right: -17, bottom: -25, zIndex: 5 }}><Selected /></div> : null}
                    </div>

                    {/* {props.editMode && props.userContent && <div className="tileEditButtons">

                        {isShared ?
                            <RemoveFromShareButton onClick={addToShare} position={0} offSet={10} />
                            : <AddToShareButton onClick={addToShare} position={0} offSet={10} />}

                        <DeleteTilebutton onClick={deleteCategory} position={1} offSet={10} />

                        <InfoButton onClick={showCategoryInfo} position={2} offSet={10} />
                    </div>} */}
                </main>

            </div>
            <div className="tileText"  >
                {props.translate?translate(props.tileName): props.tileName}
                {props.editMode && !props.noMoreMenu && props.userContent && <div className={"moreButton "+ (isRTL()?"moreButtonX-rtl":"moreButtonX")}>
                    <TileButton size={24} onClick={() => {
                        props.pubSub.publish({
                            command: "open-slideup-menu", props: {
                                label: props.tileName,
                                image: imageSrc,
                                themeId: props.themeId,
                                type: "tile",

                                buttons: [
                                    { caption: translate("EditMenu"), icon: <Edit />, callback: showCategoryInfo },
                                    {
                                        caption: isShared ?
                                            translate("RemoveFromShareMenu") :
                                            translate("AddToShareMenu"), icon: <Share />, callback: addToShare
                                    }, //todo unshare icon
                                    { caption: translate("DeleteMenu"), icon: <Delete />, callback: deleteCategory }
                                ]
                            }
                        });
                    }}
                    >
                        <MoreHoriz style={{fontSize:35, color: "#493A25"}}/>
                    </TileButton>
                </div>} 
            </div>

        </div>
    </div>



    return (
        <ISLink
            onLongPress={props.onLongPress}
            url={props.selected ? "" : props.tileUrl}
            style={{ width: props.dimensions.tileGroupWidth }}
        >


            {body}
        </ISLink>

    );
}
export default withAlert()(Tile2);
