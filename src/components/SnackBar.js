import React from 'react';
import { Text } from 'react-native';
import { Snackbar as MessageAlert } from 'react-native-paper';

const Snackbar = ({ controller, setVisible }) => {
	return (
		<MessageAlert
			style={{ backgroundColor: 'green' }}
			duration={2000}
			visible={controller.status}
			onDismiss={setVisible}
		>
			<Text style={{ color: 'white', textAlign: 'center' }}>{controller.message}</Text>
		</MessageAlert>
	);
};

export default Snackbar;
