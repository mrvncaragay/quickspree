import React from 'react';
import { View, FlatList } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { removeData } from '../../../utils/asyncStorage';
import { ProductItem } from '../../../components';

const Unsaved = ({ navigation }) => {
	const [{ unsaved }, dispatch] = useStateValue();

	const handleClearAllUnsaved = () => {
		dispatch({ type: 'setUnsaved', value: [] });
		removeData('unsaved');
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 20 }}>
			{unsaved.length > 0 && (
				<Button
					style={{ alignSelf: 'flex-end', marginVertical: 10, backgroundColor: 'firebrick' }}
					mode='contained'
					onPress={handleClearAllUnsaved}>
					Clear
				</Button>
			)}

			<FlatList
				showsHorizontalScrollIndicator={true}
				data={unsaved}
				renderItem={({ item, index }) => (
					<ProductItem product={item} onPress={() => navigation.navigate('EditUnsaved', { product: item, index })} />
				)}
				keyExtractor={(_, index) => index.toString()}
				ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
			/>
		</View>
	);
};

export default Unsaved;
