import _ from 'lodash';
import { dipolarCoupling, jCoupling } from '../../utils';

function makeSelector(prefix, extras=[]) {
    // Creates and returns a selector function for a given prefix
    function selector(state) {
        let ans = {};

        for (let key in state) {
            if (!_.startsWith(key, prefix) && extras.indexOf(key) === -1)
                continue;
            ans[key] = state[key];
        }

        return ans;
    }

    return selector;
}

const addPrefix = (p, n) => p + '_' + n;
const getSel = (app) => app.selected.length > 0? app.selected : app.displayed;

function getNMRData(data, datatype, tenstype='ms') {

    let units = '';
    let tens_units = {
        ms: 'ppm',
        efg: 'au'
    }[tenstype];
    let values = null;

    switch(datatype) {
        case 'iso': 
            values = data.map(([T, iD]) => T.isotropy);
            units = tens_units;
            break;
        case 'aniso':
            values = data.map(([T, iD]) => T.anisotropy);
            units = tens_units;
            break;            
        case 'asymm':
            values = data.map(([T, iD]) => T.asymmetry);
            break;
        case 'span':
            values = data.map(([T, iD]) => T.span);
            break;
        case 'skew':
            values = data.map(([T, iD]) => T.skew);
            break;
        case 'e_x':
            values = data.map(([T, iD]) => T.haeberlen_eigenvalues[0]);
            break;
        case 'e_y':
            values = data.map(([T, iD]) => T.haeberlen_eigenvalues[1]);
            break;
        case 'e_z':
            values = data.map(([T, iD]) => T.haeberlen_eigenvalues[2]);
            break;
        case 'Q':
            values = data.map(([T, iD]) => T.efgAtomicToHz(iD.Q).haeberlen_eigenvalues[2]/1e3);
            units = 'kHz';
            break;
        default:
            break;
    }

    return [units, values];
}

function getLinkLabel(a1, a2, linktype) {

    switch (linktype) {
        case 'dip':
            const D = dipolarCoupling(a1, a2)[0];
            return (D/1e3).toFixed(2) + ' kHz';
        case 'jc':
            const J = jCoupling(a1, a2);
            if (J === null) {
                return '';
            }
            return J.toFixed(2) + ' Hz';
        default:
            return '';
    }
}


class BaseInterface {

    constructor(state, dispatcher) {
        this._state = state;
        this._dispatcher = dispatcher;
    }

    get state() {
        return this._state;
    }

    dispatch(action) {
        this._dispatcher(action);
    }

}

export { 
    makeSelector, 
    addPrefix,
    getSel,
    getNMRData,
    getLinkLabel,
    BaseInterface 
};