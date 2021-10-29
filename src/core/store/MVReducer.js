// Initial state
const MVInitialState = {
    theme: 'dark',
    panel: 'load',
    visualizer: null,
    current_model_name: null,
    default_displayed: null,
    // MS state
    ms_ellipsoid_view: null,
    ms_ellipsoid_scale: 0.05
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
            };
        case 'update':
            return {
                ...state,
                ...action.data
            };
        case 'ms_ellipsoids':
            return {
                ...state,
                ms_ellipsoid_view: action.view,
                ms_ellipsoid_scale: action.scale
            };
        default:
            return state;
    }
};

export { MVInitialState };
export default MVReducer;