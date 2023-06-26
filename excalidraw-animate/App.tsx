import React, { useEffect, useState, useRef } from "react";

import type { NonDeletedExcalidrawElement, } from "@excalidraw/excalidraw/types/element/types";
import { exportToSvg, } from "@excalidraw/excalidraw";

import Toolbar from "./Toolbar";

import { animateSvg } from "./animate";

import example from "./example.excalidraw";

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

  const [svgList, setLoadedSvgList] = useState<SvgList[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // append svgs
    svgList.forEach(({ svg }) => {
      svg.style.width = '100%'
      svg.style.height = '100%'
      if (ref.current) {
        ref.current.appendChild(svg);
      }
    });

    // cleanup
    return () => svgList.forEach(({ svg }) => svg.remove());;
  }, [svgList]);

  useEffect(() => {
    (async () => {
      const svgList = await loadDataList([example as DataList]);
      setLoadedSvgList(svgList)
    })()
  }, []);

  return (
    <div>
      <Toolbar svgList={svgList} />
      <div style={{ height: '100vh' }} ref={ref}></div>;
    </div>
  );
};

export default App;
