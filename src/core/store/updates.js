/**
 * Functions used to update the state of the app as a whole. These have a 
 * strict hierarchy that allows all changes to cascade properly.
 *
 */

import { msDisplayEllipsoids, msDisplayLabels, msDisplayCScales } from './interfaces/MSInterface';
import { efgDisplayEllipsoids, efgDisplayLabels, efgDisplayCScales } from './interfaces/EFGInterface';
import { dipDisplayLinks } from './interfaces/DipInterface';
import { selShowLabels } from './interfaces/SelInterface';
import { mergeOnly } from '../../utils';

// The hierarchy works as follow:
// 
// 1. Any functions that will have side effects in terms of atoms that are selected
//    and/or displayed (normally or as ghosts) execute. They also call inside...
// 2. The updateViews function, which performs those updates, and then calls inside...
// 3. All the visualisation functions such as msDisplayEllipsoids, selShowLabels, etc., 
//    which act based on selected and displayed atoms.
//    
// Each of these functions must have the following interface:
// 
// updateFunction(state, new_state={}) {
//      
//      < Do stuff... >
//      
//      return updated_state;
// }
// 
// taking the state as first argument, a series of parameters that will update
// the state as second, and then merging them (with any other added parameters)
// and returning the updated state as a result. The goal is for them to be possible
// to simply use in a 'call' action with the store's reducer.

function updateViews(state, parameters = {}) {

    let app = state.app_viewer;

    const defaults = {
        sel_selected_view: null,
        sel_displayed_view: null,
        sel_ghosts_view: null
    };

    const options_old = mergeOnly(defaults, state);
    const options_new = mergeOnly(options_old, parameters);

    // Updated state
    const state_new = {
        ...state,
        ...options_new
    };

    // Aliases
    let sel = options_new.sel_selected_view;
    let displ = options_new.sel_displayed_view? options_new.sel_displayed_view : state.app_default_displayed;

    // Assign new selection
    if (sel !== app.selected)
        app.selected = sel;
    if (displ !== app.displayed)
        app.displayed = displ;

    // We now update all visualizations that may be changed as a result of this
    return {
        ...state_new,
        ...updateAllVisualizations(state_new)
    };
}

/**
 * A convenience method that runs all the necessary visualisations needing
 * update at once
 */
function updateAllVisualizations(state) {
    return {
        ...selShowLabels(state),
        ...msDisplayEllipsoids(state),
        ...msDisplayLabels(state),
        ...msDisplayCScales(state),
        ...efgDisplayEllipsoids(state),
        ...efgDisplayLabels(state),
        ...efgDisplayCScales(state),
        ...dipDisplayLinks(state)
    };
}

export { updateViews, updateAllVisualizations };