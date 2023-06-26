import { CSSProperties } from 'react'

import { AbsoluteFill, Sequence } from 'remotion'
import App from '../excalidraw-animate/App'

const containerOptions: CSSProperties = {margin: '40px', justifyContent: 'center', alignItems: 'center'}

const Component: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<Sequence from={0} durationInFrames={200} style={containerOptions}>
				<App/>
			</Sequence>
		</AbsoluteFill>
	)
}
export { Component }
