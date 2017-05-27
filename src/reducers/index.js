import { combineReducers } from 'redux';
import GridReducer from './reducer-grid';

const rootReducer = combineReducers({
   grid: GridReducer
});

export default rootReducer;
