import React, { useState } from 'react';
import { Text, ScrollView, View, FlatList } from 'react-native';
import { Title, TextInput, IconButton, ActivityIndicator, useTheme } from 'react-native-paper';

const Item = ({ item }) => {
	// const { colors } = useTheme();
	// const [item, setItem] = useState('');
	// const [loading, setLoading] = useState(false);
	return (
		<View style={{ height: 40, justifyContent: 'center' }}>
			<Text>{item}</Text>
		</View>
	);
};

export default Item;
