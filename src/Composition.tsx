import { CSSProperties } from 'react'

import { AbsoluteFill, Sequence } from 'remotion'
import Excalidraw from './Excalidraw'

import slide1 from '../data/slide_1.excalidraw'
import slide2 from '../data/slide_2.excalidraw'

const containerOptions: CSSProperties = {margin: '40px', justifyContent: 'center', alignItems: 'center'}

const Component: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<Sequence from={0} durationInFrames={200} style={containerOptions}>
				<Excalidraw data={slide1}/>
			</Sequence>
			<Sequence from={200} durationInFrames={300} style={containerOptions}>
				<Excalidraw data={slide2}/>
			</Sequence>
		</AbsoluteFill>
	)
}
export { Component }
