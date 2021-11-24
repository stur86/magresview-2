import _ from 'lodash';
import { createStore } from 'redux';

// Initial state, merged from segments
import { initialAppState } from './interfaces/AppInterface';
import { initialSelState } from './interfaces/SelInterface';
import { initialMSState } from './interfaces/MSInterface';

// Merging together
const initialState = {
    ...initialAppState,
    ...initialSelState,
    ...initialMSState
};

// Reducer
function storeReducer(state=initialState, action={type: 'none'}) {
    switch(action.type) {
        case 'set':
            // Set a single value
            state = {
                ...state,
                [action.key]: action.value,
            };
            break;
        case 'update':
            // Set multiple values
            state = {
                ...state,
                ...action.data
            };
            break;
        case 'call':
            // Do complex stuff with state
            let args = [state].concat(action.arguments);
            let data = action.function(...args);
            state = {
                ...state,
                ...data
            };
            break;
        default:
            break;
    }

    return state;
};

const magresStore = createStore(storeReducer);

export default magresStore;