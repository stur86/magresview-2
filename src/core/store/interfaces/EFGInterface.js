/**
 * MagresView 2.0
 *
 * A web interface to visualize and interact with computed NMR data in the Magres
 * file format.
 *
 * Author: Simone Sturniolo
 *
 * Copyright 2022 Science and Technology Facilities Council
 * This software is distributed under the terms of the MIT License
 * Please refer to the file LICENSE for the text of the license
 * 
 */

import { Events } from '../listeners';
import CScaleInterface, { makeCScaleSelector } from './CScaleInterface';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialEFGState = {
    efg_view: null,
    efg_ellipsoids_on: false,
    efg_ellipsoids_scale: 0.1,
    efg_labels_type: 'none'
};

// Action creator
const efgAction = function(data, update=[]) {
    return {
        type: 'update',
        data: {
            ...data,
            listen_update: update
        }
    };
}

class EFGInterface extends CScaleInterface {

    get hasData() {
        let m = this.state.app_viewer.model;
        return (m && (m.hasArray('efg')));
    }

    get hasEllipsoids() {
        return this.state.efg_ellipsoids_on;
    }

    set hasEllipsoids(v) {
        this.dispatch(efgAction({ efg_ellipsoids_on: v }, [Events.EFG_ELLIPSOIDS]));
    }

    get ellipsoidScale() {
        return this.state.efg_ellipsoids_scale;
    }

    set ellipsoidScale(v) {
        this.dispatch(efgAction({ efg_ellipsoids_scale: v }, [Events.EFG_ELLIPSOIDS]));
    }

    get labelsMode() {
        return this.state.efg_labels_type;
    }

    set labelsMode(v) {
        this.dispatch(efgAction({ efg_labels_type: v }, [Events.EFG_LABELS]));
    }

    get colorScaleAvailable() {
        let pre = this.colorScalePrefix;
        return (pre === 'none' || pre === 'efg');
    }

}

function useEFGInterface() {
    let state = useSelector(makeCScaleSelector('efg', ['app_viewer', 'ms_cscale_type']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new EFGInterface(state, dispatcher);

    return intf;
}

export default useEFGInterface;
export { initialEFGState };