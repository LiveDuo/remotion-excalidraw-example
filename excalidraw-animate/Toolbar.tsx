import React, { useCallback, useEffect, useRef, useState } from "react";
import { fileOpen } from "browser-fs-access";

import { exportToSvg, loadFromBlob, } from "@excalidraw/excalidraw";
import type { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

import { getBeginTimeList } from "./animate";

const loadFromJSON = async () => {
  const blob = await fileOpen({
    description: "Excalidraw files",
  });
  return loadFromBlob(blob, null, null);
};

const getCombinedBeginTimeList = (svgList: Props["svgList"]) => {
  const beginTimeList = ([] as number[]).concat(
    ...svgList.map(({ svg }) =>
      getBeginTimeList(svg).map((n) => Math.floor(n / 100) * 100)
    )
  );
  return [...new Set(beginTimeList)].sort((a, b) => a - b);
};

type Props = {
  svgList: {
    svg: SVGSVGElement;
    finishedMs: number;
  }[];
  loadDataList: (
    data: {
      elements: readonly ExcalidrawElement[];
      appState: Parameters<typeof exportToSvg>[0]["appState"];
      files: BinaryFiles;
    }[]
  ) => void;
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
    const hash = window.location.hash.slice(1);
    const searchParams = new URLSearchParams(hash);
    if (searchParams.get("toolbar") !== "no") {
      setShowToolbar(true);
    } else {
      setShowToolbar("never");
    }
  }, []);

  const loadFile = async () => {
    const data = await loadFromJSON();
    loadDataList([data]);
  };

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
      } else if (e.key.toLowerCase() === "q") {
        // toggle toolbar
        setShowToolbar((s) => (typeof s === "boolean" ? !s : s));
      } else {
        // show toolbar otherwise
        setShowToolbar((s) => (typeof s === "boolean" ? true : s));
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [togglePausedAnimations, stepForwardAnimations, resetAnimations]);

  if (showToolbar !== true) {
    return null;
  }

  return (
    <div className="Toolbar">
      <div className="Toolbar-loader">
        <button type="button" onClick={loadFile}>
          Load File
        </button>
      </div>
      {!!svgList.length && (
        <div className="Toolbar-controller">
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
