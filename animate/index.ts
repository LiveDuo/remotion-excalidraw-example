import { Dispatch, SetStateAction } from "react";

import type { NonDeletedExcalidrawElement, } from "@excalidraw/excalidraw/types/element/types";

import { exportToSvg, } from "@excalidraw/excalidraw";
import { animateSvg } from "./animate";

import example from "../data/example.excalidraw";

const findAnimate = (ele: SVGElement, tmpTimeList: number[]) => {
  if (ele.tagName === "animate") {
    const match = /([0-9.]+)ms/.exec(ele.getAttribute("begin") || "");
    if (match) {
      tmpTimeList.push(Number(match[1]));
    }
  }
  (ele.childNodes as NodeListOf<SVGElement>).forEach((ele) => {
    findAnimate(ele, tmpTimeList);
  });
};

const getBeginTimeList = (svg: SVGSVGElement) => {
  const beginTimeList: number[] = [];
  const tmpTimeList: number[] = [];
  (svg.childNodes as NodeListOf<SVGElement>).forEach((ele) => {
    if (ele.tagName === "g") {
      findAnimate(ele, tmpTimeList);
      if (tmpTimeList.length) {
        beginTimeList.push(Math.min(...tmpTimeList));
        tmpTimeList.splice(0);
      }
    } else if (ele.tagName === "defs") {
      (ele.childNodes as NodeListOf<SVGElement>).forEach((ele) => {
        findAnimate(ele, tmpTimeList);
        if (tmpTimeList.length) {
          beginTimeList.push(Math.min(...tmpTimeList));
          tmpTimeList.splice(0);
        }
      });
    }
  });
  return beginTimeList;
};

const getCombinedBeginTimeList = (svgList: ToolbarProps["svgList"]) => {
  const beginTimeList = ([] as number[]).concat(
    ...svgList.map(({ svg }) =>
      getBeginTimeList(svg).map((n) => Math.floor(n / 100) * 100)
    )
  );
  return [...new Set(beginTimeList)].sort((a, b) => a - b);
};

// pause animations
export const togglePausedAnimations = (svgList: SvgList[], paused: boolean, setPaused: Dispatch<SetStateAction<boolean>>) => {

  svgList.forEach(({ svg }) => {
    if (!paused) {
      svg.pauseAnimations();
    } else {
      svg.unpauseAnimations();
    }
  });

  setPaused((p) => !p);
}

// step animations
export const stepForwardAnimations = (svgList: SvgList[], timer: NodeJS.Timeout, setPaused: Dispatch<SetStateAction<boolean>>) => {
  const beginTimeList = getCombinedBeginTimeList(svgList);
  const currentTime = svgList[0].svg.getCurrentTime() * 1000;
  let nextTime = beginTimeList.find((t) => t > currentTime + 50);
  nextTime = nextTime ? -1 : currentTime + 500;
  clearTimeout(timer as NodeJS.Timeout);
  svgList.forEach(({ svg }) => {
    svg.unpauseAnimations();
  });
  timer = setTimeout(() => {
    svgList.forEach(({ svg }) => {
      svg.pauseAnimations();
      svg.setCurrentTime((nextTime as number) / 1000);
    });
    setPaused(true);
  }, nextTime - currentTime);
}

// reset animations
export const resetAnimations = (svgList: SvgList[]) => {
  svgList.forEach(({ svg }) => {
    svg.setCurrentTime(0);
  });
}

export const loadDataList = async () => {
  const dataList = [example as DataList];
  const svgList = await Promise.all(
    dataList.map(async (data) => {
      const elements = data.elements.filter((e): e is NonDeletedExcalidrawElement => !e.isDeleted);
      const exportOptions = { elements, files: data.files, appState: data.appState, exportPadding: 30, }
      const svg = await exportToSvg(exportOptions);
      const result = animateSvg(svg, elements, {});
      return { svg, finishedMs: result.finishedMs };
    })
  );
  return svgList;
}

export const appendAnimationsToRef = (svgList: SvgList[], ref: HTMLDivElement) => {
  svgList.forEach(({ svg }) => {
    svg.style.width = '100%'
    svg.style.height = '100%'
    if (ref) {
      ref.appendChild(svg);
    }
  });
}

export const removeAnimationsFromList = (svgList: SvgList[]) => {
  svgList.forEach(({ svg }) => svg.remove())
}
