import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UnsavedList from '../screens/Ocr/components/UnsavedList';
import { OCR } from '../screens';
import { useStateValue } from '../context';

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
	const [{ unsaved }] = useStateValue();

	return (
		<BottomTab.Navigator
			activeColor='#FFFFFF'
			labelStyle={{ fontSize: 12 }}
			barStyle={{ backgroundColor: '#165E7C', height: 80, paddingTop: 15, paddingBottom: 2 }}>
			<BottomTab.Screen
				name='OCR'
				component={OCR}
				style={{ padding: 12 }}
				options={{
					tabBarIcon: ({ color }) => <MaterialCommunityIcons name='camera-iris' size={22} color={color} />,
				}}
			/>

			<BottomTab.Screen
				name='SEND'
				component={UnsavedList}
				options={{
					title: `${unsaved.length || ''} UNSEND`,
					tabBarIcon: ({ color }) => <FontAwesome5 name='telegram-plane' size={22} color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	);
};

export default BottomTabNavigator;
