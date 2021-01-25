import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, IconButton, useTheme } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { Store, Camera } from '../../../components';
import { storeData } from '../../../utils/asyncStorage';
import firebase from '../../../firebase';

const EditUnsaved = ({ navigation, route }) => {
	const { colors } = useTheme();
	const [{ store, unsaved }, dispatch] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [scan, setScan] = useState(false);
	const [active, setActive] = useState({
		status: false,
		index: null,
	});

	const handleSubmit = async () => {
		const { aisleType, aisleName, location, productName, size, barcode } = product;
		if (!aisleType || !aisleName || !location || !productName || !size || !barcode) return;

		const productRef = firebase.database().ref(`products/${product.productName.toLowerCase()}`);

		productRef.child(`${store.name}-${store.storeNumber}`).set(product, async (error) => {
			if (error) {
				console.log(error);
			} else {
				let unsavedData = unsaved.filter((_, index) => index !== route.params.index);

				await storeData('unsaved', unsavedData);
				dispatch({ type: 'setUnsaved', value: unsavedData });
				navigation.goBack();
			}
		});
	};

	const handleBarcodeScan = (info) => {
		if (info) {
			setProduct({
				...product,
				barcode: info.data,
			});
			setScan(!scan);
		}
	};

	const handleLocation = (coord) => {
		setProduct({
			...product,
			location: coord,
		});
	};

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{!scan ? (
				<>
					<Store store={store} product={product} handleLocation={handleLocation} isForm />

					<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
						<ScrollView style={{ marginTop: 5 }}>
							<View
								style={{
									marginTop: 5,
									flexDirection: 'row',
									flexWrap: 'wrap',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								{[
									{ label: 'Aisle', value: 'aisle1' },
									{ label: 'Produce', value: 'produce' },
									{ label: 'Dairy', value: 'dairy' },
									{ label: 'Meat', value: 'meat' },
									{ label: 'Deli', value: 'deli' },
									{ label: 'Bakery', value: 'bakery' },
								].map((aisle, i) => (
									<Button
										mode={active.status && active.index === i ? 'contained' : 'outlined'}
										dark
										key={i}
										compact
										labelStyle={{ fontSize: 10, color: active.status && active.index === i ? 'white' : 'gray' }}
										onPress={() => {
											if (product.aisleType === aisle.value) return;

											setActive({
												status: true,
												index: i,
											});
											setProduct({ ...product, aisleType: aisle.value });
										}}>
										{aisle.label}
									</Button>
								))}
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
								label='Aisle'
								value={product?.aisleName || ''}
								onChangeText={(aisleName) => setProduct({ ...product, aisleName })}
							/>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<TextInput
									style={[styles.input, { width: '85%' }]}
									mode='outlined'
									dense
									label='Barcode...'
									disabled
									value={product.barcode}
								/>

								<IconButton
									style={{ position: 'relative', top: 5 }}
									icon='barcode-scan'
									size={30}
									color={colors.primary}
									onPress={() => setScan(true)}
								/>
							</View>

							<TextInput
								style={styles.input}
								mode='outlined'
								dense
								label='Size'
								value={product.size}
								onChangeText={(size) => setProduct({ ...product, size })}
							/>
							<TextInput
								style={styles.input}
								mode='outlined'
								label='Memo (optional)'
								dense
								numberOfLines={3}
								value={product.memo}
								onChangeText={(memo) => setProduct({ ...product, memo })}
							/>

							<Button
								disabled={product.aisleName && product.aisleType ? false : true}
								style={{ marginTop: 15, padding: 5 }}
								mode='contained'
								onPress={handleSubmit}>
								Save
							</Button>
						</ScrollView>
					</View>
				</>
			) : (
				<Camera handleBarcodeScan={handleBarcodeScan} />
			)}
		</View>
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
