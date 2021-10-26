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
            return {
                ...state, 
                visualizer: action.visualizer
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