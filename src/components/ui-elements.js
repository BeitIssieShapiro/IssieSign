import React from 'react';
import '../css/ui-elements.css';
import { svgLocalCall } from "../apis/ImageLocalCall";
import { Edit, Add, Settings, ShoppingCart, Share, Delete, Logout, CloudSync } from '@mui/icons-material'
import { translate } from '../utils/lang';


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
    style.borderWidth = 4;
  };

  return <div {...props}
    onClick={props.onClick}
    style={style}>
    {props.children}
  </div>
}

export function EditButton(props) {
  return <HeaderButton slot={props.slot} selected={props.selected} className="b"
    onClick={props.onClick}>
    <Edit style={{ fontSize: 35 }} />
  </HeaderButton>
}

export function AddButton(props) {
  return <HeaderButton slot={props.slot} selected={props.selected} className="c"
    onClick={props.onClick}>
    <Add style={{ fontSize: 35 }} />
  </HeaderButton>
}

export function SettingsButton(props) {
  return <HeaderButton slot={props.slot} selected={props.selected} className="a"
    onClick={props.onClick}>
    <Settings style={{ fontSize: 35 }} />
  </HeaderButton>
}

export function ShareCartButton(props) {
  return <HeaderButton slot={props.slot} className="d"
    onClick={props.onClick}>
    <ShoppingCart style={{ fontSize: 35 }} />
    <div style={{ fontSize: 18, position: "absolute", left: 13, top: -13 }}>{props.count}</div>
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

export function RadioBtn(props) {
  return <div className={props.className}>
    <label className="form-switch">
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <i></i>
    </label>
  </div>
}

export function ButtonLogout(props) {
  return <div className="logout-button" onClick={props.onClick}><Logout/>{translate("BtnLogout")}</div>
}

export function ButtonReconsile(props) {
  return <div className="logout-button" onClick={props.onClick}><CloudSync/>{translate("BtnReconsile")}</div>
}

const TILEBUTTON_SIZE = 36;

export function TileButton(props) {

  const prevent = (evt) => evt.stopPropagation();
  const offSet = props.offSet || 0;
  return <div
    className="enable-pointer-events"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: 'absolute', right: -17 + (props.position * (TILEBUTTON_SIZE + 5)),
      bottom: -15 + offSet,
      borderRadius: 18, width: 36, height: 36,
      backgroundColor: 'gray',
      zIndex: 1000,
      ...props.style
    }}


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
