import React, { useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ActivityIndicator, useTheme } from 'react-native-paper';

export const Constants = {
	...RNCamera.Constants,
};

const Camera = ({ onRead, handleBarcodeScan, product }) => {
	const [readOcr, setReadOcr] = useState(false);
	const { colors } = useTheme();

	const onTextSnapshot = () => {
		setReadOcr(true);
	};

	const parseAisle = (str) => {
		const satr = str.replace(/-/g, '');
		return satr.split(' ')[1];
	};

	const findProductSize = (str) => {
		const arr = str.match(/\(.*\)/);

		if (arr) {
			return arr[0];
		}
	};

	const handleOnReadOCR = (data) => {
		const products = [];
		let aisleCode = null;
		let productName = null;
		let size = null;

		if (readOcr && data.textBlocks) {
			data.textBlocks.map((text) => {
				const { value } = text;

				if (value.startsWith('Aisle')) {
					aisleCode = parseAisle(value);
				}

				if (value.length > 15 && text.bounds.origin.x >= 140 && text.bounds.origin.y < 450) {
					size = findProductSize(value);
					productName = value.replace(/ *\([^)]*\) */g, '');

					// Parsing Aisle code reading prority
					const index = productName.indexOf('Aisle');
					if (index > 0) {
						const str = productName.slice(index);
						aisleCode = parseAisle(str);
						productName = productName.slice(0, index);
					}

					// clean and remove count
					productName = productName
						.replace(/(\r\n|\n|\r)/gm, ' ')
						.replace(',', '')
						.trim()
						.split(' ')
						.slice(1)
						.join(' ');

					if (productName && size) {
						products.push({ ...product, size, aisleCode, productName });
					}
				}
			});
		}
		onRead(products);
		setReadOcr(false);
	};

	return (
		<View style={styles.camera.container}>
			<RNCamera
				style={styles.camera.preview}
				type={Constants.Type.back}
				flashMode={Constants.AutoFocus.off}
				quality={0.5}
				captureAudio={false}
				autoFocus={Constants.AutoFocus.on}
				whiteBalance={Constants.WhiteBalance.auto}
				// androidCameraPermissionOptions={{
				//   title: 'Permission to use camera',
				//   message: 'We need your permission to use your camera',
				//   buttonPositive: 'Ok',
				//   buttonNegative: 'Cancel',
				// }}
				// androidRecordAudioPermissionOptions={{
				//   title: 'Permission to use audio',
				//   message: 'We need your permission to use your audio',
				//   buttonPositive: 'Ok',
				//   buttonNegative: 'Cancel',
				// }}
				onTextRecognized={readOcr ? handleOnReadOCR : null}
				onBarCodeRead={handleBarcodeScan}>
				{({ camera, status, recordAudioPermissionStatus }) => {
					if (status !== 'READY') return <ActivityIndicator size='large' color={colors.primary} />;
					return (
						<TouchableOpacity onPress={onTextSnapshot} style={styles.camera.capture}>
							<Image
								source={require('../../assets/camera/cameraButton.png')}
								style={{ width: 50, height: 50 }}
								resizeMode={'contain'}
							/>
						</TouchableOpacity>
					);
				}}
			</RNCamera>
		</View>
	);
};

const styles = {
	camera: {
		container: {
			flex: 1,
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			backgroundColor: 'black',
			justifyContent: 'center',
		},
		preview: {
			flex: 1,
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		capture: {
			padding: 15,
			position: 'absolute',
		},
	},
};

export default Camera;
