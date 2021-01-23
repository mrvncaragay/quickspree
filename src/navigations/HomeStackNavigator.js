import React from 'react';
import { AddStore, SearchStore } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import BottomStackNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const CreateAdd = () => (
	<Stack.Navigator>
		<Stack.Screen name='Home' component={BottomStackNavigator} options={{ headerShown: false }} />
		<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
		<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
	</Stack.Navigator>
);

export default CreateAdd;
