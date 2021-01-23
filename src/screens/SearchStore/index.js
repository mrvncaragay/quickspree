import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, TextInput, TouchableRipple, IconButton, useTheme } from 'react-native-paper';
import { useStateValue } from '../../context';
import { storeData } from '../../utils/asyncStorage';
import firebase from '../../firebase';

const Store = ({ store, navigation }) => {
	const [_, dispatch] = useStateValue();
	const { colors } = useTheme();
	return (
		<TouchableRipple
			onPress={() => {
				dispatch({ type: 'setStore', value: store });
				storeData('store', store);
				navigation.goBack();
			}}
		>
			<Surface style={styles.store}>
				<View>
					<Text>{`${store.city}, ${store.state}`}</Text>
					<Text style={{ color: 'gray' }}>{`${store.name} - #${store.storeNumber}`}</Text>
				</View>

				<IconButton
					icon='chevron-right'
					color={colors.primary}
					size={24}
					onPress={() => navigation.navigate('SearchStore')}
				/>
			</Surface>
		</TouchableRipple>
	);
};

const SearchStore = ({ navigation }) => {
	const [stores, setStores] = useState([]);

	useEffect(() => {
		const citiesRef = firebase.database().ref('stores');
		citiesRef.on('value', (snapshot) => {
			const dbStores = snapshot.val();
			const storeState = [];

			for (let id in dbStores) {
				storeState.push(dbStores[id]);
			}

			setStores(storeState);
		});
	}, []);

	return (
		<View style={styles.container}>
			<TextInput style={{ marginBottom: 10 }} mode='outlined' placeholder='Enter ZIP, city, or store number...' />
			<FlatList
				showsHorizontalScrollIndicator={true}
				data={stores}
				initialNumToRender={6}
				windowSize={3}
				renderItem={({ item, index }) => <Store navigation={navigation} store={item} />}
				keyExtractor={(_, index) => 'listing' + index}
				ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},

	store: {
		height: 60,
		elevation: 2,
		margin: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		padding: 15,
		paddingRight: 0,
	},
});

export default SearchStore;
