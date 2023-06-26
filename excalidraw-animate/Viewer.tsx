import React, { useEffect, useRef } from "react";

const Viewer: React.FC<ViewerProps> = ({ svgList }) => {
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
      svgList.forEach(({ svg }) => svg.remove());
    };
  }, [svgList]);

  return (
    <div style={{ height: '100vh' }} ref={ref}></div>
  );
};

export default Viewer;
