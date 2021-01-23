import React, { useState } from 'react';
import { Text, ScrollView, View, FlatList } from 'react-native';
import { Title, TextInput, IconButton, ActivityIndicator, useTheme, Divider } from 'react-native-paper';

import Item from './Item';

const ListItems = ({}) => {
	const { colors } = useTheme();
	const [item, setItem] = useState('');
	const [loading, setLoading] = useState(false);
	return (
		<>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: '#fff',
					paddingHorizontal: 20,
				}}
			>
				<TextInput
					style={{ marginVertical: 5, flex: 1 }}
					mode='outlined'
					dense
					value={item}
					placeholder='Add item...'
					onChangeText={(name) => setItem({ ...item, name })}
				/>

				<IconButton
					style={{ position: 'relative', top: 4 }}
					icon='plus-box-outline'
					size={40}
					color={colors.primary}
					onPress={() => console.log('called')}
				/>
			</View>
			<FlatList
				style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
				showsHorizontalScrollIndicator={true}
				data={[1, 2]}
				windowSize={3}
				renderItem={({ item, index }) => <Item item={item} />}
				keyExtractor={(_, index) => index.toString()}
				ItemSeparatorComponent={() => <Divider style={{ height: 1 }} />}
			/>
		</>
	);
};

export default ListItems;
