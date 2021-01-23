import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Header = ({ store, colors, navigation }) => {
	return (
		<Surface style={styles.surface}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<MaterialCommunityIcons name='store' size={36} color={colors.primary} />
				<View style={{ marginLeft: 5 }}>
					<Text style={{ fontSize: 14 }}>{`${store.city}, ${store.state}`}</Text>
					<Text style={{ fontSize: 12, color: 'gray' }}>{`${store.name} - #${store.storeNumber}`}</Text>
				</View>
			</View>
			<FontAwesome
				style={{ marginRight: 5 }}
				name='exchange'
				size={20}
				color={colors.primary}
				icon='exchange-alt'
				onPress={() => navigation.navigate('SearchStore')}
			/>
		</Surface>
	);
};

const styles = StyleSheet.create({
	surface: {
		zIndex: 1,
		flexDirection: 'row',
		height: 60,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
		elevation: 4,
	},
});

export default Header;
