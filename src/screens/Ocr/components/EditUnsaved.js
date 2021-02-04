import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import { Snackbar } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStateValue } from '../../../context';
import { storeData } from '../../../utils/asyncStorage';

const EditUnsaved = ({ navigation, route }) => {
	const [{ unsaved }, dispatch] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});
	const { colors } = useTheme();

	const handleSave = async () => {
		const unsave = unsaved.map((data, index) => {
			if (index === route.params.index) {
				return product;
			} else {
				return data;
			}
		});

		dispatch({ type: 'setUnsaved', value: unsave });
		storeData('unsaved', unsave);

		setVisible({
			status: 'true',
			message: 'Successfully save.',
		});

		setTimeout(() => navigation.goBack(), 500);
	};

	return (
		<KeyboardAwareScrollView>
			<View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
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
					label='Aisle code'
					value={product.aisleCode}
					onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Quantity'
					value={product.quantity}
					onChangeText={(quantity) => setProduct({ ...product, quantity })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Size'
					value={product.size}
					onChangeText={(size) => setProduct({ ...product, size })}
				/>

				<Button
					labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
					style={{
						marginTop: 10,
						padding: 5,
						backgroundColor: colors.primary,
					}}
					mode='contained'
					onPress={handleSave}>
					Save
				</Button>
			</View>
			<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
		</KeyboardAwareScrollView>
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
