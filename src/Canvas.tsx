import React, { useEffect, useState, useRef } from 'react'

import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion'

import type { ExportedDataState, } from '@excalidraw/excalidraw/types/data/types'

import { exportToSvg, } from '@excalidraw/excalidraw'
import { animateSvg } from 'excalidraw-animate'

import example from '../data/example.excalidraw'

const Canvas: React.FC = () => {

  const [svg, setSvg] = useState<SVGSVGElement>()
  const ref = useRef<HTMLDivElement>(null)

  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const progress = interpolate(frame, [0 , durationInFrames], [0, 1])

  useEffect(() => {
    (async () => {

      // load
      const data = example as ExportedDataState
      const elements = data.elements.filter((e) => !e.isDeleted)
      const exportOptions = { elements, files: data.files!, appState: data.appState, exportPadding: 30, }
      const svg = await exportToSvg(exportOptions)
      setSvg(svg)

      // append
      svg.style.width = '100%'
      svg.style.height = '100%'
      ref.current?.appendChild(svg)

      // animate
      animateSvg(svg, elements, {})
      svg?.pauseAnimations()
    })()
  }, [])

  useEffect(() => {
    const duration = 20 // TODO
    svg?.setCurrentTime(progress * duration)
  }, [progress])

  return <div style={{ height: '100vh' }} ref={ref}></div>
}

export default Canvas
