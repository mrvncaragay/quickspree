import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { useStateValue } from '../../context';
import { Header as HeaderComponent, SelectStore, Store, BarCodeScanner } from '../../components';
import { aisleCoordinates } from '../../utils/sectionCoordinates';
import DropDownPicker from 'react-native-dropdown-picker';
import { readData } from '../../utils/asyncStorage';
import firebase from '../../firebase';

const initialData = {
	aisleType: '',
	aisleName: '',
	location: '',
	productName: '',
	description: '',
};

const Content = ({ navigation }) => {
	const { colors } = useTheme();
	const [{ store }, dispatch] = useStateValue();
	const [product, setProduct] = React.useState(initialData);
	const [scan, setScan] = React.useState(false);

	const [loading, setLoading] = useState(false);
	const [errorLocation, setErrorLocation] = useState(false);

	const handleSubmit = () => {
		const { aisleType, aisleName, location, productName } = product;
		if (!aisleType || !aisleName || !location || !productName) return;

		setLoading(true);
		const productRef = firebase.database().ref(`products/${product.productName.toLowerCase()}`);

		const updatedProduct = {
			...product,
			location: aisleCoordinates[product.aisleType][product.location],
		};
		productRef.child(`${store.name}-${store.storeNumber}`).set(updatedProduct, (error) => {
			if (error) {
				console.log(error);
			} else {
				setLoading(false);
				setProduct(initialData);
			}
		});
	};

	return (
		<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
			<ScrollView style={{ marginTop: 5 }}>
				<DropDownPicker
					items={[
						{ label: 'Vertical', value: 'vertical', hidden: true },
						{ label: 'Horizontal', value: 'horizontal' },
						{ label: 'Produce', value: 'produce' },
						{ label: 'Dairy', value: 'dairy' },
						{ label: 'Meat', value: 'meat' },
						{ label: 'Deli', value: 'deli' },
						{ label: 'Bakery', value: 'bakery' },
					]}
					defaultValue={product.aisleTypeaisle}
					containerStyle={{ height: 54 }}
					style={{ backgroundColor: 'white', marginTop: 10, borderColor: 'gray' }}
					itemStyle={{
						justifyContent: 'flex-start',
					}}
					labelStyle={{ color: colors.primary }}
					dropDownStyle={{ backgroundColor: 'white' }}
					onChangeItem={(data) => setProduct({ ...product, aisleType: data.value })}
					placeholder='Aisle type'
				/>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<TextInput
						style={[styles.input, { width: '49%' }]}
						mode='outlined'
						dense
						label='Aisle name'
						value={product.aisleName}
						onChangeText={(aisleName) => setProduct({ ...product, aisleName })}
					/>

					<TextInput
						style={[styles.input, { width: '49%' }]}
						mode='outlined'
						dense
						disabled={!product.aisleType ? true : false}
						label='Location'
						error={errorLocation}
						value={product.location}
						onChangeText={(location) => {
							const coord = aisleCoordinates[product.aisleType][location];
							!coord ? setErrorLocation(true) : setErrorLocation(false);
							setProduct({
								...product,
								location,
							});
						}}
					/>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<TextInput
						style={[styles.input, { width: '85%' }]}
						mode='outlined'
						dense
						label='Barcode...'
						disabled
						value={product.aisleName}
						onChangeText={(aisleName) => setProduct({ ...product, aisleName })}
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
					label='Product name'
					value={product.productName}
					onChangeText={(productName) => setProduct({ ...product, productName })}
				/>
				<TextInput
					style={styles.input}
					mode='outlined'
					label='Description (optional)'
					multiline
					numberOfLines={3}
					value={product.description}
					onChangeText={(description) => setProduct({ ...product, description })}
				/>

				<Button style={{ marginTop: 15, padding: 5 }} mode='contained' onPress={handleSubmit}>
					{loading ? <ActivityIndicator animating color='white' /> : 'Save'}
				</Button>
			</ScrollView>
			<BarCodeScanner />
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

export default Content;
