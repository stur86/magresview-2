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

const initialJCoupState = {
    jc_view: null,
    jc_link_names: [],
    jc_links_on: false,
    jc_central_atom: null,
    jc_radius: 1.0,
    jc_sphere_show: true,
    jc_homonuclear: false
};


class JCoupInterface extends BaseInterface {

    get hasData() {
        let app = this.state.app_viewer;
        return (app && app.model && (app.model.hasArray('isc')));        
    }

    get isOn() {
        return this.state.jc_links_on;
    }

    set isOn(v) {

        let data = {
            jc_links_on: v,
            listen_update: [ Events.JC_LINKS ]
        };

        if (!v) 
            data.jc_central_atom = null;

        this.dispatch({
            type: 'update',
            data: data
        });
    }

    get centralAtom() {
        return this.state.jc_central_atom;
    }

    get radius() {
        return this.state.jc_radius;
    }

    set radius(v) {
        this.dispatch({
            type:'update',
            data: {
                jc_radius: v
            }
        });
    }

    get homonuclearOnly() {
        return this.state.jc_homonuclear;
    }

    set homonuclearOnly(v) {
        this.dispatch({
            type:'update',
            data: {
                jc_homonuclear: v,
                listen_update: [ Events.JC_LINKS ]
            }
        });        
    }

    get showSphere() {
        return this.state.jc_sphere_show;
    }

    set showSphere(v) {
        this.dispatch({
            type:'update',
            data: {
                jc_sphere_show: v,
                listen_update: [ Events.JC_RENDER ]
            }
        });
    }

    bind() {
        const dispatch = this._dispatcher;
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        handler.setCallback('jc', LC, (a, e) => { 
                // Avoid working on ghosts
                if (a.opacity < 1.0) {
                    return;
                }

                dispatch({
                    type: 'update',
                    data: {
                        jc_central_atom: a,
                        listen_update: [ Events.JC_LINKS ]
                    }
                });
        });        
    }

    unbind() {
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        // Remove the event
        handler.setCallback('jc', LC); 
    }

}

function useJCoupInterface() {
    let state = useSelector(makeSelector('jc', ['app_click_handler', 'app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new JCoupInterface(state, dispatcher);

    return intf;
}

export default useJCoupInterface;
export { initialJCoupState };