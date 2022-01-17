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
                        jc_central_atom: a,
                        listen_update: [ Events.JC_LINKS ]
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

function useJCoupInterface() {
    let state = useSelector(makeSelector('jc', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new JCoupInterface(state, dispatcher);

    return intf;
}

export default useJCoupInterface;
export { initialJCoupState };