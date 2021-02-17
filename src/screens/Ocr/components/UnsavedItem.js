import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStateValue } from '../../../context';
import { storeData } from '../../../utils/asyncStorage';

const UnsavedItem = ({ product }) => {
	const [{ unsaved }, dispatch] = useStateValue();
	const navigation = useNavigation();
	const { colors } = useTheme();

	const CustomText = ({ label, children, containerStyle }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={{ color: colors.backdrop }}>{label}</Text>
				<Text style={{ flex: 1, color: colors.dark600, fontSize: 16 }}>{children}</Text>
			</View>
		);
	};

	const handleDelete = async () => {
		const newUnsaved = unsaved.filter((p) => p.productName !== product.productName);

		await storeData('unsaved', newUnsaved);
		dispatch({ type: 'setUnsaved', value: newUnsaved });
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: 'white',
				height: 150,
				padding: 20,
				borderTopWidth: 1,
				borderColor: 'lightgray',
			}}>
			<Image
				style={styles.small}
				source={product.urls.length > 0 ? { uri: product.urls[0] } : require('../../../../assets/camera/noImage.png')}
			/>

			<TouchableOpacity
				style={{ flex: 1, width: 190, paddingHorizontal: 5 }}
				onPress={() => navigation.navigate('EditUnsaved', { product })}>
				<CustomText containerStyle={{ width: 190 }} title>
					<Text style={{ fontWeight: '600' }}>{product?.quantity} </Text>
					{product?.productName}
					{'\n'}
					<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
				</CustomText>

				<CustomText label={`${product?.aisleCode || ''} ${product?.memo ? '- ' + product?.memo : ''}`} />
			</TouchableOpacity>

			<Button
				style={{ height: 30, alignSelf: 'flex-end' }}
				labelStyle={{ fontSize: 8 }}
				mode='contained'
				compact
				onPress={handleDelete}>
				delete
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 90,
		height: 90,
	},
});

export default UnsavedItem;
