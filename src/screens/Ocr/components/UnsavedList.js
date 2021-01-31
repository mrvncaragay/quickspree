import React from 'react';
import { View, FlatList } from 'react-native';
import { Button, Divider, useTheme } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { removeData } from '../../../utils/asyncStorage';
import { ProductItem } from '../../../components';
import firebase from '../../../firebase';

const savingUnsavePromise = (unsaved) => {
	const storeRef = firebase.database().ref(`batch`);

	return new Promise((resolve, reject) => {
		unsaved.forEach((item) => {
			storeRef.push().set(item, async (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	});
};

const Unsaved = ({ navigation }) => {
	const [{ unsaved }, dispatch] = useStateValue();
	const colors = useTheme();

	const handleClearAllUnsaved = () => {
		dispatch({ type: 'setUnsaved', value: [] });
		removeData('unsaved');
	};

	const handleSaveItemsToDB = async () => {
		await savingUnsavePromise(unsaved);

		await removeData('unsaved');
		dispatch({ type: 'setUnsaved', value: [] });
	};

	console.log(unsaved);
	return (
		<View style={{ flex: 1, paddingHorizontal: 20 }}>
			<FlatList
				style={{ marginTop: 10 }}
				data={unsaved}
				renderItem={({ item, index }) => (
					<ProductItem product={item} onPress={() => navigation.navigate('EditUnsaved', { product: item, index })} />
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
						color={colors.primary}
						style={{ alignSelf: 'flex-end', marginVertical: 10, marginLeft: 10 }}
						mode='contained'
						onPress={handleSaveItemsToDB}>
						SEND
					</Button>
				</View>
			)}
		</View>
	);
};

export default Unsaved;
