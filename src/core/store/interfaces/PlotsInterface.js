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

import { loadImage } from '../../../utils';
import { makeSelector, DataCheckInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialPlotsState = {
    plots_show: false,
    plots_q2_shifts: true,
    plots_show_axes: true,
    plots_show_grid: true,
    plots_bkg_img_url: null,
    plots_bkg_img_w: 0,
    plots_bkg_img_h: 0
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
            type: 'update',
            data: {
                plots_q2_shifts: v,
                listen_update: [Events.PLOTS_RECALC]
            }
        });
    }

    get showAxes() {
        return this.state.plots_show_axes;
    }

    set showAxes(v) {
        this.dispatch({
            type: 'update',
            data: {
                plots_show_axes: v
            }
        });
    }

    get showGrid() {
        return this.state.plots_show_grid;
    }

    set showGrid(v) {
        this.dispatch({
            type: 'update',
            data: {
                plots_show_grid: v
            }
        });
    }

    get bkgImage() {
        if (this.state.plots_bkg_img_url) {
            return {
                url: this.state.plots_bkg_img_url,
                width: this.state.plots_bkg_img_w,
                height: this.state.plots_bkg_img_h
            };
        }

        return null;
    }

    loadBkgImage(files) {
        const dispatch = this._dispatcher;
        loadImage(files[0]).then((img) => {
            dispatch({
                type: 'update',
                data: {
                    plots_bkg_img_url: img.src,
                    plots_bkg_img_w: img.naturalWidth,
                    plots_bkg_img_h: img.naturalHeight
                }
            });
        });
    }

    clearBkgImage() {
        this.dispatch({
            type: 'update',
            data: {
                plots_bkg_img_url: null,
                plots_bkg_img_w: 0,
                plots_bkg_img_h: 0
            }
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
