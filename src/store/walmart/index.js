import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { SvgUri, Circle, Text } from 'react-native-svg';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';
import Marker from '../../components/Marker';
import { meat } from '../../utils/sectionCoordinates';

export default function Walmart() {
	const { width } = Dimensions.get('screen');

	return (
		<View style={styles.container}>
			<SvgPanZoom
				canvasWidth={400}
				minScale={0.85}
				maxScale={1.5}
				initialZoom={0.85}
				onZoom={(zoom) => {
					console.log('onZoom:' + zoom);
				}}
				canvasStyle={{
					flex: 1,
					top: Platform.OS === 'ios' ? 80 : 80,
					left: Platform.OS === 'ios' ? 40 : 30,
					backgroundColor: 'transparent',
				}}
				viewStyle={{
					width: width,
					backgroundColor: 'lightgray',
				}}
			>
				<SvgUri uri='https://quickspree.s3-us-west-1.amazonaws.com/svg/store/walmart/antioch/dairy-guide.svg' />
				<Text fill='gray' fontSize='14' x='360' y='25'>
					A33
				</Text>

				<Marker x={200} y={85} />
			</SvgPanZoom>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: 300,
	},
});
