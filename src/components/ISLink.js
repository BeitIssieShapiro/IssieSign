import React from "react";
import "../css/card.css";
import "../css/Tile.css";

import { useHistory } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';


// onLongPress


export default function ISLink(props) {
    const history = useHistory();
    let lpDelay = props.longPressDelay?props.longPressDelay:500;
    function handleNavigate() {
        console.log ("navigate to", props.url)
        if (props.url)
            history.push(props.url);
    }

    const [startLongPress, setStartLongPress] = useState(false);
    const [startEvent, setStartEvent] = useState(undefined);
    const [callBackTriggered, setCallBackTriggered] = useState(false);
  
  
    useEffect(() => {
      let timerId;
      if (startLongPress) {
        setCallBackTriggered(false);
        timerId = setTimeout(() => {
          setCallBackTriggered(true);
          if (startEvent) {
            try {
              startEvent.preventDefault();
              startEvent.stopPropagation();
              console.log("Prevent default on press")
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
    }, [startLongPress]);
  
    const start = useCallback((e) => {
      setStartLongPress(true);
      setStartEvent(e);
    }, []);
    const stop = useCallback((e) => {
        let canceled = false;
      if (callBackTriggered) {
        console.log("prevent default on release")
        e.preventDefault();
        canceled=true;
      } 
      setStartLongPress(false);
      if (!canceled) {
        handleNavigate();
        e.preventDefault();
      }
    }, [callBackTriggered]);

    return (
        <div   
            className={"tileGroup noTouchCallout"}
            style={props.style} 
            onMouseDown={start}
            onMouseUp={stop}
            onMouseLeave={stop}
            onTouchStart={start}
            onTouchEnd={stop}
        >
                {props.children}
        </div>
    );
}
