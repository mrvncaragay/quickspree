import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import { useStateValue } from '../../../context';
import { pageCrawler } from '../../../../config';
// import { saveBatchTempImagesToDB } from '../../../firebase';
import { storeData } from '../../../utils/asyncStorage';
import axios from 'axios';

const UnsavedItem = ({ product, onPress }) => {
	const [{ unsaved, store }, dispatch] = useStateValue();
	const navigation = useNavigation();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const image = [{ url: product?.uri ? product?.uri : '../../../../assets/camera/noImage.png' }];

	const CustomText = ({ label, children, containerStyle }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={{ color: colors.backdrop }}>{label}</Text>
				<Text style={{ flex: 1, color: colors.dark600, fontSize: 16 }}>{children}</Text>
			</View>
		);
	};

	const handleSearchImage = async () => {
		// const response = await axios.get(pageCrawler(store.name, product.productName));
		// if (response.data?.urls) {
		// 	saveBatchTempImagesToDB(response.data.urls, `batch/${product.id}/images`);
		// }
	};

	const handleDelete = async () => {
		const newUnsaved = unsaved.filter((p) => p.productName !== product.productName);

		await storeData('unsaved', newUnsaved);
		dispatch({ type: 'setUnsaved', value: newUnsaved });
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: 'white',
				height: 150,
				padding: 20,
				borderTopWidth: 1,
				borderColor: 'lightgray',
			}}>
			{/* We dont need this, no image is fine, we click on it and find the image itself */}
			<TouchableOpacity
				onPress={() =>
					product?.uri ? setViewImage(true) : navigation.navigate('ImageSelect', { id: product.productName })
				}>
				<Image
					style={styles.small}
					source={product?.uri ? { uri: product.uri } : require('../../../../assets/camera/noImage.png')}
				/>
			</TouchableOpacity>

			<TouchableOpacity style={{ flex: 1, width: 190, paddingHorizontal: 5 }} onPress={onPress}>
				<CustomText containerStyle={{ width: 190 }} title>
					<Text style={{ fontWeight: '600' }}>{product?.quantity} </Text>
					{product?.productName}
					{'\n'}
					<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
				</CustomText>

				<CustomText label={`${product?.aisleCode || ''} ${product?.memo ? '- ' + product?.memo : ''}`} />
			</TouchableOpacity>

			<Button
				style={{ height: 30, alignSelf: 'flex-end' }}
				labelStyle={{ fontSize: 8 }}
				mode='contained'
				compact
				onPress={handleDelete}>
				delete
			</Button>
			<Modal visible={viewImage} transparent={true} onRequestClose={() => setViewImage(false)}>
				<ImageViewer
					imageUrls={image}
					renderIndicator={() => null}
					onSwipeDown={() => setViewImage(false)}
					enableSwipeDown
					backgroundColor='white'
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 90,
		height: 90,
	},
});

export default UnsavedItem;
