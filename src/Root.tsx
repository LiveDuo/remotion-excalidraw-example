import {Composition} from 'remotion'
import {Component} from './Composition'

export const RemotionRoot: React.FC = () => {
	return (
		<Composition id="Default" component={Component} durationInFrames={150} fps={30} width={1920} height={1080}/>
	)
}
