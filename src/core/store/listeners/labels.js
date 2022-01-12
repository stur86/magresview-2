/**
 * Listeners for the rendering of labels
 */

import _ from 'lodash';
import { addPrefix, getSel, getNMRData } from '../utils';
import { msColor, efgColor } from './colors';

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
        let nmr_mode = mode;

        if (current_view && (current_view !== next_view || mode == 'none')) {
            // Remove old labels
            current_view.removeLabels(name);
        }

        if (mode !== 'none') {

            // We add special instructions just for the case of referenced
            // chemical shifts. These only matter for MS, not EFG.
            if (mode === 'cs' && name === 'ms') {
                nmr_mode = 'iso'; // We then need to reference these
            }

            const data = next_view.map((a) => [a.getArrayValue(name), a.isotopeData]);
            let [units, values] = getNMRData(data, nmr_mode, name);

            // Second part, here we apply the formula:
            //     cs = ref - iso
            if (mode === 'cs' && name === 'ms') {
                // Referencing
                values = next_view.map((a, i) => {
                    const ref = ref_table[a.element] || 0.0;
                    return ref-values[i];
                });
            }

            let label_texts = values.map((v) => v.toFixed(2) + ' ' + units);
            next_view.addLabels(label_texts, name, (a, i) => ({ 
                color: color,  
                shift: shiftfunc(a.radius),
                height: 0.02
            }));
        }

        return [{
            [pre_view]: next_view,
        }, []];
    }

    return listener;
}

// Make specific instances of the listener
const msLabelListener = makeLabelListener('ms', msColor, (r) => ([1.414*r, 0.0, 0.0]));
const efgLabelListener = makeLabelListener('efg', efgColor, (r) => ([r, -r, 0.0]));

export { msLabelListener, efgLabelListener };