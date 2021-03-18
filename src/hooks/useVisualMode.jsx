import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = newMode => {
    setMode(newMode);
    setHistory(prev => [...prev, newMode]);
  };

  const back = () => {
    // setHistory(prev => {
    //   [...prev];
    //   // console.log(history)
    // })
    // setHistory(prev => [...prev])
    // history.pop();
    console.log(history);
    // setHistory(prev => prev)

    const prevHistory = history.slice(-2)[0];
    console.log('prevHistory', prevHistory)
    setMode(prevHistory);
    console.log('mode', mode);
    let historyCopy = [...history];
    historyCopy.pop();
    setHistory(historyCopy);
  };

  return { mode, transition, back };
};