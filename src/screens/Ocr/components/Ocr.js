import React from 'react';
import { useStateValue } from '../../../context';
import { Camera } from '../../../components';
import { storeData } from '../../../utils/asyncStorage';
import checkSimilarity from '../../../utils/stringSimilarity';
import { productData } from '../../../utils/product';

const Ocr = () => {
	const [{ unsaved }, dispatch] = useStateValue();
	const handleSubmit = async (products) => {
		const unsavedData = checkSimilarity(unsaved, products);
		await storeData('unsaved', unsavedData);
		dispatch({ type: 'setUnsaved', value: unsavedData });
	};

	return <Camera onRead={handleSubmit} product={productData} />;
};

export default Ocr;
