import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './src/navigations/HomeStackNavigator';
import { StyleSheet, SafeAreaView, Platform, StatusBar, LogBox, Text } from 'react-native';
import { StateProvider } from './src/context';

import theme from './src/theme';

export default function App() {
	LogBox.ignoreLogs(['Setting a timer', 'componentWillMount']);

	return (
		<SafeAreaView style={[{ flex: 1 }, styles.AndroidSafeArea]}>
			<NavigationContainer>
				<PaperProvider theme={theme}>
					<StateProvider>
						<HomeStackNavigator />
					</StateProvider>
				</PaperProvider>
			</NavigationContainer>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	AndroidSafeArea: {
		backgroundColor: 'white',
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
});
