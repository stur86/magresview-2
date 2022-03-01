import _ from 'lodash';
import { getSel } from '../utils';

function plotsListener(state) {

    const minx = parseFloat(state.plots_min_x);
    const maxx = parseFloat(state.plots_max_x);

    const miny = parseFloat(state.plots_min_y);
    const maxy = parseFloat(state.plots_max_y);

    // Get target atom view
    const app = state.app_viewer;
    const view = getSel(app);

    if (!view) {
        return {
            plots_data: [{
                id: 'Test',
                data: [
                    {x: minx, y: 0},
                    {x: 48, y: 0},
                    {x: 50, y: 1},
                    {x: 52, y: 0},
                    {x: maxx, y: 0},
                ]
            }]
        };
    }

    // If any is NaN, ignore
    if (isNaN(minx) || isNaN(maxx) || isNaN(miny) || isNaN(maxy)) {
        return {};
    }

    // Get out MS data
    const ms = view.map((a) => (a.getArrayValue('ms')));
    const w = state.plots_peak_width;
    let peaks = ms.map((T) => (T.isotropy));

    // Find the relevant peaks
    peaks = peaks.filter((x) => (x+w >= minx && x-w <= maxx));

    function peak(x, x0) {
        return 0.5/Math.PI*w/(Math.pow(x-x0, 2)+0.25*w*w);  // Lorentzian peak
    }

    // Build x range
    const n = state.plots_x_steps;
    const xrange = _.range(n).map((i) => (minx + (maxx-minx)*i/(n-1)));    
    const data = [{
        id: 'Curve',
        data: xrange.map((x) => ({
            x: x,
            y: peaks.reduce((s, x0) => (s + peak(x, x0)), 0)
        }))
    }];

    return {
        plots_data: data
    };
}

export { plotsListener };