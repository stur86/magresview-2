import _ from 'lodash';

function plotsListener(state) {

    const minx = parseFloat(state.plots_min_x);
    const maxx = parseFloat(state.plots_max_x);

    const miny = parseFloat(state.plots_min_y);
    const maxy = parseFloat(state.plots_max_y);

    console.log(miny, maxy);

    // If any is NaN, ignore
    if (isNaN(minx) || isNaN(maxx) || isNaN(miny) || isNaN(maxy)) {
        return {};
    }

    const n = state.plots_x_steps;

    // Build x range
    const xrange = _.range(n).map((i) => (minx + (maxx-minx)*i/(n-1)));    
    const data = [{
        id: 'Curve',
        data: xrange.map((x) => ({
            x: x,
            y: Math.pow(x, 2.0)*Math.exp(-x)
        }))
    }];

    return {
        plots_x_axis: xrange,
        plots_data: data
    };
}

export { plotsListener };