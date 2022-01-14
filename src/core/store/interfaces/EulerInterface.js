import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { makeSelector, BaseInterface } from '../utils';
import { Events } from '../listeners';

import CrystVis from 'crystvis-js';

const LC = CrystVis.LEFT_CLICK;
const RC = CrystVis.RIGHT_CLICK;

const initialEulerState = {
    eul_atom_A: null,
    eul_newatom_A: null,
    eul_tensor_A: 'ms',
    eul_atom_B: null,
    eul_newatom_B: null,
    eul_tensor_B: 'ms',
    eul_show_labels: false,
    eul_results: null
};

const tensorValues = new Set(['ms', 'efg']);

function makeCallback(dispatch, ending='A') {    

    function cback(a, e) {
        dispatch({
            type: 'update',
            data: {
                ['eul_newatom_' + ending]: a,
                listen_update: [Events.EUL_ANGLES]
            }
        });
    }

    return cback;
}

class EulerInterface extends BaseInterface {

    get hasModel() {
        let app = this.state.app_viewer;
        return (app && this.state.app_viewer.model);
    }

    get hasMSData() {
        let app = this.state.app_viewer;
        return (app && app.model && (app.model.hasArray('ms')));            
    }

    get hasEFGData() {
        let app = this.state.app_viewer;
        return (app && app.model && (app.model.hasArray('efg')));            
    }

    _getAtomLabel(ending='A') {
        let a = this.state['eul_atom_' + ending];
        if (a)
            return a.crystLabel
        else
            return 'Not selected'        
    }

    _setTensorType(v, ending='A') {
        if (!tensorValues.has(v))
            return;
        this.dispatch({
            type: 'update',
            data: {
                ['eul_tensor_' + ending]: v,
                listen_update: [Events.EUL_ANGLES]
            }
        });
    }

    get atomLabelA() {
        return this._getAtomLabel('A');
    }

    get atomLabelB() {
        return this._getAtomLabel('B');
    }

    get tensorA() {
        return this.state.eul_tensor_A;
    }

    set tensorA(v) {
        this._setTensorType(v, 'A');
    }

    get tensorB() {
        return this.state.eul_tensor_B;
    }

    set tensorB(v) {
        this._setTensorType(v, 'B');        
    }

    bind() {
        let app = this.state.app_viewer;
        let dispatch = this._dispatcher;

        if (!app)
            return;

        app.onAtomClick(makeCallback(dispatch, 'A'), LC);
        app.onAtomClick(makeCallback(dispatch, 'B'), RC);
    }

    unbind() {
        let app = this.state.app_viewer;

        if (!app)
            return;

        app.onAtomClick(() => {}, LC);
        app.onAtomClick(() => {}, RC);
    }
}

function useEulerInterface() {
    let state = useSelector(makeSelector('eul', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new EulerInterface(state, dispatcher);

    return intf;
}

export default useEulerInterface;
export { initialEulerState };