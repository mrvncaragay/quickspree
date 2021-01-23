import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Save, Locate, Batch } from '../screens';

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
	return (
		<BottomTab.Navigator
			shifting={true}
			activeColor='#FFFFFF'
			labelStyle={{ fontSize: 12 }}
			barStyle={{ backgroundColor: '#165E7C', height: 80, paddingTop: 15, paddingBottom: 2 }}>
			{/* <BottomTab.Screen
				name='Batch'
				component={Batch}
				style={{ padding: 12 }}
				options={
					{
						// tabBarIcon: ({ color }) => <Icon name='list' size={28} color={color} />,
					}
				}
			/> */}

			<BottomTab.Screen
				name='Save'
				component={Save}
				style={{ padding: 12 }}
				options={{
					tabBarIcon: ({ color }) => <Icon name='add' size={22} color={color} />,
				}}
			/>

			<BottomTab.Screen
				name='Locate'
				component={Locate}
				options={{
					tabBarIcon: ({ color }) => <Icon name='search' size={22} color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	);
};

export default BottomTabNavigator;
