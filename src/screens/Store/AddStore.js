import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import firebase from '../../firebase';

const AddStore = ({ navigation }) => {
	const [store, setStore] = useState({
		name: '',
		city: '',
		state: '',
		zipcode: '',
		storeNumber: null,
		hasAisleHelper: null,
	});

	const [loading, setLoading] = useState(false);

	const handleSubmit = () => {
		const { name, city, zipcode, storeNumber } = store;

		if (!name || !city || !zipcode || !storeNumber) return;

		setLoading(true);
		const storeRef = firebase.database().ref(`stores/${store.name}-${store.storeNumber}`);
		storeRef.set(store, (error) => {
			if (error) {
				console.log(error);
			} else {
				setLoading(false);
				navigation.goBack();
			}
		});
	};

	return (
		<View style={styles.container}>
			<Title style={{ alignSelf: 'center' }}>Create store</Title>
			<View style={styles.formContainer}>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='Name'
					value={store.name}
					onChangeText={(name) => setStore({ ...store, name })}
				/>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='City'
					value={store.city}
					onChangeText={(city) => setStore({ ...store, city })}
				/>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='State'
					value={store.state}
					onChangeText={(state) => setStore({ ...store, state })}
				/>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='Zipcode'
					value={store.zipcode}
					onChangeText={(zipcode) => setStore({ ...store, zipcode })}
				/>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='Store number'
					value={store.storeNumber}
					onChangeText={(storeNumber) => setStore({ ...store, storeNumber })}
				/>
				<TextInput
					style={{ marginVertical: 5 }}
					mode='outlined'
					label='Has aisle helper?'
					placeholder='True or false'
					value={store.hasAisleHelper}
					onChangeText={(hasAisleHelper) =>
						setStore({ ...store, hasAisleHelper: hasAisleHelper.toLowerCase() === 'true' })
					}
				/>

				<Button style={{ marginTop: 15, padding: 5 }} mode='contained' onPress={handleSubmit}>
					{loading ? <ActivityIndicator animating color='white' /> : 'Create'}
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	formContainer: {
		padding: 20,
	},
});

export default AddStore;
