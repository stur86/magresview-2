import { makeSelector, makeDisplayLinks, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import CrystVis from 'crystvis-js';

const LC = CrystVis.LEFT_CLICK;

const initialDipState = {
    dip_view: null,
    dip_ghost_view: null,
    dip_link_names: [],
    dip_on: false,
    dip_central_atom: null,
    dip_radius: 1.0,
    dip_sphere_show: false
};

const dipDisplayLinks = makeDisplayLinks('dip');

class DipInterface extends BaseInterface {

    get isOn() {
        return this.state.dip_on;
    }

    set isOn(v) {
        let app = this.state.app_viewer;
        let intf = this;

        if (v) {
            app.onAtomClick((a, e) => { intf.centralAtom = a; }, LC);
        }
        else {
            app.onAtomClick(() => {}, LC);
        }

        this.dispatch({
            type: 'set',
            key: 'dip_on',
            value: v
        });

    }

    get centralAtom() {
        return this.state.dip_central_atom;
    }

    set centralAtom(v) {
        // Defining a custom function is important to make sure that the values of dip_radius and
        // dip_sphere_show are taken from the most recent state. If we just used 
        // 
        //      function: dipDisplayLinks
        //      arguments: [v, this.state.dip_radius, this.state.dip_sphere_show]
        //      
        // then those two arguments could be frozen at the state they were in when the click callback was
        // originally defined.
        this.dispatch({
            type: 'call',
            function: (state, atom) => { dipDisplayLinks(state, atom, state.dip_radius, state.dip_sphere_show); },
            arguments: [v]
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