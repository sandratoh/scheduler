import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    
    replace
      ? setHistory(prev => [...prev])
      : setHistory(prev => [...prev, newMode]);
  };

  const back = () => {
    const prevHistory = history.slice(-2)[0];
    setMode(prevHistory);
    
    setHistory(prev => {
      if (history.length > 1) {
        const newHistory = [...prev].slice(0, -1);
        return newHistory;
      }
    });
  };

  return { mode, transition, back };
};