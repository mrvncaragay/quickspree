import React from 'react';
import { View } from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import { useStateValue } from '../context';
import { storeData } from '../utils/asyncStorage';

const ProductItem = ({ product }) => {
	const { colors } = useTheme();

	const [{ unsaved }, dispatch] = useStateValue();

	const CustomText = ({ label, children, containerStyle, labelStyle }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={[{ color: colors.backdrop }, labelStyle]}>{label}</Text>
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
				flex: 1,
				backgroundColor: 'white',
				padding: 20,
				height: 'auto',
				borderTopWidth: 1,
				borderColor: 'lightgray',
			}}>
			<View style={{ flex: 1 }}>
				<CustomText containerStyle={{ flex: 1 }} title>
					{product?.productName}
					{'\n'}
					<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
				</CustomText>

				<CustomText labelStyle={{ marginTop: 10 }} label={`Aisle - ${product?.aisleCode || ''}`} />
			</View>
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

export default ProductItem;
