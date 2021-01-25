import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Unsaved from '../screens/Save/components/Unsaved';
import Ocr from '../screens/Save/components/Ocr';

import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const TopTabSaveNavigator = () => {
	const { colors } = useTheme();
	const [{ unsaved }] = useStateValue();

	return (
		<Tab.Navigator
			tabBarOptions={{
				inactiveTintColor: 'gray',
				activeTintColor: colors.primary,
				style: { marginTop: 1 },
				indicatorStyle: {
					backgroundColor: colors.primary,
				},
			}}>
			<Tab.Screen name='OCR' component={Ocr} />
			<Tab.Screen name={`Unsaved`} component={Unsaved} options={{ title: `${unsaved.length || ''} UNSAVED` }} />
		</Tab.Navigator>
	);
};

export default TopTabSaveNavigator;
