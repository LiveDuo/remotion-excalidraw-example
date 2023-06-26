import React, { useCallback, useEffect, useRef, useState } from "react";

import { exportToSvg, } from "@excalidraw/excalidraw";
import type { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

import { getBeginTimeList } from "./animate";

import example from "./example.json";

const getCombinedBeginTimeList = (svgList: Props["svgList"]) => {
  const beginTimeList = ([] as number[]).concat(
    ...svgList.map(({ svg }) =>
      getBeginTimeList(svg).map((n) => Math.floor(n / 100) * 100)
    )
  );
  return [...new Set(beginTimeList)].sort((a, b) => a - b);
};

interface DataList {
  elements: readonly ExcalidrawElement[];
  appState: Parameters<typeof exportToSvg>[0]["appState"];
  files: BinaryFiles;
}

interface SvgList { svg: SVGSVGElement; finishedMs: number; }

type Props = {
  svgList: SvgList[];
  loadDataList: (data: DataList[]) => void;
};

const Toolbar: React.FC<Props> = ({ svgList, loadDataList }) => {
  const [showToolbar, setShowToolbar] = useState<boolean | "never">(false);
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

  useEffect(() => {
    loadDataList([example as DataList]);
  }, []);

  const togglePausedAnimations = useCallback(() => {
    if (!svgList.length) {
      return;
    }
    setPaused((p) => !p);
  }, [svgList]);

  const timer = useRef<NodeJS.Timeout>();
  const stepForwardAnimations = useCallback(() => {
    if (!svgList.length) {
      return;
    }
    const beginTimeList = getCombinedBeginTimeList(svgList);
    const currentTime = svgList[0].svg.getCurrentTime() * 1000;
    let nextTime = beginTimeList.find((t) => t > currentTime + 50);
    if (nextTime) {
      nextTime -= 1;
    } else {
      nextTime = currentTime + 500;
    }
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

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        togglePausedAnimations();
      } else if (e.key.toLowerCase() === "s") {
        stepForwardAnimations();
      } else if (e.key.toLowerCase() === "r") {
        resetAnimations();
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [togglePausedAnimations, stepForwardAnimations, resetAnimations]);

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
