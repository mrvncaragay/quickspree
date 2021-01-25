import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Caption, Text } from 'react-native-paper';

const ProductItem = ({ product, onPress }) => {
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
				}}>
				<Caption style={{ lineHeight: 12 }}>
					Product: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.productName}</Text>
				</Caption>
				<Caption style={{ lineHeight: 12 }}>
					Aisle: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.aisleName}</Text>
				</Caption>
				<Caption style={{ lineHeight: 12 }}>
					Size: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.size}</Text>
				</Caption>
				<Caption style={{ lineHeight: 12 }}>
					Memo: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{product?.memo}</Text>
				</Caption>
			</View>
		</TouchableOpacity>
	);
};

export default ProductItem;
