import { useState, useEffect, useCallback } from 'react';

export default function useLongPress(callback = () => { }, ms = 300) {
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
        callback();
        setStartLongPress(false);
      }, ms);
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
    if (callBackTriggered) {
      console.log("prevent default on release")
      e.preventDefault();
    }
    setStartLongPress(false);
  }, [callBackTriggered]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}