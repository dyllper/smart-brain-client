import { combineReducers } from 'redux';
import { input, imageUrl, clarifaiRequestIsPending, boxData } from './images';

export default combineReducers({
   input,
   imageUrl,
   clarifaiRequestIsPending,
   boxData,
});
