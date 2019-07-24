/**
 * https://usehooks.com/useKeyPress/
 */

import { useState, useEffect } from "react";

// Hook
export default function useKeyPress({
  targetKey,
  shouldPreventDefault = true,
  inputDelayMs = 50
}) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  const [lastPressMs, setLastPressMs] = useState(0);

  const isReady = (lastPressMs) => {
    if (!inputDelayMs) return true;
    console.log("[M@][useKeyPress] lastPressMs ", lastPressMs);
    console.log(
      "[M@][useKeyPress] Date.now() - lastPressMs ",
      Date.now() - lastPressMs
    );
    return Date.now() - lastPressMs > inputDelayMs;
  };

  // If pressed key is our target key then set to true
  const downHandler = ev => {
    if (ev.key === targetKey) {
      const ready = isReady(lastPressMs);
      if (shouldPreventDefault) {
        ev.preventDefault();
      }
      console.log("[M@][useKeyPress] ready ", ready);
      setKeyPressed(ready);
      setLastPressMs(Date.now());
    }
  };

  // If released key is our target key then set to false
  const upHandler = ev => {
    // console.log("[M@][useKeyPress] key ", key);
    if (ev.key === targetKey) {
      if (shouldPreventDefault) {
        ev.preventDefault();
      }
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}
