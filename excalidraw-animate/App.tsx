import React from "react";

import Toolbar from "./Toolbar";
import Viewer from "./Viewer";
import { useLoadSvg } from "./useLoadSvg";

const App: React.FC = () => {
  const { loadedSvgList, loadDataList } = useLoadSvg();
  return (
    <div>
      <Toolbar svgList={loadedSvgList} loadDataList={loadDataList} />
      {!!loadedSvgList.length && <Viewer svgList={loadedSvgList} />}
    </div>
  );
};

export default App;
