import { createStore } from 'redux';

// Initial state, merged from segments
import { initialAppState } from './interfaces/AppInterface';
import { initialSelState } from './interfaces/SelInterface';
import { initialCScaleState } from './interfaces/CScaleInterface';
import { initialMSState } from './interfaces/MSInterface';
import { initialEFGState } from './interfaces/EFGInterface';
import { initialDipState } from './interfaces/DipInterface';
import { initialJCoupState } from './interfaces/JCoupInterface';
import { initialEulerState } from './interfaces/EulerInterface';
import { initialPlotsState } from './interfaces/PlotsInterface';
import { initialFilesState } from './interfaces/FilesInterface';
import makeMasterListener, { initialListenerState } from './listeners';

// Merging together
const initialState = {
    ...initialAppState,
    ...initialSelState,
    ...initialCScaleState,
    ...initialMSState,
    ...initialEFGState,
    ...initialDipState,
    ...initialJCoupState,
    ...initialEulerState,
    ...initialFilesState,
    ...initialPlotsState,
    ...initialListenerState
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
magresStore.subscribe(makeMasterListener(magresStore));

export default magresStore;