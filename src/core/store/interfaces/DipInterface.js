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
import { makeSelector, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import CrystVis from 'crystvis-js';

const LC = CrystVis.LEFT_CLICK;

const initialDipState = {
    dip_view: null,
    dip_link_names: [],
    dip_links_on: false,
    dip_central_atom: null,
    dip_radius: 1.0,
    dip_sphere_show: true,
    dip_homonuclear: false
};


class DipInterface extends BaseInterface {

    get isOn() {
        return this.state.dip_links_on;
    }

    set isOn(v) {

        let data = {
            dip_links_on: v,
            listen_update: [ Events.DIP_LINKS ]
        };

        if (!v) 
            data.dip_central_atom = null;

        this.dispatch({
            type: 'update',
            data: data
        });
    }

    get centralAtom() {
        return this.state.dip_central_atom;
    }

    get radius() {
        return this.state.dip_radius;
    }

    set radius(v) {
        this.dispatch({
            type:'update',
            data: {
                dip_radius: v
            }
        });
    }

    get homonuclearOnly() {
        return this.state.dip_homonuclear;
    }

    set homonuclearOnly(v) {
        this.dispatch({
            type:'update',
            data: {
                dip_homonuclear: v,
                listen_update: [ Events.DIP_LINKS ]
            }
        });        
    }

    get showSphere() {
        return this.state.dip_sphere_show;
    }

    set showSphere(v) {
        this.dispatch({
            type:'update',
            data: {
                dip_sphere_show: v,
                listen_update: [ Events.DIP_RENDER ]
            }
        });
    }

    bind() {
        const dispatch = this._dispatcher;
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        handler.setCallback('dip', LC, (a, e) => { 
                // Avoid working on ghosts
                if (a.opacity < 1.0) {
                    return;
                }

                dispatch({
                    type: 'update',
                    data: {
                        dip_central_atom: a,
                        listen_update: [ Events.DIP_LINKS ]
                    }
                });
        });        
    }

    unbind() {
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        // Remove the event
        handler.setCallback('dip', LC); 
    }

}

function useDipInterface() {
    let state = useSelector(makeSelector('dip', ['app_click_handler']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new DipInterface(state, dispatcher);

    return intf;
}

export default useDipInterface;
export { initialDipState };