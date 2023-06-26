// params
type AppState = Parameters<typeof exportToSvg>[0]["appState"]
type AnimateOptions = { startMs?: number; pointerImg?: string; pointerWidth?: string; pointerHeight?: string; };

// interfaces
interface ExcalidrawJson { elements: ExcalidrawElement[]; appState: AppState; files: BinaryFiles; }
interface SvgItem { svg: SVGSVGElement; finishedMs: number; }

// modules
declare module "*.excalidraw"
