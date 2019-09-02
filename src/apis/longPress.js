import { useState, useEffect, useCallback } from 'react';

export default function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [callBackTriggered, setCallBackTriggered] = useState(false);


  useEffect(() => {
    let timerId;
    if (startLongPress) {
      setCallBackTriggered(false);
      timerId = setTimeout(()=>{
        setCallBackTriggered(true);
        callback();
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
  }, []);
  const stop = useCallback((e) => {
    if (callBackTriggered) {
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