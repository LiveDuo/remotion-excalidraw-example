import React, { useEffect, useState, useRef } from "react";

import { resetAnimation, stepAnimation, toggleAnimation } from "../animate";
import { loadData, appendElement, removeElement } from "../animate";

const Canvas: React.FC = () => {

  const [svg, setSvg] = useState<SvgItem>();
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData().then(l => setSvg(l))
  }, []);

  useEffect(() => {
    if (svg) appendElement(svg!, ref?.current!)
    return () => removeElement(svg!);
  }, [svg]);

  return (
    <div>
      <div>
        <button type="button" onClick={() => {toggleAnimation(svg!, paused); setPaused(p => !p)}}>{paused ? "Play" : "Pause"}</button>
        <button type="button" onClick={() => {stepAnimation(svg!); setPaused(true)}}>Step</button>
        <button type="button" onClick={() => resetAnimation(svg!)}>Reset</button>
      </div>
      <div style={{ height: '100vh' }} ref={ref}></div>;
    </div>
  );
};

export default Canvas;
