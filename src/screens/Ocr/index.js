import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { useStateValue } from '../../context';
import { Header as HeaderComponent, SelectStore } from '../../components';
import { readData } from '../../utils/asyncStorage';
import Ocr from './components/Ocr';

const OCR = ({ navigation }) => {
	const { colors } = useTheme();
	const [{ store, isLoading }, dispatch] = useStateValue();

	useEffect(() => {
		const getStoreInAsyncStorage = async () => {
			// Fix this using Promise.all, not able to fetch when store and unsave and concurrent
			const store = await readData('store');
			if (store) {
				dispatch({ type: 'setStore', value: store });
			}

			const unsaved = await readData('unsaved');
			if (unsaved) {
				dispatch({ type: 'setUnsaved', value: unsaved });
			}
			dispatch({ type: 'isLoading', value: false });
		};

		getStoreInAsyncStorage();
	}, []);

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{isLoading ? (
				<ActivityIndicator style={{ flex: 1 }} />
			) : store ? (
				<>
					{/* <HeaderComponent store={store} colors={colors} navigation={navigation} /> */}
					<Ocr />
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

export default OCR;
