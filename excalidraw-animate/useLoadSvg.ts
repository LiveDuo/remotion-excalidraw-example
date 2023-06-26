import { useCallback, useState } from "react";

import {
  exportToSvg,
} from "@excalidraw/excalidraw";

import type { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";

import { animateSvg } from "./animate";

const getNonDeletedElements = (
  elements: readonly ExcalidrawElement[]
): NonDeletedExcalidrawElement[] =>
  elements.filter(
    (element): element is NonDeletedExcalidrawElement => !element.isDeleted
  );

export const useLoadSvg = () => {
  const [loadedSvgList, setLoadedSvgList] = useState<
    {
      svg: SVGSVGElement;
      finishedMs: number;
    }[]
  >([]);

  const loadDataList = useCallback(
    async (
      dataList: {
        elements: readonly ExcalidrawElement[];
        appState: Parameters<typeof exportToSvg>[0]["appState"];
        files: BinaryFiles;
      }[],
    ) => {
      const svgList = await Promise.all(
        dataList.map(async (data) => {
          const elements = getNonDeletedElements(data.elements);
          const svg = await exportToSvg({
            elements,
            files: data.files,
            appState: data.appState,
            exportPadding: 30,
          });
          const result = animateSvg(svg, elements, {});
          return { svg, finishedMs: result.finishedMs };
        })
      );
      setLoadedSvgList(svgList);
      return svgList;
    },
    []
  );

  return { loadedSvgList, loadDataList };
};
