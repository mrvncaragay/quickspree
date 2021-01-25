import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useTheme, Button, Divider, Caption, IconButton } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { storeData, removeData } from '../../../utils/asyncStorage';
import firebase from '../../../firebase';
import THEME from '../../../theme';
import { ProductItem } from '../../../components';

// const UnsavedItem = ({ product, store, idx, navigation }) => {
// 	const { colors } = useTheme();
// 	const [{ unsaved }, dispatch] = useStateValue();

// 	const handleRemoveUnsaved = async () => {
// 		const unusedArr = unsaved.filter((product, index) => {
// 			return index !== idx;
// 		});

// 		dispatch({ type: 'setUnsaved', value: unusedArr });
// 		await storeData('unsaved', unusedArr);
// 	};

// 	const handleEditUnsaved = () => {
// 		navigation.jumpTo('Add', { product: { index: idx } });
// 	};

// 	const saveUnsavedToDB = () => {
// 		const productRef = firebase.database().ref(`products/${product.productName.toLowerCase()}`);

// 		productRef.child(`${store.name}-${store.storeNumber}`).set(product, (error) => {
// 			if (error) {
// 				console.log(error);
// 			} else {
// 				handleRemoveUnsaved();
// 			}
// 		});
// 	};

// 	return (
// 		<View style={styles.container}>
// 			<Caption style={{ fontSize: 12 }}>
// 				Product: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.productName}</Text>
// 			</Caption>
// 			<Caption style={{ fontSize: 12 }}>
// 				Aisle: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.aisleName}</Text>
// 			</Caption>
// 			<Caption style={{ fontSize: 12 }}>
// 				Memo: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.memo}</Text>
// 			</Caption>

// 			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
// 				<IconButton icon='content-save-outline' color={colors.primary} size={20} onPress={saveUnsavedToDB} />
// 				<IconButton icon='pencil-outline' color={colors.primary} size={20} onPress={handleEditUnsaved} />
// 				<IconButton icon='trash-can-outline' color={colors.primary} size={20} onPress={handleRemoveUnsaved} />
// 			</View>
// 		</View>
// 	);
// };

const Unsaved = ({ navigation }) => {
	const [{ unsaved }, dispatch] = useStateValue();

	const handleClearAllUnsaved = () => {
		dispatch({ type: 'setUnsaved', value: [] });
		removeData('unsaved');
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 20 }}>
			{unsaved.length > 0 && (
				<Button
					style={{ alignSelf: 'flex-end', marginVertical: 10, backgroundColor: 'firebrick' }}
					mode='contained'
					onPress={handleClearAllUnsaved}>
					Clear
				</Button>
			)}

			<FlatList
				showsHorizontalScrollIndicator={true}
				data={unsaved}
				renderItem={({ item }) => (
					<ProductItem product={item} onPress={() => navigation.navigate('EditUnsaved', { product: item })} />
				)}
				keyExtractor={(_, index) => index.toString()}
				ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		paddingBottom: 0,
		height: 'auto',
		borderWidth: 1,
		borderColor: THEME.colors.primary,
		justifyContent: 'center',
	},
});

export default Unsaved;
