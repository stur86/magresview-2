/**
 * Listeners for the rendering of ellipsoids
 */

import _ from 'lodash';
import { addPrefix, getSel } from '../utils';
import { msColor, efgColor } from './colors';

function makeEllipsoidListener(name, color) {
    // Factory for a listener that will be used for both MS and EFG ellipsoids
    // with minimal differences
    
    const pre_view = addPrefix(name, 'view');
    const pre_on = addPrefix(name, 'ellipsoids_on');
    const pre_scale = addPrefix(name, 'ellipsoids_scale');

    function listener(state) {

        let app = state.app_viewer;
        let current_view = state[pre_view];

        // Current view holds the LAST one used; we need to update that
        // What would be the "new" view?
        let next_view = getSel(app);

        // Aliases for convenience
        const on = state[pre_on];
        let scale = state[pre_scale];


        if (current_view && (current_view !== next_view || !on)) {
            // Something's changing. Remove old ellipsoids!
            current_view.removeEllipsoids(name);
        }

        // Now for the new view and data
        if (on) {

            const data = next_view.map((a) => a.getArrayValue(name));

            if (scale === 0) {
                // Auto scale needed
                let avg = data.map((t) => _.sum(t.eigenvalues.map(Math.abs))/3.0);
                avg = _.sum(avg)/data.length;
                scale = 2.0/avg;
            }

            next_view.addEllipsoids(data, name, {scalingFactor: scale, color: color, opacity: 0.125});
        }

        return {
            [pre_view]: next_view,
            [pre_scale]: scale
        };
    }

    return listener;
}

// Make specific instances of the listener
const msEllipsoidListener = makeEllipsoidListener('ms', msColor);
const efgEllipsoidListener = makeEllipsoidListener('efg', efgColor);

export { msEllipsoidListener, efgEllipsoidListener };