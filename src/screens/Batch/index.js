import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { useStateValue } from '../../context';
import { Header as HeaderComponent, SelectStore, Store } from '../../components';
import { readData } from '../../utils/asyncStorage';
import TopTabNavigator from '../../navigations/TopTabNavigator';
import firebase from '../../firebase';

const initialData = {
	aisleType: '',
	aisleName: '',
	location: '',
	productName: '',
	description: '',
};

const Batch = ({ navigation }) => {
	const { colors } = useTheme();
	const [{ store }, dispatch] = useStateValue();

	const [product, setProduct] = React.useState(initialData);

	// const [loading, setLoading] = useState(false);
	// const [errorLocation, setErrorLocation] = useState(false);

	// const handleSubmit = () => {
	// 	const { aisleType, aisleName, location, productName } = product;
	// 	if (!aisleType || !aisleName || !location || !productName) return;

	// 	setLoading(true);
	// 	const productRef = firebase.database().ref(`products/${product.productName.toLowerCase()}`);

	// 	const updatedProduct = {
	// 		...product,
	// 		location: aisleCoordinates[product.aisleType][product.location],
	// 	};
	// 	productRef.child(`${store.name}-${store.storeNumber}`).set(updatedProduct, (error) => {
	// 		if (error) {
	// 			console.log(error);
	// 		} else {
	// 			setLoading(false);
	// 			setProduct(initialData);
	// 		}
	// 	});
	// };

	useEffect(() => {
		const getStoreInAsyncStorage = async () => {
			const store = await readData('store');

			if (store) {
				dispatch({ type: 'setStore', value: store });
			}
		};

		getStoreInAsyncStorage();
	}, []);

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{store ? (
				<>
					<HeaderComponent store={store} colors={colors} navigation={navigation} />
					<Store store={store} product={product} />

					<View style={{ flex: 1, backgroundColor: 'white' }}>
						<TopTabNavigator />
					</View>
				</>
			) : (
				<SelectStore colors={colors} navigation={navigation} />
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

export default Batch;
