import React, { useEffect, useRef } from "react";

type Props = {
  svgList: {
    svg: SVGSVGElement;
    finishedMs: number;
  }[];
};

const Viewer: React.FC<Props> = ({ svgList }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    svgList.forEach(({ svg }) => {
      svg.style.width = '100%'
      svg.style.height = '100%'
      if (ref.current) {
        ref.current.appendChild(svg);
      }
    });
    return () => {
      svgList.forEach(({ svg }) => {
        svg.remove();
      });
    };
  }, [svgList]);

  const repeat = Math.ceil(Math.sqrt(svgList.length));
  const grids = `repeat(${repeat}, ${100 / repeat}%)`;

  return (
    <div
      className="Viewer"
      style={{
        height: '100vh',
        gridTemplateColumns: grids,
        gridTemplateRows: grids,
      }}
      ref={ref}
    ></div>
  );
};

export default Viewer;
