import React from 'react';
import { View } from 'react-native';
import { Headline, IconButton } from 'react-native-paper';

const SelectStore = ({ colors, navigation }) => {
	return (
		<>
			<Headline>Please select or create new store</Headline>
			<View style={{ flexDirection: 'row' }}>
				<IconButton
					icon='cloud-search'
					color={colors.primary}
					size={40}
					onPress={() => navigation.navigate('SearchStore')}
				/>
				<IconButton
					icon='plus-circle'
					color={colors.primary}
					size={40}
					onPress={() => navigation.navigate('AddStore')}
				/>
			</View>
		</>
	);
};

export default SelectStore;
