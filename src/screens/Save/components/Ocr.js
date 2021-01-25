import React, { useState, useEffect } from 'react';
import { useStateValue } from '../../../context';
import { Camera } from '../../../components';
import { storeData } from '../../../utils/asyncStorage';
import productData from '../../../utils/product';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const Ocr = () => {
	const [{ unsaved }, dispatch] = useStateValue();
	const [isSaving, setIsSaving] = useState(false);
	const colors = useTheme();

	const handleSubmit = async (products) => {
		setIsSaving(true);
		const unsavedData = [...unsaved, ...products];
		await storeData('unsaved', unsavedData);
		dispatch({ type: 'setUnsaved', value: unsavedData });
		setIsSaving(false);
	};

	return isSaving ? (
		<ActivityIndicator size='large' color={colors.primary} />
	) : (
		<Camera onRead={handleSubmit} product={productData} />
	);
};

export default Ocr;
