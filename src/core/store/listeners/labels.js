/**
 * Listeners for the rendering of labels
 */

import { addPrefix, getSel, getNMRData } from '../utils';
import { selColor, msColor, efgColor } from './colors';

function makeLabelListener(name, color, shiftfunc) {
    // Factory for a function that will be used for both MS and EFG with
    // minimal differences
    
    const pre_view = addPrefix(name, 'view');
    const pre_references = addPrefix(name, 'references');
    const pre_type = addPrefix(name, 'labels_type');

    function listener(state) {

        let app = state.app_viewer;
        let current_view = state[pre_view];
        let ref_table = state[pre_references];

        // Current view holds the LAST one used; we need to update that
        // What would be the "new" view?
        let next_view = getSel(app);

        // Aliases
        const mode = state[pre_type];

        if (current_view && (current_view !== next_view || mode === 'none')) {
            // Remove old labels
            current_view.removeLabels(name);
        }

        let label_texts;
        if (mode !== 'none') {

            if (name !== 'sel_sites') {
                let [units, values] = getNMRData(next_view, mode, name, ref_table);
                label_texts = values.map((v) => v.toFixed(2) + ' ' + units);                
            }
            else {
                // Non-NMR labels
                label_texts = next_view.map((a) => a.crystLabel);
            }

            next_view.addLabels(label_texts, name, (a, i) => ({ 
                color: color,  
                shift: shiftfunc(a.radius),
                height: 0.02
            }));
        }

        return {
            [pre_view]: next_view,
        };
    }

    return listener;
}

// Make specific instances of the listener
const selLabelListener = makeLabelListener('sel_sites', selColor, (r) => ([r, r, 0]));
const msLabelListener = makeLabelListener('ms', msColor, (r) => ([1.414*r, 0.0, 0.0]));
const efgLabelListener = makeLabelListener('efg', efgColor, (r) => ([r, -r, 0.0]));

export { selLabelListener, msLabelListener, efgLabelListener };