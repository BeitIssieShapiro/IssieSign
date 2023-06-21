import React, { useCallback, useState } from 'react';
import '../css/ui-elements.css';
import { svgLocalCall } from "../apis/ImageLocalCall";
import { Edit, Add, Settings, ShoppingCart, Share, Delete, Logout, CloudSync, ShoppingBag, ShoppingBasket, Menu, ShoppingBagOutlined, Folder, Movie, VideoCallOutlined } from '@mui/icons-material'
import { fTranslate, translate } from '../utils/lang';
import { ReactComponent as EditModeSVG } from '../images/edit-mode.svg'
import { ReactComponent as AddFolderSVG } from '../images/addFolder.svg'
import { ReactComponent as AddVideoSVG } from '../images/addVideo.svg'
import { ReactComponent as ShareBasketSVG } from '../images/shareBasket.svg'
import Word from '../containers/Word';
import WordAdults from "../containers/Word-adult";
import { isBrowser, isMobile } from '../utils/Utils';

import { ClipLoader } from 'react-spinners';
import { CircularProgressbar } from 'react-circular-progressbar';


export function TrashButton(props) {
  return <div className="trash-button" {...props}></div>
}

export function BackButton(props) {
  return <div className="back-button" {...props}></div>
}

export function PrevButton(props) {
  return <div className="prev-button" {...props}></div>
}

export function NextButton(props) {
  return <div className="next-button" {...props}></div>
}


export function ShareButton(props) {
  return <div className="share-button" {...props}
    style={props.selected ? { borderBottom: "white", borderBottomStyle: "solid", borderWidth: 4 } : {}}></div>
}

export function HeaderButton(props) {
  const style = {
    fontSize: 35,
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    position: "relative"
  };

  if (props.selected) {
    style.borderBottom = "white";
    style.borderBottomStyle = "solid";
    style.borderWidth = 3;
  };

  return <div {...props}
    onClick={props.onClick}
    onTouchStart={props.onTouchStart}
    //onPointerDown={props.onTouchStart}
    onTouchEnd={props.onTouchEnd}
    //onPointerUp={props.onTouchEnd}
    className={"noTouchCallout " + (props.className || "")}
    style={style}>
    {props.children}
  </div>
}

export function EditButton(props) {
  const [pressInterval, setPressInterval] = useState(undefined);
  const [waited, setWaited] = useState(0);

  return <HeaderButton slot={props.slot} className="a"
    // onClick={()=>{
    //   if (isBrowser()) {
    //     props.onChange(!props.selected);
    //   }
    // }}
    onTouchStart={(evt) => {

      evt.preventDefault()
      if (isBrowser() || isMobile()) {
        props.onChange(!props.selected);
        return;
      }
      console.log("edit-mode-touchStart")
      if (!props.selected && !pressInterval) {
        console.log("edit-mode-start-waiting")
        setWaited(0);
        setPressInterval(setInterval(() => {
          setWaited(curWaited => {
            if (curWaited >= 2) {
              props.onChange(true);
              setPressInterval(interval => {
                clearInterval(interval);
                return undefined;
              })
            }
            return curWaited + 1
          });

        }
          , 850))
      } else {
        props.onChange(false);
      }
    }}

    onTouchEnd={() => {
      console.log("edit-mode-touchEnd")
      setPressInterval(interval => {
        if (interval) {
          clearInterval(interval);
          return undefined;
        }
      })
    }}
  >
    <EditModeSVG style={{ width: 40, fillOpacity: props.selected ? 1 : 0 }} />
    {pressInterval && <div style={{ position: 'absolute', left: 40, top: 5, width: 200, fontSize: 22, textAlign: "start" }}>{fTranslate("EnterEditMode", 3 - waited)}</div>}
  </HeaderButton>
}

export function AddButton(props) {
  return <HeaderButton slot={props.slot} selected={props.selected} className="c"
    onClick={props.onClick}>
    {props.addFolder ? <AddFolderSVG style={{ width: 40 }} /> :
      <AddVideoSVG style={{ width: 40 }} />}
  </HeaderButton>
}

export function SettingsButton(props) {
  return <HeaderButton slot={props.slot} selected={props.selected} className="b"
    onClick={props.onClick}>
    <Menu style={{ fontSize: 40, minHeight: 40 }} />
  </HeaderButton>
}

export function ShareCartButton(props) {
  return <HeaderButton slot={props.slot} className="d"
    onClick={props.onClick}>
    {/* <ShoppingBagOutlined style={{ fontSize: 40, strokeWidth:0 }} /> */}
    <ShareBasketSVG style={{ width: 40 }} />
    {props.count > 0 && <div className="shareBadge">{props.count}</div>}
  </HeaderButton>
}

export function AttachButton(props) {
  return <div className="attach-button" onClick={props.onClick}></div>
}

export function CameraButton(props) {
  return <div className="camera-button" onClick={props.onClick}></div>
}

export function SearchWebButton(props) {
  //return <ImageSearch onClick={props.onClick}  style={{fontSize:45, paddingLeft:5, strokeWidth: 1}}/>
  return <div className="search-image-button" onClick={props.onClick}></div>
}

export function VideoButton(props) {
  return <div className="video-button" onClick={props.onClick}></div>
}

export function Selected(props) {
  return <div className="selected-icon"></div>
}

export function RadioBtn2(props) {
  return <div className={props.className}>
    <label className="form-switch">
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <i></i>
    </label>
  </div>
}

export function RadioBtn(props) {
  const on = props.onText || "on";
  const off = props.offText || "off";

  return <div className={"switch-container " + (props.className || "")} style={{ position: "relative" }}
    onClick={() => props.onChange(!props.checked)}
  >
    <div className={"switch-base-elipce " + (props.checked ? "switch-base-on" : "switch-base-off")} >
      {props.checked ? on : off}
    </div>
    <div className={"switch-elipce " + (props.checked ? "switch-on" : "switch-off")} />
  </div>
}


export function ButtonLogout(props) {
  return <div className="logout-button" onClick={props.onClick}><Logout />{translate("BtnLogout")}</div>
}

export function ButtonReconsile(props) {
  return <div className="sync-button" onClick={props.onClick}><CloudSync />{translate("BtnReconsile")}</div>
}

const TILEBUTTON_SIZE = 36;

export function TileButton(props) {

  const prevent = (evt) => evt.stopPropagation();
  const offSet = props.offSet || 0;
  return <div
    className="enable-pointer-events tile-button"



    onMouseDown={prevent}
    onMouseUp={prevent}

    onTouchStart={prevent}
    onTouchEnd={prevent}

    onClick={(evt) => {
      //console.log("tile button clicked")
      evt.preventDefault();
      props.onClick()
    }}
  >{props.children}</div>
}

export function Spacer(props) {
  return <div style={{ width: 5, height: 5, ...props }} />
}

export function AddToShareButton(props) {
  return <TileButton
    {...props}>
    <Share />
  </TileButton>
}

export function InfoButton(props) {
  return <TileButton
    {...props}>
    {/* <div style={{fontSize:20}}>i</div> */}
    <Edit />
  </TileButton>
}

export function RemoveFromShareButton(props) {
  return <TileButton
    {...props}>
    <Share />
    <div style={{ position: "absolute", left: 2, top: -4 }}>
      <Delete style={{ fontSize: 17 }} />
    </div>
  </TileButton>
}

export function DeleteTilebutton(props) {
  return <TileButton
    {...props}>

    <Delete />
  </TileButton>
}


export function Word2(props) {
  if (props.adultMode) {
    return <WordAdults {...props} />
  }
  return <Word  {...props} />;
}


const decorWidth = 35;
const decorations = [
  {
    style: {
      bottom: "0px",
    },
    src: svgLocalCall("pencils.svg")
  },
  {
    style: {
      bottom: "-8px",
    },
    src: svgLocalCall("cube.svg")
  },
  {
    style: {
      bottom: "0px",
    },
    src: svgLocalCall("globe.svg")
  }, {
    style: {
      bottom: "-8px",
    },
    src: svgLocalCall("clock.svg")
  }, {
    style: {
      bottom: "0px",
    },
    src: svgLocalCall("plant.svg")
  }, {
    style: {
      bottom: "0px",
    },
    src: svgLocalCall("speakers.svg")
  }, {
    style: {
      bottom: "-43px",
      zIndex: 5
    },
    src: svgLocalCall("sticker.svg")
  },
]

function getItem(index, left, maxWidth, lastSpot) {
  if (left > maxWidth || index < 0 || index >= decorations.length || left > lastSpot) return null;
  if (left > 0) {
    if (left === lastSpot) {
      left -= decorWidth + 5
    } else {
      left -= decorWidth / 2;
    }
  } else {
    left += 5;
  }
  let item = decorations[index];
  return <img
    key={index}
    alt=""
    src={item.src} style={{
      width: decorWidth + "px", height: "50px",
      position: "absolute", left: left + "px",
      ...item.style
    }} />
}

export function getDecoration(index, tileWidth, itemCount, maxWidth) {
  switch (index) {
    case 0:
      return [
        getItem(0, 2 * tileWidth, maxWidth, itemCount * tileWidth),
        getItem(6, 4 * tileWidth, maxWidth, itemCount * tileWidth),
        getItem(1, 7 * tileWidth, maxWidth, itemCount * tileWidth)];
    case 1:
      return [
        getItem(2, 3 * tileWidth, maxWidth, itemCount * tileWidth),
        getItem(3, 5 * tileWidth, maxWidth, itemCount * tileWidth)];
    case 2:
      return getItem(4, 1 * tileWidth, maxWidth, itemCount * tileWidth);
    case 3:
      return [
        getItem(5, 3 * tileWidth, maxWidth, itemCount * tileWidth)];
    case 4:
    default:
      return [
        getItem(1, 0 * tileWidth, maxWidth, itemCount * tileWidth)];
  }
}


export function BusyMsg({showProgress, progress, progressText, text}) {
  return <div className="busy-msg-host">
     <div className="busy-msg-progress">
      {showProgress ?
        <CircularProgressbar
          value={progress}
          text={progressText || ""}
          background={true}
          styles={{ fontSize: 15 }}
        />
        : <ClipLoader
          sizeUnit={"px"}
          size={150}
          color={'#123abc'}
          loading={true}
        />}
    </div>
    {<div className="busy-msg-text" >{text || translate("Working")}</div>}

  </div>
}