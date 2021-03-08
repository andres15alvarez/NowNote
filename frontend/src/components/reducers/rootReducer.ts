import { combineReducers } from "redux";
import { storeReducer } from "./storeReducer";

export const rootReducer = combineReducers({ storeReducer });