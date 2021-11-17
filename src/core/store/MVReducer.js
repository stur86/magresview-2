// Initial state for a model (used to reset every time we switch it)
const MVModelInitialState = {
    current_model_name: null,
    default_displayed: null,
    // Selection
    sel_highlight: true,
    sel_mode: 'none',
    sel_sph_r: 2.0,
    sel_bond_n: 1,
    // MS state
    ms_ellipsoid_view: null,
    ms_ellipsoid_scale: 0.05,
    ms_labels_view: null,
    ms_labels_content: 'none',
    ms_cscale_view: null,
    ms_cscale_content: 'none'
};

// Initial state
const MVInitialState = {
    theme: 'dark',
    panel: 'load',
    visualizer: null,
    ...MVModelInitialState
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
        default:
            return state;
    }
};

export { MVInitialState, MVModelInitialState };
export default MVReducer;