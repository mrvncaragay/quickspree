// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Camera } from 'expo-camera';

// const Scanner = ({ handleScan }) => {
// 	const [hasPermission, setHasPermission] = useState(null);

// 	useEffect(() => {
// 		(async () => {
// 			const { status } = await Camera.requestPermissionsAsync();
// 			setHasPermission(status === 'granted');
// 		})();
// 	}, []);

// 	if (hasPermission === null) {
// 		return <View />;
// 	}
// 	if (hasPermission === false) {
// 		return <Text>No access to camera</Text>;
// 	}
// 	return (
// 		<View style={styles.container}>
// 			<Camera style={styles.camera} autoFocus onBarCodeScanned={handleScan} />
// 		</View>
// 	);
// };
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		flexDirection: 'column',
// 		justifyContent: 'center',
// 	},
// 	camera: {
// 		flex: 1,
// 	},
// });

// export default Scanner;
