import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Platform, Modal, TouchableOpacity } from 'react-native';
import { Divider, useTheme, IconButton, Checkbox, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useStateValue } from '../../context';
import { storeData } from '../../utils/asyncStorage';
import ImageViewer from 'react-native-image-zoom-viewer';
import { saveBatchDataToDB, searchImagesFromDB } from '../../firebase';
import { pageCrawler } from '../../../config';
import axios from 'axios';

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
	const [{ store }] = useStateValue();
	const [pulling, setPulling] = useState(false);
	const [urls, setUrls] = useState([]);
	const [pulledUrls, setPulledUrls] = useState([]);
	const [form, setForm] = useState({
		productName: route.params.id,
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

	const handlePullImage = async () => {
		setPulling(true);
		setUrls([]);
		const response = await axios.get(pageCrawler(store.name, form.productName));
		if (response.data?.urls) {
			setPulledUrls(response.data.urls.map((url) => url.replace('197x', '697x')));
		}
		setPulling(false);
	};

	const handleSearchImage = async () => {
		setPulledUrls([]);
		if (!form.brand) return;

		const urls = await searchImagesFromDB(`urls/${form.brand.toLowerCase()}/${form?.category.toLowerCase() || ''}`);
		setUrls(urls);
	};

	const handleDeleteImage = async () => {
		if (!checkedUrls.length) return;

		const newUrls = urls.filter((u) => {
			if (!checkedUrls.includes(u.url)) {
				return u;
			}
		});
		// const urls = await searchImagesFromDB(`urls/${form.brand.toLowerCase()}/${form?.category.toLowerCase() || ''}`);
		setUrls(newUrls);
		setDisabledCheckedUrls([]);
	};

	const handleClear = async () => {
		setPulledUrls([]);
		setUrls([]);
		setForm({
			productName: route.params.id,
			brand: '',
			category: '',
		});
	};

	return (
		<>
			<TextInput
				placeholder='Product name...'
				style={{ backgroundColor: '#fff' }}
				value={form.productName}
				onChangeText={(productName) =>
					setForm({
						...form,
						productName,
					})
				}
			/>
			<View style={{ flexDirection: 'row' }}>
				<TextInput
					placeholder='Brand name...'
					style={{ flex: 1, backgroundColor: '#fff' }}
					value={form.brand}
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
					value={form.category}
					onChangeText={(category) =>
						setForm({
							...form,
							category,
						})
					}
				/>
			</View>

			{pulling ? (
				<ActivityIndicator size='large' />
			) : (
				<FlatList
					contentContainerStyle={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
					showsHorizontalScrollIndicator={true}
					data={pulledUrls.length > 0 ? pulledUrls : urls.map((data) => data.url)}
					renderItem={({ item, index }) => (
						<ImageContainer
							navigation={navigation}
							key={index}
							url={item}
							productName={route.params.id}
							disabledUrls={disabledCheckedUrls}
							setUrls={setCheckedUrls}
							checkedUrls={checkedUrls}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
					ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
				/>
			)}
			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
				<Button style={{ alignSelf: 'center', marginVertical: 10 }} mode='contained' onPress={handlePullImage}>
					Pull
				</Button>

				<Button
					color='darkred'
					style={{ alignSelf: 'center', marginVertical: 10 }}
					mode='contained'
					onPress={handleDeleteImage}>
					Delete
				</Button>

				<Button style={{ alignSelf: 'center', marginVertical: 10 }} mode='contained' onPress={handleSearchImage}>
					Search
				</Button>

				<Button style={{ alignSelf: 'center', marginVertical: 10 }} color='gray' mode='contained' onPress={handleClear}>
					clear
				</Button>

				<Button
					color='darkgreen'
					style={{ alignSelf: 'center', marginVertical: 10 }}
					mode='contained'
					onPress={handleUploadCheckedUrls}>
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
