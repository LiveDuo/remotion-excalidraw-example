import type { NonDeletedExcalidrawElement, } from "@excalidraw/excalidraw/types/element/types";

import { exportToSvg, } from "@excalidraw/excalidraw";
import { animateSvg } from "./animate";

import example from "../data/example.excalidraw";

export const toggleAnimation = (SvgItem: SvgItem, paused: boolean) => {
  if (!paused) SvgItem.svg.pauseAnimations();
  else SvgItem.svg.unpauseAnimations();
}

export const stepAnimation = (SvgItem: SvgItem) => {
  SvgItem.svg.pauseAnimations();
  SvgItem.svg.setCurrentTime(SvgItem.svg.getCurrentTime() + 0.01);
}

export const resetAnimation = (SvgItem: SvgItem) => {
  SvgItem.svg.setCurrentTime(0);
}

export const loadData = async () => {
  const data = example as DataList;
  const elements = data.elements.filter((e): e is NonDeletedExcalidrawElement => !e.isDeleted);
  const exportOptions = { elements, files: data.files, appState: data.appState, exportPadding: 30, }
  const svg = await exportToSvg(exportOptions);
  const result = animateSvg(svg, elements, {});
  return { svg, finishedMs: result.finishedMs };
}

export const appendElement = (SvgItem: SvgItem, ref: HTMLDivElement) => {
  SvgItem.svg.style.width = '100%'
  SvgItem.svg.style.height = '100%'
  ref?.appendChild(SvgItem.svg);
}

export const removeElement = (SvgItem: SvgItem) => {
  SvgItem?.svg.remove()
}
