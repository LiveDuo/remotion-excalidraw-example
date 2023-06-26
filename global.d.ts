// interfaces
interface DataList {
    elements: readonly ExcalidrawElement[];
    appState: Parameters<typeof exportToSvg>[0]["appState"];
    files: BinaryFiles;
}
interface SvgItem { svg: SVGSVGElement; finishedMs: number; }

// params
type AnimateOptions = {
    startMs?: number;
    pointerImg?: string;
    pointerWidth?: string;
    pointerHeight?: string;
};

declare module "*.excalidraw" {
    const value: object;
    export default value;
}