import React from 'react';
import { Platform, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ListItems } from '../screens/Batch/components';

import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const Tester = () => (
	<View>
		<Text>Tester</Text>
	</View>
);

const TopTabNavigator = ({ navigation, route }) => {
	const { colors } = useTheme();

	const [{ unsaved }] = useStateValue();

	return (
		<Tab.Navigator
			tabBarOptions={{
				inactiveTintColor: 'gray',
				activeTintColor: colors.primary,

				indicatorStyle: {
					backgroundColor: colors.primary,
				},
			}}>
			<Tab.Screen name='TOFIND' component={ListItems} options={{ title: 'Hello' }} />
			<Tab.Screen name='INREVIEW' component={Tester} options={{ title: `${unsaved.length} IN REVIEW` }} />
			<Tab.Screen name='DONE' component={Tester} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
