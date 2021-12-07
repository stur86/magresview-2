import { makeSelector, makeDisplayEllipsoids, makeDisplayLabels, makeDisplayCScales, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialEFGState = {
    efg_view: null,
    efg_ellipsoids_on: false,
    efg_ellipsoids_scale: 0.1,
    efg_labels_type: 'none',
    efg_cscale_type: 'none',
    efg_cscale_displ: null
};

const efgColor = 0x0080ff;

const efgDisplayEllipsoids = makeDisplayEllipsoids('efg', efgColor);
const efgDisplayLabels = makeDisplayLabels('efg', efgColor, (r) => ([r, -r, 0.0]));
const efgDisplayCScales = makeDisplayCScales('efg');

class EFGInterface extends BaseInterface {

    get hasData() {
        let m = this.state.app_viewer.model;
        return (m && (m.hasArray('efg')));
    }

    get hasEllipsoids() {
        return this.state.efg_ellipsoids_on;
    }

    set hasEllipsoids(v) {
        this.dispatch({
            type: 'call',
            function: efgDisplayEllipsoids,
            arguments: [v, this.state.efg_ellipsoids_scale]
        });
    }

    get ellipsoidScale() {
        return this.state.efg_ellipsoids_scale;
    }

    set ellipsoidScale(v) {
        this.dispatch({
            type: 'call',
            function: efgDisplayEllipsoids,
            arguments: [this.state.efg_ellipsoids_on, v]
        });
    }

    get labelsMode() {
        return this.state.efg_labels_type;
    }

    set labelsMode(v) {
        this.dispatch({
            type: 'call', 
            function: efgDisplayLabels,
            arguments: [v]
        });
    }

    get cscaleMode() {
        return this.state.efg_cscale_type;
    }

    set cscaleMode(v) {
        this.dispatch({
            type: 'call',
            function: efgDisplayCScales,
            arguments: [v]
        });
    }

}

function useEFGInterface() {
    let state = useSelector(makeSelector('efg', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new EFGInterface(state, dispatcher);

    return intf;
}

export default useEFGInterface;
export { initialEFGState, efgDisplayEllipsoids, efgDisplayLabels, efgDisplayCScales };