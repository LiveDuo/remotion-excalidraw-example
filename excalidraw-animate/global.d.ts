// interfaces
interface DataList {
    elements: readonly ExcalidrawElement[];
    appState: Parameters<typeof exportToSvg>[0]["appState"];
    files: BinaryFiles;
}
interface SvgList { svg: SVGSVGElement; finishedMs: number; }

// props
type ToolbarProps = { svgList: SvgList[]; };

// params
type AnimateOptions = {
    startMs?: number;
    pointerImg?: string;
    pointerWidth?: string;
    pointerHeight?: string;
};
