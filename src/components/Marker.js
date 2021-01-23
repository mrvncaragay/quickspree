import React from 'react';
import { Circle } from 'react-native-svg';

const Marker = ({ x, y, color }) => {
	return <Circle r={5} x={x} y={y} fill={color} />;
};

export default Marker;
