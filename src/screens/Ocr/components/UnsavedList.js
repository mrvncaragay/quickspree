import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { removeData, storeData } from '../../../utils/asyncStorage';
import UnsavedItem from './UnsavedItem';
import { pageCrawler } from '../../../../config';
import axios from 'axios';
import firebase, { getASingleProductFromDB, saveProductToDB } from '../../../firebase';

const UnsavedList = ({ navigation }) => {
	const [{ unsaved, store }, dispatch] = useStateValue();
	const [uploading, setUploading] = useState(false);
	const colors = useTheme();

	const handleClearAllUnsaved = () => {
		dispatch({ type: 'setUnsaved', value: [] });
		removeData('unsaved');
	};

	const handleFetchImageItems = async () => {
		setUploading(true);
		const copyUnsaved = [...unsaved];
		const newUnsaved = [];
		const noUnsavedImage = [];
		// check first the db if the product exist, so that we dont search for it
		for (let i = 0; i < copyUnsaved.length; i++) {
			const product = await getASingleProductFromDB(`products/${copyUnsaved[i].productName.toLowerCase()}`);

			if (product) {
				newUnsaved.push(product);
			} else {
				noUnsavedImage.push(copyUnsaved[i]);
			}
		}

		// search product that does not have image
		for (let i = 0; i < noUnsavedImage.length; i++) {
			const response = await axios.get(pageCrawler(store.name, noUnsavedImage[i].productName));
			if (response.data?.urls) {
				newUnsaved.push({ ...noUnsavedImage[i], images: response.data.urls.map((url) => url.replace('197x', '697x')) });
			}
		}

		storeData('unsaved', newUnsaved);
		dispatch({ type: 'setUnsaved', value: newUnsaved });
		setUploading(false);
	};

	const handleSaveItemsToDB = async () => {
		setUploading(true);
		const batchRef = firebase.database().ref('batch/');
		unsaved.forEach(async (item) => {
			batchRef.push().set(item, (error) => {
				if (error) {
					console.log(error);
				} else {
					removeData('unsaved');
					dispatch({ type: 'setUnsaved', value: [] });
				}
			});
		});
		setUploading(false);
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center' }}>
			{uploading ? (
				<ActivityIndicator size='large' />
			) : (
				<>
					<FlatList
						style={{ marginTop: 10 }}
						data={unsaved}
						renderItem={({ item, index }) => (
							<UnsavedItem
								product={item}
								onPress={() => navigation.navigate('EditUnsaved', { product: item, index })}
							/>
						)}
						keyExtractor={(_, index) => index.toString()}
						ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
					/>
					{unsaved.length > 0 && (
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<Button
								style={{ alignSelf: 'flex-end', marginVertical: 10, backgroundColor: 'firebrick' }}
								mode='contained'
								onPress={handleClearAllUnsaved}>
								Clear
							</Button>

							<Button
								style={{ alignSelf: 'flex-end', marginVertical: 10, marginLeft: 10 }}
								mode='contained'
								onPress={handleFetchImageItems}>
								Fetch Images
							</Button>

							<Button
								color={colors.primary}
								style={{ alignSelf: 'flex-end', marginVertical: 10, marginLeft: 10 }}
								mode='contained'
								onPress={handleSaveItemsToDB}>
								SEND
							</Button>
						</View>
					)}
				</>
			)}
		</View>
	);
};

export default UnsavedList;
