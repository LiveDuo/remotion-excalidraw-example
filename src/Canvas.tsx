import React, { useEffect, useState, useRef } from "react";

import { resetAnimations, stepForwardAnimations, togglePausedAnimations } from "../animate";
import { loadDataList, appendAnimationsToRef, removeAnimationsFromList } from "../animate";

const Canvas: React.FC = () => {

  const [svgList, setLoadedSvgList] = useState<SvgList[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    appendAnimationsToRef(svgList, ref?.current!)
    return () => removeAnimationsFromList(svgList);
  }, [svgList]);

  useEffect(() => {
    (async () => {
      const svgList = await loadDataList();
      setLoadedSvgList(svgList)
    })()
  }, []);

  const timer = useRef<NodeJS.Timeout>();
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <div>
        <button type="button" onClick={() => togglePausedAnimations(svgList, paused, setPaused)}>{paused ? "Play (P)" : "Pause (P)"}</button>
        <button type="button" onClick={() => stepForwardAnimations(svgList, timer?.current!, setPaused)}>Step (S)</button>
        <button type="button" onClick={() => resetAnimations(svgList)}>Reset (R)</button>
      </div>
      <div style={{ height: '100vh' }} ref={ref}></div>;
    </div>
  );
};

export default Canvas;
