import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Caption, Text, IconButton } from 'react-native-paper';
import { useStateValue } from '../context';
import { storeData } from '../utils/asyncStorage';

const ProductItem = ({ product, onPress }) => {
	const { colors } = useTheme();
	const [{ unsaved }, dispatch] = useStateValue();

	const handleRemoveUnsaved = async () => {
		const unusedArr = unsaved.filter((p) => {
			return p.productName !== product.productName;
		});

		dispatch({ type: 'setUnsaved', value: unusedArr });
		await storeData('unsaved', unusedArr);
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<View
				style={{
					flex: 1,
					backgroundColor: 'white',
					padding: 10,
					paddingBottom: 0,
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

				<IconButton
					style={{ alignSelf: 'flex-end' }}
					icon='trash-can-outline'
					color='red'
					size={20}
					onPress={handleRemoveUnsaved}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default ProductItem;
