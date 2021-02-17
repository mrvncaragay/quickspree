import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Snackbar } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useStateValue } from '../../../context';
import { storeData } from '../../../utils/asyncStorage';
import { pageCrawler } from '../../../../config';
import axios from 'axios';

const EditUnsaved = ({ route }) => {
	const [{ unsaved, store, dimensions }, dispatch] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [pulling, setPulling] = useState(false);
	const [images, setImages] = useState(product.urls.map((url) => ({ url })));
	const [productImages, setProductImages] = useState(product.urls);
	const [viewImage, setViewImage] = useState(false);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});

	const handleSave = async () => {
		const copyUnsaved = [...unsaved];

		const unsave = copyUnsaved.filter((data) => data.id !== product.id);

		await storeData('unsaved', [...unsave, product]);
		dispatch({ type: 'setUnsaved', value: [...unsave, { ...product, urls: productImages }] });

		setVisible({
			status: 'true',
			message: 'Successfully save.',
		});
	};

	const handleFindImage = async () => {
		setPulling(true);
		const response = await axios.get(pageCrawler(store.name, product.productName));
		if (response.data?.urls) {
			setImages(response.data.urls.map((url) => ({ url: url.replace('197x', '697x') })));
		}
		setPulling(false);
	};

	const handleSelectedImage = (imgIndex) => {
		if (productImages.includes(images[imgIndex].url)) {
			return;
		} else {
			setProductImages([...productImages, images[imgIndex].url]);
		}
	};

	const handlePrimaryImage = (imgIndex) => {
		setViewImage(false);
		const newPrimaryUrl = images[imgIndex].url;
		const oldPrimaryUrl = productImages[0];
		productImages[0] = newPrimaryUrl;
		productImages[imgIndex] = oldPrimaryUrl;
		setImages(productImages.map((url) => ({ url })));
	};

	return (
		<KeyboardAwareScrollView>
			<View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
				<View style={{ height: 200, justifyContent: 'center' }}>
					{pulling ? (
						<ActivityIndicator style={{ alignSelf: 'center', height: 200 }} />
					) : images.length > 0 ? (
						<TouchableWithoutFeedback onPress={() => setViewImage(true)}>
							<Image style={{ alignSelf: 'center', height: 180, width: 180 }} source={{ uri: images[0].url }} />
						</TouchableWithoutFeedback>
					) : (
						<Image
							style={{ alignSelf: 'center', height: 120, width: 120 }}
							source={require('../../../../assets/camera/noImage.png')}
						/>
					)}
				</View>
				<TextInput
					multiline
					style={styles.input}
					mode='outlined'
					dense
					label='Product name'
					value={product.productName}
					onChangeText={(productName) => setProduct({ ...product, productName })}
				/>
				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Aisle code'
					value={product.aisleCode}
					onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Quantity'
					value={product.quantity}
					onChangeText={(quantity) => setProduct({ ...product, quantity })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Size'
					value={product.size}
					onChangeText={(size) => setProduct({ ...product, size })}
				/>

				<Button
					disabled={product.urls.length > 0}
					labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
					style={{
						marginTop: 10,
						padding: 5,
					}}
					mode='contained'
					onPress={handleFindImage}>
					Find Image
				</Button>

				<Button
					labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
					style={{
						marginTop: 10,
						padding: 5,
					}}
					mode='contained'
					onPress={handleSave}>
					Save
				</Button>
			</View>
			<Modal visible={viewImage} transparent={true} onRequestClose={() => setViewImage(false)}>
				<ImageViewer
					imageUrls={images.length > 0 ? images : []}
					onSwipeDown={() => setViewImage(false)}
					enableSwipeDown
					backgroundColor='white'
					renderFooter={(index) => (
						<Button
							disabled={
								product.urls.length > 0
									? index === 0
										? true
										: false
									: productImages.includes(images[index].url)
									? true
									: false
							}
							labelStyle={{ textTransform: 'capitalize', width: dimensions.width }}
							style={{
								marginTop: 10,
								padding: 5,
							}}
							mode='contained'
							onPress={() => (product.urls.length > 0 ? handlePrimaryImage(index) : handleSelectedImage(index))}>
							Select
						</Button>
					)}
				/>
			</Modal>
			<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 5,
	},
});
export default EditUnsaved;
