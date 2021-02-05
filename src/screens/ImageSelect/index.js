import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Platform, Modal, TouchableOpacity } from 'react-native';
import { Divider, useTheme, IconButton } from 'react-native-paper';
import { useStateValue } from '../../context';
import { storeData } from '../../utils/asyncStorage';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageContainer = ({ navigation, url, productName }) => {
	const [{ unsaved }, dispatch] = useStateValue();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const image = [{ url }];

	const updateUnsavedImage = async () => {
		let newUnsaved = unsaved.map((p) => {
			if (p.productName === productName) {
				let product = { ...p };
				delete product.images;
				return { ...product, uri: url };
			} else {
				return p;
			}
		});

		dispatch({ type: 'setUnsaved', value: newUnsaved });
		await storeData('unsaved', newUnsaved);
		navigation.goBack();
	};

	return (
		<View
			style={{
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row',
				padding: 20,
				backgroundColor: '#fff',
			}}>
			<TouchableOpacity onPress={() => setViewImage(true)}>
				<Image
					style={styles.small}
					source={Platform.OS === 'ios' ? { url: url.toLowerCase() } : { uri: url.toLowerCase() }}
				/>
			</TouchableOpacity>

			<IconButton icon='chevron-right' color={colors.primary} size={24} onPress={updateUnsavedImage} />
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

const ImageSelect = ({ route, navigation }) => {
	const { urls, id } = route.params;

	return (
		<FlatList
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={urls}
			renderItem={({ item, index }) => (
				<ImageContainer navigation={navigation} key={index} url={item} productName={id} />
			)}
			keyExtractor={(item, index) => index.toString()}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 140,
		height: 140,
	},
});

export default ImageSelect;
