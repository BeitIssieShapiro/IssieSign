import React from 'react';
import '../css/ui-elements.css';
import { svgLocalCall } from "../apis/ImageLocalCall";

export function PlusButton(props) {
  const styles = {
    container: {
      marginTop: 3,
      marginLeft: 10,
      height: '32px',
      width: '32px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '4px',
      paddingLeft: '25px'
    },
    line: {
      height: '3px',
      width: '18px',
    },
    vertical: {
      transform: 'translate(0,-3px) rotate(90deg)',
    }
  }
  return (
    <div style={styles.container} onClick={props.onClick}>
      <div style={{ ...styles.line, background: props.color }} />
      <div style={{ ...styles.line, ...styles.vertical, background: props.color }} />
    </div>);

}

export function SettingsButton(props) {
  return <div className="settings-button" onClick={props.onClick}></div>
}

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
  return <div className="share-button" {...props}></div>
}

export function AttachButton(props) {
  return <div className="attach-button" onClick={props.onClick}></div>
}

export function CameraButton(props) {
  return <div className="camera-button" onClick={props.onClick}></div>
}

export function VideoButton(props) {
  return <div className="video-button" onClick={props.onClick}></div>
}

export function Selected(props) {
  return <div className="selected-icon"></div>
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
      zIndex:5
    },
    src: svgLocalCall("sticker.svg")
  },
]

function getItem(index, left, maxWidth, lastSpot) {
  if (left > maxWidth || index < 0 || index >= decorations.length) return null;
  if (left > 0) {
    if (left == lastSpot) {
      left -= decorWidth+5
    } else {
      left -= decorWidth/2;
    }
  } else {
    left += 5;
  }
  let item = decorations[index];
  return <img src={item.src} style={{
    width: decorWidth+"px", height: "50px",
    position: "absolute", left:  left + "px",
    ...item.style
  }} />
}

export function getDecoration(index, tileWidth, itemCount, maxWidth) {
  switch (index) {
    case 0:
      return [
        getItem(0, 2 * tileWidth, maxWidth, itemCount*tileWidth),
        getItem(6, 4 * tileWidth, maxWidth, itemCount*tileWidth),
        getItem(1, 7 * tileWidth, maxWidth, itemCount*tileWidth)];
    case 1:
      return [
        getItem(2, 3 * tileWidth, maxWidth, itemCount*tileWidth),
        getItem(3, 5 * tileWidth, maxWidth, itemCount*tileWidth)];
    case 2:
      return getItem(4, 1 * tileWidth, maxWidth, itemCount*tileWidth);
    case 3:
      return [
        getItem(5, 3 * tileWidth, maxWidth, itemCount*tileWidth)];
    case 4:
      return [
        getItem(1, 0 * tileWidth, maxWidth, itemCount*tileWidth)];
  }
  return null;
}
