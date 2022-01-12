/**
 * Listeners for color scales
 */

import _ from 'lodash';
import { addPrefix, getSel, getNMRData } from '../utils';
import { getColorScale } from '../../../utils';

function makeCScaleListener(name) {

    // Factory for a function that will be used for both MS and EFG with
    // minimal differences
    
    const pre_view = addPrefix(name, 'view');
    const pre_displ = addPrefix(name, 'cscale_displ');
    const pre_type = addPrefix(name, 'cscale_type');

    function listener(state) {

        let app = state.app_viewer;
        let current_greyed = state[pre_displ];
        let displayed = app.displayed;

        let next_view = getSel(app);
        let next_greyed = null;

        const mode = state[pre_type];

        // Restore color to the grayed out atoms
        if (current_greyed) {
            current_greyed.setProperty('color', null);
        }

        if (mode !== 'none') {
    
            next_greyed = displayed.xor(next_view);

            const data = next_view.map((a) => [a.getArrayValue(name), a.isotopeData]);
            const nmrdata = getNMRData(data, mode);
            const values = nmrdata[1];

            let minv = _.min(values);
            let maxv = _.max(values);
            let cs = getColorScale(minv, maxv, 'portland');
            let colors = values.map((v) => cs.getColor(v).toHexString());

            next_view.setProperty('color', colors);
            next_greyed.setProperty('color', 0x888888);
        }
        else {
            displayed.setProperty('color', null);
        }

        return [{
            [pre_view]: next_view,
            [pre_displ]: next_greyed
        }, []];
    }    

    return listener;
}

const msCScaleListener = makeCScaleListener('ms');
const efgCScaleListener = makeCScaleListener('efg');

export { msCScaleListener, efgCScaleListener };