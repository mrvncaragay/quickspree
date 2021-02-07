import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Platform, Modal, TouchableOpacity, Text } from 'react-native';
import { Divider, useTheme, IconButton, Checkbox, Button, TextInput } from 'react-native-paper';
import { useStateValue } from '../../context';
import { storeData } from '../../utils/asyncStorage';
import ImageViewer from 'react-native-image-zoom-viewer';
import { saveBatchDataToDB } from '../../firebase';

const ImageContainer = ({ navigation, url, productName, setUrls, checkedUrls, disabledUrls }) => {
	const [{ unsaved }, dispatch] = useStateValue();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const [checked, setChecked] = useState(false);
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

	const handleCheckImage = () => {
		if (!checked) {
			setUrls([...checkedUrls, url]);
		} else {
			setUrls(checkedUrls.filter((link) => link !== url));
		}

		setChecked(!checked);
	};

	return (
		<View
			style={{
				alignItems: 'center',
				flexDirection: 'row',
				padding: 20,
				backgroundColor: '#fff',
			}}>
			<View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 50 }}>
				<Checkbox
					disabled={disabledUrls.includes(url)}
					color='green'
					uncheckedColor='red'
					status={checked ? 'checked' : 'unchecked'}
					onPress={handleCheckImage}
				/>
			</View>
			<TouchableOpacity onPress={() => setViewImage(true)}>
				<Image
					style={styles.small}
					source={Platform.OS === 'ios' ? { url: url.toLowerCase() } : { uri: url.toLowerCase() }}
				/>
			</TouchableOpacity>

			<IconButton
				style={{ marginLeft: 'auto' }}
				icon='chevron-right'
				color={colors.primary}
				size={24}
				onPress={updateUnsavedImage}
			/>
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
	const [form, setForm] = useState({
		brand: '',
		category: '',
	});
	const [checkedUrls, setCheckedUrls] = useState([]);
	const [disabledCheckedUrls, setDisabledCheckedUrls] = useState([]);

	const handleUploadCheckedUrls = async () => {
		await saveBatchDataToDB(checkedUrls, `urls/${form.brand.toLowerCase()}/${form?.category.toLowerCase() || ''}`);

		setDisabledCheckedUrls([...disabledCheckedUrls, ...checkedUrls]);
		setCheckedUrls([]);
	};

	return (
		<>
			<Text style={{ padding: 10, backgroundColor: '#fff', fontWeight: '600' }}>{id}</Text>
			<View style={{ flexDirection: 'row' }}>
				<TextInput
					placeholder='Brand name...'
					style={{ flex: 1, backgroundColor: '#fff' }}
					onChangeText={(brand) =>
						setForm({
							...form,
							brand,
						})
					}
				/>
				<TextInput
					placeholder='Category...'
					style={{ flex: 1, backgroundColor: '#fff' }}
					onChangeText={(category) =>
						setForm({
							...form,
							category,
						})
					}
				/>
			</View>

			<FlatList
				contentContainerStyle={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
				showsHorizontalScrollIndicator={true}
				data={urls}
				renderItem={({ item, index }) => (
					<ImageContainer
						navigation={navigation}
						key={index}
						url={item}
						productName={id}
						disabledUrls={disabledCheckedUrls}
						setUrls={setCheckedUrls}
						checkedUrls={checkedUrls}
					/>
				)}
				keyExtractor={(item, index) => index.toString()}
				ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
			/>

			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
				<Button style={{ alignSelf: 'center', marginVertical: 10 }} mode='contained'>
					Search
				</Button>
				<Button style={{ alignSelf: 'center', marginVertical: 10 }} mode='contained' onPress={handleUploadCheckedUrls}>
					Save
				</Button>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 140,
		height: 140,
	},
});

export default ImageSelect;
