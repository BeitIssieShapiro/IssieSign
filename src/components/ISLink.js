import React from "react";
import "../css/card.css";
import "../css/Tile.css";

import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router";

function trace(a, ...optionalParams) {
  console.log(a, ...optionalParams);
}

// safely handles circular references
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      key === "_targetInst" || key === "target" || key === "currentTarget" || key === "view" ? undefined : typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : typeof value === 'function' ? "f:" + value.toString() : value,
    indent
  );
  cache = null;
  return retVal;
};


// onLongPress
//sync state
let xy = { x: 0, y: 0 }
const setXY = (obj) => xy = obj;

export default function ISLink(props) {
  const navigate = useNavigate();
  let location = useLocation();

  let lpDelay = props.longPressDelay ? props.longPressDelay : 500;
  const handleNavigate = useCallback(() =>{
    trace("navigate to", props.url)
    trace(props.onClick == undefined?"no click":"click")

    if (props.url)
      if (props.onClick) {
        props.onClick(props.url);
      } else {
        navigate(location.pathname + "#" + props.url)
      }
  }, [props.onClick, props.url]);

  const [startLongPress, setStartLongPress] = useState(false);
  const [startEvent, setStartEvent] = useState(undefined);
  const [callBackTriggered, setCallBackTriggered] = useState(false);
  const [moved, setMoved] = useState(false);
  //const [xy, setXY] = useState({ x: 0, y: 0 })

  console.log("render ISLink", props.onClick == undefined?"no click":"click")
  useEffect(() => {
    let timerId;
    if (startLongPress) {
      setCallBackTriggered(false);
      timerId = setTimeout(() => {
        trace("long-press detected");
        setCallBackTriggered(true);
        if (moved) {
          trace("moved - longpress ignored")
          return;
        }

        if (startEvent) {
          try {
            startEvent.preventDefault();
            //startEvent.stopPropagation();
            trace("Prevent default on press")
          } catch (e) { }
        }
        //calling the onLongPress callback
        if (props.onLongPress)
          props.onLongPress();

        setStartLongPress(false);
      }, lpDelay);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, lpDelay, moved]); 

  const move = useCallback((e) => {
    setMoved(true);
    trace("moved detected")
  }, []);

  const start = useCallback((e) => {
    trace("touch started")
    let event = unify(e)
    setMoved(false);
    try {
      trace("started at", event.clientX, event.clientY)
      setXY({ x: event.clientX, y: event.clientY });

    } catch (err) { }
    setStartLongPress(true);
    setStartEvent(e);
  }, []);

  const unify = (e) => {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  const stop = useCallback((e) => {
    //e.persist()
    let event = unify(e);
    let didMove = false;
    try {
      //trace(JSON.safeStringify(e))
      //trace("changedTouches", JSON.stringify(event))
      //trace(JSON.safeStringify(event.nativeEvent))
      if (event.clientX !== undefined) {
        trace("clientX", xy.x, event.clientX, xy.y, event.clientY)
        didMove = xy.x !== event.clientX || xy.y !== event.clientY;
      }
    } catch (err) { }

    let canceled = false;
    if (callBackTriggered) {
      trace("Long press was detected, prevent default on release")
      e.preventDefault();
      canceled = true;
    }
    setStartLongPress(false);
    trace("touch end: moved:" + (moved ? "true" : false) + ", didMove:" + (didMove ? "true" : "false"))
    if (!canceled &&  !didMove) {
      trace("do click")
      handleNavigate();
      e.preventDefault();
    }
  }, [callBackTriggered, props]); 

  return (
    <div
      className={"tileGroup noTouchCallout"}
      style={props.style}
      onMouseDown={start}
      onMouseUp={
        (e) => {
          trace("mouse up");
          stop(e)
        }
      }
      onMouseLeave={
        (e) => {
          trace("mouse leave");
          stop(e)
        }
      }
      onTouchStart={start}
      onTouchEnd={
        (e) => {
          trace("touch end");
          stop(e)
        }
      }
      
      onTouchMove={move}
      onScroll={move}
      onScrollCapture={move}
      onMouseMove={move}
    >
      {props.children}
    </div>
  );
}
