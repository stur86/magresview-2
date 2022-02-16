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
import { eulerBetweenTensors } from '../../../utils';

import { shallowEqual, useSelector, useDispatch } from 'react-redux';

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
    eul_convention: 'zyz',
    eul_results: null
};

const tensorValues = new Set(['ms', 'efg']);
const conventionValues = new Set(['zyz', 'zxz']);

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

function makeEulerAction(data) {
    return {
        type: 'update',
        data: {
            ...data,
            listen_update: [Events.EUL_ANGLES]
        }
    };
}

class EulerInterface extends DataCheckInterface {

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

    get convention() {
        return this.state.eul_convention;
    }

    set convention(v) {
        if (!conventionValues.has(v))
            throw Error('Invalid Euler angles convention');
        this.dispatch(makeEulerAction({eul_convention: v}));
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
            throw Error('Invalid NMR tensor for Euler angles');
        this.dispatch(makeEulerAction({['eul_tensor_' + ending]: v}));
    }

    get atomA() {
        return this.state.eul_atom_A;
    }

    get atomLabelA() {
        return this._getAtomLabel('A');
    }

    get atomB() {
        return this.state.eul_atom_B;
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

    _getResult(i, rad=false) {
        let f = rad? 1.0 : 180/Math.PI;
        let r = this.state.eul_results;
        return r? (r[i]*f) : 'N/A';        
    }

    get alpha() {
        return this._getResult(0);
    }

    get beta() {
        return this._getResult(1);
    }

    get gamma() {
        return this._getResult(2);
    }

    get alphaRad() {
        return this._getResult(0, true);
    }

    get betaRad() {
        return this._getResult(1, true);
    }

    get gammaRad() {
        return this._getResult(2, true);
    }

    bind() {
        const dispatch = this._dispatcher;
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        handler.setCallback('eul', LC, makeCallback(dispatch, 'A'));
        handler.setCallback('eul', RC, makeCallback(dispatch, 'B'));
    }

    unbind() {
        const handler = this.state.app_click_handler;

        if (!handler)
            return;

        handler.setCallback('eul', LC);
        handler.setCallback('eul', RC);

        this.dispatch(makeEulerAction({
            eul_newatom_A: null,
            eul_newatom_B: null
        }));
    }

    txtReport() {
        let report = 'Euler angles between tensors:\n';

        report += `${this.tensorA} on ${this.atomLabelA}\nand\n`;
        report += `${this.tensorB} on ${this.atomLabelB}\n\n`;

        report += `Convention: ${this.convention.toUpperCase()}\n\n`;

        report += `Degrees:\n${this.alpha}    ${this.beta}    ${this.gamma}\n\n`;
        report += `Radiants:\n${this.alphaRad}     ${this.betaRad}     ${this.gammaRad}`;

        return report;
    }

    txtSelfAngleTable() {
        // Return a full table of MS-to-EFG tensor angles for each atom
        if (!(this.hasMSData && this.hasEFGData)) {
            // Pointless
            throw Error('Both MS and EFG tensors are needed to compute the table');
        }

        // Selection if available, otherwise displayed atoms
        let targ = this.state.app_viewer.selected;
        targ = (targ.length > 0)? targ : this.state.app_viewer.displayed;

        const data = targ.map((a, i) => {
            return [a.crystLabel, a.getArrayValue('ms'), a.getArrayValue('efg')];
        });

        let table = `Euler angles between MS and EFG tensors in radiants, convention: ${this.convention.toUpperCase()}\n`;
        let conv = this.convention;

        data.forEach((d, i) => {

            let [label, ms, efg] = d;


            let [alpha, beta, gamma] = eulerBetweenTensors(ms, efg, conv);

            table += `${label}    ${alpha}    ${beta}    ${gamma}\n`;
        });

        return table;
    }
}

function useEulerInterface() {
    let state = useSelector(makeSelector('eul', ['app_viewer', 'app_click_handler']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new EulerInterface(state, dispatcher);

    return intf;
}

export default useEulerInterface;
export { initialEulerState };