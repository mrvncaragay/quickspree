import stringSimilarity from 'string-similarity';

const checkSimilarity = (unique, newData) => {
	if (unique.length === 0) return newData;

	const newUnique = [];

	for (let j = 0; j < newData.length; j++) {
		for (let i = 0; i < unique.length; i++) {
			const ratio = stringSimilarity.compareTwoStrings(unique[i].productName, newData[j].productName);

			if (ratio > 0.7) {
				break;
			}

			if (i === unique.length - 1) {
				newUnique.push(newData[j]);
			}
		}
	}

	return [...unique, ...newUnique];
};

export default checkSimilarity;
