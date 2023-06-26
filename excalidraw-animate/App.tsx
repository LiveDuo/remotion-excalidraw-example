import React, { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Viewer from "./Viewer";

import { exportToSvg, } from "@excalidraw/excalidraw";

import type { NonDeletedExcalidrawElement, } from "@excalidraw/excalidraw/types/element/types";

import { animateSvg } from "./animate";

import example from "./example.json";

const loadDataList = async (dataList: DataList[]) => {
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

const App: React.FC = () => {

  const [loadedSvgList, setLoadedSvgList] = useState<SvgList[]>([]);

  useEffect(() => {
    (async () => {
      const svgList = await loadDataList([example as DataList]);
      setLoadedSvgList(svgList)
    })()
  }, []);

  return (
    <div>
      <Toolbar svgList={loadedSvgList} />
      <Viewer svgList={loadedSvgList} />
    </div>
  );
};

export default App;
