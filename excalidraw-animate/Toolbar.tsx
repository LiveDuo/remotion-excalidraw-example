import React, { useCallback, useEffect, useRef, useState } from "react";

import { getBeginTimeList } from "./animate";

const getCombinedBeginTimeList = (svgList: Props["svgList"]) => {
  const beginTimeList = ([] as number[]).concat(
    ...svgList.map(({ svg }) =>
      getBeginTimeList(svg).map((n) => Math.floor(n / 100) * 100)
    )
  );
  return [...new Set(beginTimeList)].sort((a, b) => a - b);
};

interface SvgList { svg: SVGSVGElement; finishedMs: number; }

type Props = {
  svgList: SvgList[];
};

const Toolbar: React.FC<Props> = ({ svgList }) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    svgList.forEach(({ svg }) => {
      if (paused) {
        svg.pauseAnimations();
      } else {
        svg.unpauseAnimations();
      }
    });
  }, [svgList, paused]);

  const togglePausedAnimations = useCallback(() => {
    if (!svgList.length) return;
    setPaused((p) => !p);
  }, [svgList]);

  const timer = useRef<NodeJS.Timeout>();
  const stepForwardAnimations = useCallback(() => {
    if (!svgList.length) return;
    const beginTimeList = getCombinedBeginTimeList(svgList);
    const currentTime = svgList[0].svg.getCurrentTime() * 1000;
    let nextTime = beginTimeList.find((t) => t > currentTime + 50);
    nextTime = nextTime ? -1 : currentTime + 500;
    clearTimeout(timer.current as NodeJS.Timeout);
    svgList.forEach(({ svg }) => {
      svg.unpauseAnimations();
    });
    timer.current = setTimeout(() => {
      svgList.forEach(({ svg }) => {
        svg.pauseAnimations();
        svg.setCurrentTime((nextTime as number) / 1000);
      });
      setPaused(true);
    }, nextTime - currentTime);
  }, [svgList]);

  const resetAnimations = useCallback(() => {
    svgList.forEach(({ svg }) => {
      svg.setCurrentTime(0);
    });
  }, [svgList]);

  return (
    <div>
      {!!svgList.length && (
        <div>
          <button type="button" onClick={togglePausedAnimations}>
            {paused ? "Play (P)" : "Pause (P)"}
          </button>
          <button type="button" onClick={stepForwardAnimations}>
            Step (S)
          </button>
          <button type="button" onClick={resetAnimations}>
            Reset (R)
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
