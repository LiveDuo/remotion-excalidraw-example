
import { exportToSvg, } from "@excalidraw/excalidraw";

import type { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";

import { animateSvg } from "./animate";

const loadDataList = async (
  dataList: {
    elements: readonly ExcalidrawElement[];
    appState: Parameters<typeof exportToSvg>[0]["appState"];
    files: BinaryFiles;
  }[],
) => {
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
export { loadDataList }