import React, { useEffect, useState, useRef } from 'react'

import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion'

import type { NonDeletedExcalidrawElement, } from '@excalidraw/excalidraw/types/element/types'

import { exportToSvg, } from '@excalidraw/excalidraw'
import { animateSvg } from 'excalidraw-animate'

import example from '../data/example.excalidraw'

const Canvas: React.FC = () => {

  const [svg, setSvg] = useState<SvgItem>()
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const opacity = interpolate(frame, [0 , durationInFrames], [0, 1])

  useEffect(() => {
    (async () => {
      const data = example as ExcalidrawJson
      const elements = data.elements.filter((e): e is NonDeletedExcalidrawElement => !e.isDeleted)
      const exportOptions = { elements, files: data.files, appState: data.appState, exportPadding: 30, }
      const svg = await exportToSvg(exportOptions)
      const result = animateSvg(svg, elements, {})
      setSvg({ svg, finishedMs: result.finishedMs })
    })()
  }, [])

  useEffect(() => {
    if (svg) {
      svg.svg.style.width = '100%'
      svg.svg.style.height = '100%'
      ref.current?.appendChild(svg.svg)
    }
    return () => svg?.svg.remove()
  }, [svg])

  const toggleAnimation = () => {
    if (!paused) svg?.svg.pauseAnimations()
    else svg?.svg.unpauseAnimations()
    setPaused(p => !p)
  }
  
  const stepAnimation = () => {
    svg?.svg.pauseAnimations()
    svg?.svg.setCurrentTime(svg?.svg.getCurrentTime() + 0.01)
    setPaused(true)
  }

  return (
    <div>
      <h1>{opacity.toFixed(2)}</h1>
      <div>
        <button type="button" onClick={() => toggleAnimation()}>{paused ? 'Play' : 'Pause'}</button>
        <button type="button" onClick={() => stepAnimation()}>Step</button>
        <button type="button" onClick={() => svg?.svg.setCurrentTime(0)}>Reset</button>
      </div>
      <div style={{ height: '100vh' }} ref={ref}></div>
    </div>
  )
}

export default Canvas
