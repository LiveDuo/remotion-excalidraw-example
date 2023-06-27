import { CSSProperties } from 'react'

import { AbsoluteFill, Sequence } from 'remotion'
import Excalidraw from './Excalidraw'

const containerOptions: CSSProperties = {margin: '40px', justifyContent: 'center', alignItems: 'center'}

const Component: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<Sequence from={0} durationInFrames={200} style={containerOptions}>
				<Excalidraw/>
			</Sequence>
		</AbsoluteFill>
	)
}
export { Component }
