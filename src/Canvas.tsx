import React, { useEffect, useState, useRef } from 'react'

import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion'

import type { NonDeletedExcalidrawElement, } from '@excalidraw/excalidraw/types/element/types'
import type { ExportedDataState, } from '@excalidraw/excalidraw/types/data/types'

import { exportToSvg, } from '@excalidraw/excalidraw'
import { animateSvg } from 'excalidraw-animate'

import example from '../data/example.excalidraw'

const Canvas: React.FC = () => {

  const [svg, setSvg] = useState<SVGSVGElement>()
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const opacity = interpolate(frame, [0 , durationInFrames], [0, 1])

  useEffect(() => {
    (async () => {
      const data = example as ExportedDataState
      const elements = data.elements.filter((e): e is NonDeletedExcalidrawElement => !e.isDeleted)
      const exportOptions = { elements, files: data.files!, appState: data.appState, exportPadding: 30, }
      const svg = await exportToSvg(exportOptions)
      animateSvg(svg, elements, {})
      setSvg(svg)
    })()
  }, [])

  useEffect(() => {
    if (svg) {
      svg.style.width = '100%'
      svg.style.height = '100%'
      ref.current?.appendChild(svg)
    }
    return () => svg?.remove()
  }, [svg])

  const toggleAnimation = () => {
    if (!paused) svg?.pauseAnimations()
    else svg?.unpauseAnimations()
    setPaused(p => !p)
  }
  
  const stepAnimation = () => {
    svg?.pauseAnimations()
    svg?.setCurrentTime(svg?.getCurrentTime() + 0.01)
    setPaused(true)
  }

  return (
    <div>
      <h1>{opacity.toFixed(2)}</h1>
      <div>
        <button type="button" onClick={() => toggleAnimation()}>{paused ? 'Play' : 'Pause'}</button>
        <button type="button" onClick={() => stepAnimation()}>Step</button>
        <button type="button" onClick={() => svg?.setCurrentTime(0)}>Reset</button>
      </div>
      <div style={{ height: '100vh' }} ref={ref}></div>
    </div>
  )
}

export default Canvas
