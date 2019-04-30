import {
   CHANGE_INPUT_FIELD,
   CHANGE_IMAGE_URL,
   CHANGE_BOX_LOCATION_DATA,
} from '../actions/images';

export const input = (state = '', action = {}) => {
   switch (action.type) {
      case CHANGE_INPUT_FIELD:
         return action.text;
      default:
         return state;
   }
};

export const imageUrl = (state = '', action = {}) => {
   switch (action.type) {
      case CHANGE_IMAGE_URL:
         return action.url;
      default:
         return state;
   }
};

export const boxData = (state = {}, action = {}) => {
   switch (action.type) {
      case CHANGE_BOX_LOCATION_DATA:
         return action.boxData;
      default:
         return state;
   }
};
