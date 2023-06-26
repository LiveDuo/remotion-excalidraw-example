import React, { useEffect, useState } from "react";

import Toolbar from "./Toolbar";
import Viewer from "./Viewer";
import { loadDataList } from "./load";

import example from "./example.json";

import { exportToSvg, } from "@excalidraw/excalidraw";
import type { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

interface DataList {
  elements: readonly ExcalidrawElement[];
  appState: Parameters<typeof exportToSvg>[0]["appState"];
  files: BinaryFiles;
}

interface SvgList { svg: SVGSVGElement; finishedMs: number; }

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
