import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		throw new Error('Failed saving data to AsyncStorage');
	}
};

export const readData = async (key) => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		throw new Error('Failed reading data from AsyncStorage');
	}
};

export const removeData = async (key) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		throw new Error('Failed to remove a key from AsyncStorage');
	}
};

export const clearData = async () => {
	try {
		await AsyncStorage.clear();
	} catch (e) {
		throw new Error('Failed to clear AsyncStorage');
	}
};
