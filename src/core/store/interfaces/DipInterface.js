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
    dip_radius: 5.0,
    dip_sphere_show: true
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

    get showSphere() {
        return this.state.dip_sphere_show;
    }

    bind() {
        let app = this.state.app_viewer;
        let dispatch = this._dispatcher;

        if (!app)
            return;

        app.onAtomClick((a, e) => { 
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
        }, LC);        
    }

    unbind() {
        let app = this.state.app_viewer;

        if (!app)
            return;

        // Remove the event
        app.onAtomClick(() => {}, LC);
    }

}

function useDipInterface() {
    let state = useSelector(makeSelector('dip', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new DipInterface(state, dispatcher);

    return intf;
}

export default useDipInterface;
export { initialDipState };