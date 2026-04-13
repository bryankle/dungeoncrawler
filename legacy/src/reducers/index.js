import { combineReducers } from 'redux';
import GridReducer from './reducer-grid';
import AttackReducer from './reducer-attack-critter';

const rootReducer = combineReducers({
   grid: GridReducer,
   damage: AttackReducer
});

export default rootReducer;
