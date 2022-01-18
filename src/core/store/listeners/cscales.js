/**
 * Listeners for color scales
 */

import _ from 'lodash';
import { getSel, getNMRData } from '../utils';
import { getColorScale } from '../../../utils';

function colorScaleListener(state) {

    let app = state.app_viewer;
    let current_view = state.cscale_view;
    let current_greyed = state.cscale_displ;
    let displayed = app.displayed;

    let next_view = getSel(app);
    let next_greyed = null;

    const cstype = state.cscale_type;

    // Restore color to the grayed out atoms
    if (current_greyed) {
        current_greyed.setProperty('color', null);
    }

    if (cstype !== 'none') {

        // Split in prefix and mode
        const [prefix, mode] = cstype.split('_', 2);

        next_greyed = displayed.xor(next_view);

        const data = next_view.map((a) => [a.getArrayValue(prefix), a.isotopeData]);
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
        if (current_view)
            current_view.setProperty('color', null);
    }

    return {
        cscale_view: next_view,
        cscale_displ: next_greyed
    };
}

export { colorScaleListener };