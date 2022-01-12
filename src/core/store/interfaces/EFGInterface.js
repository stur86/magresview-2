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

// Action creator
const efgAction = function(data, update='ellipsoids') {
    return {
        type: 'update',
        data: {
            ...data,
            listen_update: ['efg_' + update]
        }
    };
}

class EFGInterface extends BaseInterface {

    get hasData() {
        let m = this.state.app_viewer.model;
        return (m && (m.hasArray('efg')));
    }

    get hasEllipsoids() {
        return this.state.efg_ellipsoids_on;
    }

    set hasEllipsoids(v) {
        this.dispatch(efgAction({ efg_ellipsoids_on: v }));
    }

    get ellipsoidScale() {
        return this.state.efg_ellipsoids_scale;
    }

    set ellipsoidScale(v) {
        this.dispatch(efgAction({ efg_ellipsoids_scale: v }));
    }

    get labelsMode() {
        return this.state.efg_labels_type;
    }

    set labelsMode(v) {
        this.dispatch(efgAction({ efg_labels_type: v }, 'labels'));
    }

    get cscaleUsable() {
        return this.state.ms_cscale_type === 'none';
    }

    get cscaleMode() {
        return this.state.efg_cscale_type;
    }

    set cscaleMode(v) {

        if (!this.cscaleUsable)
            return;

        this.dispatch(efgAction({ efg_cscale_type: v }, 'cscales'));
    }

}

function useEFGInterface() {
    let state = useSelector(makeSelector('efg', ['app_viewer', 'ms_cscale_type']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new EFGInterface(state, dispatcher);

    return intf;
}

export default useEFGInterface;
export { initialEFGState, efgDisplayEllipsoids, efgDisplayLabels, efgDisplayCScales };