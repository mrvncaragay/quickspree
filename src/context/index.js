import React, { createContext, useContext, useReducer } from 'react';
import { InitialState, StateReducer } from './initialState';

export const StateContext = createContext();

export const StateProvider = ({ children }) => (
	<StateContext.Provider value={useReducer(StateReducer, InitialState)}>{children}</StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
