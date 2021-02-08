import firebase from 'firebase';
import env from '../../config';

const firebaseConfig = {
	apiKey: env.apiKey,
	authDomain: env.authDomain,
	databaseURL: env.databaseURL,
	projectId: env.projectId,
	storageBucket: env.storageBucket,
	messagingSenderId: env.messagingSenderId,
	appId: env.appId,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// get all product from db
export const getASingleProductFromDB = (path) => {
	return new Promise(async (resolve, reject) => {
		try {
			const productRef = firebase.database().ref(path);
			productRef.once('value', (snapshot) => {
				resolve(snapshot.val());
			});
		} catch (error) {
			reject(error);
		}
	});
};

// save product to db
export const saveProductToDB = (product, path) => {
	if (!product || !path) return;

	return new Promise(async (resolve, reject) => {
		const productRef = firebase.database().ref(path);
		productRef.set(product, async (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

// save batch item temp images to db
export const saveBatchDataToDB = (data, path) => {
	if (!data || !path) return;

	return new Promise(async (resolve, reject) => {
		const batchRef = firebase.database().ref(path);

		data.forEach((image) => {
			const url = image.replace('197x', '697x');
			batchRef.push().set(url, async (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	});
};

// delete product
export const deleteProductToDB = (path) => {
	return new Promise(async (resolve, reject) => {
		try {
			const scannedProductRef = firebase.database().ref(path);
			await scannedProductRef.set(null);
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

// save image to storage
export const saveImageToStorage = (image, path) => {
	return new Promise(async (resolve, reject) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', image.uri, true);
			xhr.send(null);
		});

		try {
			const storageRef = firebase.storage().ref();
			const imagesFolder = storageRef.child(path);

			const snapshot = await imagesFolder.put(blob);
			const url = await snapshot.ref.getDownloadURL();
			resolve(url);
		} catch (error) {
			reject(error);
		}
	});
};

// delete image to storage
export const deleteImageToStorage = (filename) => {
	return new Promise(async (resolve, reject) => {
		try {
			const storageRef = firebase.storage().ref();
			const imageRef = storageRef.child(`images/${filename}`);

			await imageRef.delete();
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

// delete image to storage
export const searchImagesFromDB = (filename) => {
	return new Promise(async (resolve, reject) => {
		try {
			const batchesRef = firebase.database().ref(filename);
			batchesRef.on('value', (snapshot) => {
				const images = snapshot.val();

				const result = [];
				for (let key in images) {
					if (typeof images[key] === 'string') {
						result.push(images[key]);
					} else {
						for (let k in images[key]) {
							result.push(images[key][k]);
						}
					}
				}
				resolve(result);
			});
		} catch (error) {
			reject(error);
		}
	});
};

export default firebase;
