import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { SelectStore, Store, BarCodeScanner, Camera } from '../../../components';
import { storeData } from '../../../utils/asyncStorage';
import { useRoute } from '@react-navigation/native';

const initialData = {
	aisleType: '',
	aisleName: '',
	location: {
		x: 200,
		y: 150,
	},
	productName: '',
	memo: '',
};

const Ocr = ({ navigation }) => {
	const route = useRoute();
	const [{ store, unsaved }, dispatch] = useStateValue();
	const [product, setProduct] = useState(initialData);

	const handleSubmit = async (products) => {
		let unsavedData = [...products, ...unsaved];

		await storeData('unsaved', unsavedData);
		dispatch({ type: 'setUnsaved', value: unsavedData });
		setProduct(initialData);
	};

	return <Camera onRead={handleSubmit} product={initialData} />;
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

export default Ocr;
