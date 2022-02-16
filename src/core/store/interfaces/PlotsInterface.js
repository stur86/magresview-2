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

import { makeSelector, DataCheckInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialPlotsState = {
    plots_show: false,
    plots_q2_shifts: true
};

class PlotsInterface extends DataCheckInterface {

    get show() {
        return this.state.plots_show;
    }

    set show(v) {
        this.dispatch({
            type: 'update',
            data: {
                plots_show: v,
                listen_update: [Events.PLOTS_RECALC]
            }
        });
    }

    get useQ2Shift() {
        return this.state.plots_q2_shifts;
    }

    set useQ2Shift(v) {
        this.dispatch({

        });
    }
}

// Hook for interface
function usePlotsInterface() {
    let state = useSelector(makeSelector('plots', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new PlotsInterface(state, dispatcher);

    return intf;
}


export default usePlotsInterface;
export { initialPlotsState };
