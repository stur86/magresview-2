import { makeSelector, makeDisplayLinks, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import CrystVis from 'crystvis-js';

const LC = CrystVis.LEFT_CLICK;

const initialDipState = {
    dip_view: null,
    dip_ghost_view: null,
    dip_link_names: [],
    dip_links_on: false,
    dip_central_atom: null,
    dip_radius: 1.0,
    dip_sphere_show: false
};

const dipColor = 0x00ff80;

const dipDisplayLinks = makeDisplayLinks('dip', dipColor);

class DipInterface extends BaseInterface {

    get isOn() {
        return this.state.dip_links_on;
    }

    set isOn(v) {
        let app = this.state.app_viewer;
        let intf = this;
        let dispatch = this._dispatcher;

        if (v) {
            app.onAtomClick((a, e) => { 
                dispatch({
                    type: 'call',
                    function: dipDisplayLinks,
                    arguments: [{ dip_central_atom: a }]
                });
            }, LC);

            this.dispatch({
                type: 'call',
                function: dipDisplayLinks,
                arguments: [{ dip_links_on: true }]
            });
        }
        else {
            // Remove the event
            app.onAtomClick(() => {}, LC);
            // And also clean up the existing visualisation
            this.dispatch({
                type: 'call',
                function: dipDisplayLinks,
                arguments: [{ dip_links_on: false, dip_central_atom: null }]
            });
        }

    }

    get centralAtom() {
        return this.state.dip_central_atom;
    }

    set centralAtom(v) {
        this.dispatch({
            type: 'call',
            function: dipDisplayLinks,
            arguments: [{ dip_central_atom: v }]
        });
    }

    get radius() {
        return this.state.dip_radius;
    }

    get showSphere() {
        return this.state.dip_sphere_show;
    }

}

function useDipInterface() {
    let state = useSelector(makeSelector('dip', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new DipInterface(state, dispatcher);

    return intf;
}

export default useDipInterface;
export { initialDipState, dipDisplayLinks };