import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, ActivityIndicator, Button, useTheme, Caption, Text, Divider } from 'react-native-paper';
import { Header, Store, SelectStore } from '../../components';
import { useStateValue } from '../../context';
import firebase from '../../firebase';

const Product = ({ product, onPress }) => {
	const { colors } = useTheme();
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				style={{
					flex: 1,
					backgroundColor: 'white',
					padding: 10,
					height: 'auto',
					borderWidth: 1,
					borderColor: 'gray',
				}}
			>
				<Caption style={{ lineHeight: 12 }}>
					Product: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.productName}</Text>
				</Caption>
				<Caption style={{ lineHeight: 12 }}>
					Aisle: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.aisleName}</Text>
				</Caption>
				<Caption style={{ lineHeight: 12 }}>
					Memo: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.memo}</Text>
				</Caption>
			</View>
		</TouchableOpacity>
	);
};
const Locate = ({ navigation }) => {
	const { colors } = useTheme();
	const [{ store }] = useStateValue();
	const [search, setSearch] = useState();
	const [product, setProduct] = useState(null);
	const [products, setProducts] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = () => {
		if (!search) return;
		setLoading(true);
		const productRef = firebase.database().ref(`products`);

		productRef
			.orderByKey()
			.startAt(search.toLowerCase())
			.endAt(`${search.toLowerCase()}\uf8ff`)
			.once('value', (snapshot) => {
				const dbProducts = snapshot.val();
				const data = [];

				for (let key in dbProducts) {
					if (dbProducts[key][`${store.name}-${store.storeNumber}`]) {
						data.push(dbProducts[key][`${store.name}-${store.storeNumber}`]);
					}
				}

				setProducts(data);
				setProduct(null);
			});
		setLoading(false);
	};

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{store ? (
				<>
					<Header store={store} colors={colors} navigation={navigation} />
					<Store store={store} product={product} />

					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 20,
							paddingTop: 5,
							alignItems: 'center',
							backgroundColor: 'white',
						}}
					>
						<TextInput
							style={{ flex: 1 }}
							mode='outlined'
							dense
							label='Search a product...'
							value={search}
							onChangeText={(query) => setSearch(query)}
						/>

						<Button
							style={{ height: 43, marginLeft: 5, justifyContent: 'center', top: 3 }}
							mode='contained'
							onPress={handleSubmit}
						>
							{loading ? <ActivityIndicator animating color='white' /> : 'Find'}
						</Button>
					</View>

					<FlatList
						style={{ paddingHorizontal: 20, marginTop: 10 }}
						showsHorizontalScrollIndicator={true}
						data={products}
						renderItem={({ item, index }) => <Product product={item} onPress={() => setProduct(item)} />}
						keyExtractor={(item) => item.productName.toString()}
						ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
					/>
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
});

export default Locate;
