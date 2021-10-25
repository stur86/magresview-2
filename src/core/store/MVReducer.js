import CrystVis from 'crystvis-js';

// Initial state
const MVInitialState = {
    theme: 'dark',
    panel: 'load',
    visualizer: null
};

// Reducer function
const MVReducer = (state, action) => {
    switch (action.type) {
        case 'initialise':
            var vis = new CrystVis(action.element);
            return {
                ...state, 
                visualizer: vis
            };
        case 'set':
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return state;
    }
};

export { MVInitialState };
export default MVReducer;