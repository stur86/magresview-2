import _ from 'lodash';
import { getColorScale, dipolarCoupling, mergeOnly } from '../../utils';

function makeSelector(prefix, extras=[]) {
    // Creates and returns a selector function for a given prefix
    function _selector(state) {
        let ans = {};

        for (let key in state) {
            if (!_.startsWith(key, prefix) && extras.indexOf(key) === -1)
                continue;
            ans[key] = state[key];
        }

        return ans;
    }

    return _selector;
}

const _addPrefix = (p, n) => p + '_' + n;
const _getSel = (app) => app.selected.length > 0? app.selected : app.displayed;

function makeDisplayEllipsoids(name, color) {
    // Factory for a function that will be used for both MS and EFG with
    // minimal differences

    function displayfunc(state, parameters={}) {

        let app = state.app_viewer;
        let sel_old = state[_addPrefix(name, 'view')];

        const defaults = {
            [_addPrefix(name, 'ellipsoids_on')]: false,
            [_addPrefix(name, 'ellipsoids_scale')]: 1.0
        };

        // Update: first, use the current state values as defaults. Then,
        // change them with the passed parameters
        
        const options_old = mergeOnly(defaults, state);
        const options_new = mergeOnly(options_old, parameters);

        // What would be the "new" view?
        let sel = _getSel(app);

        // Aliases for convenience
        const on_old = options_old[_addPrefix(name, 'ellipsoids_on')];

        const on = options_new[_addPrefix(name, 'ellipsoids_on')];
        let scale = options_new[_addPrefix(name, 'ellipsoids_scale')];

        if (sel_old && (sel_old !== sel || (on_old && !on))) {
            // Something's changing. Remove old ellipsoids!
            sel_old.removeEllipsoids(name);
        }

        // Now for the new view and data
        if (on) {

            const data = sel.map((a) => a.getArrayValue(name));

            if (scale === 0) {
                // Auto scale needed
                let avg = data.map((t) => _.sum(t.eigenvalues.map(Math.abs))/3.0);
                avg = _.sum(avg)/data.length;
                scale = 2.0/avg;
            }

            if (sel_old === sel && on_old) {
                // Same view, we're just changing some properties
                sel.ellipsoidProperties(name, 'scalingFactor', scale);
            }
            else {
                // We need to create them from scratch
                sel.addEllipsoids(data, name, {scalingFactor: scale, color: color, opacity: 0.125});
            }
        }

        return {
            [_addPrefix(name, 'view')]: sel,
            ...options_new
        };
    }

    return displayfunc;
}

function _getNMRData(data, datatype, tenstype='ms') {

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

function makeDisplayLabels(name, color, shiftfunc) {

    // Factory for a function that will be used for both MS and EFG with
    // minimal differences

    function displayfunc(state, parameters={}) {

        let app = state.app_viewer;
        let sel_old = state[_addPrefix(name, 'view')];
        let ref_table = state[_addPrefix(name, 'references')];

        const defaults = {
            [_addPrefix(name, 'labels_type')]: 'none'
        };

        // Update: first, use the current state values as defaults. Then,
        // change them with the passed parameters
        
        const options_old = mergeOnly(defaults, state);
        const options_new = mergeOnly(options_old, parameters);

        let sel = _getSel(app);

        // Aliases
        const mode_old = options_old[_addPrefix(name, 'labels_type')];
        const mode = options_new[_addPrefix(name, 'labels_type')];
        let nmr_mode = mode;

        if (sel_old && (sel_old !== sel || (mode_old !== 'none' && mode === 'none'))) {
            // Remove old labels
            sel_old.removeLabels(name);
        }

        if (mode !== 'none') {

            // We add special instructions just for the case of referenced
            // chemical shifts. These only matter for MS, not EFG.
            if (mode === 'cs' && name === 'ms') {
                nmr_mode = 'iso'; // We then need to reference these
            }

            const data = sel.map((a) => [a.getArrayValue(name), a.isotopeData]);
            let [units, values] = _getNMRData(data, nmr_mode, name);

            // Second part, here we apply the formula:
            //     cs = ref - iso
            if (mode === 'cs' && name === 'ms') {
                // Referencing
                values = sel.map((a, i) => {
                    const ref = ref_table[a.element] || 0.0;
                    return ref-values[i];
                });
            }

            let label_texts = values.map((v) => v.toFixed(2) + ' ' + units);
            sel.addLabels(label_texts, name, (a, i) => ({ 
                color: color,  
                shift: shiftfunc(a.radius),
                height: 0.02
            }));
        }

        return {
            [_addPrefix(name, 'view')]: sel,
            ...options_new
        };
    }    

    return displayfunc;
}

function makeDisplayCScales(name) {

    // Factory for a function that will be used for both MS and EFG with
    // minimal differences

    function displayfunc(state, parameters={}) {

        let app = state.app_viewer;
        let displ_old = state[_addPrefix(name, 'cscale_displ')];

        let displ = app.displayed;

        const defaults = {
            [_addPrefix(name, 'cscale_type')]: 'none'
        };

        // Update: first, use the current state values as defaults. Then,
        // change them with the passed parameters
        
        const options_old = mergeOnly(defaults, state);
        const options_new = mergeOnly(options_old, parameters);

        let sel = _getSel(app);

        const mode = options_new[_addPrefix(name, 'cscale_type')];

        // Restore color to the grayed out atoms
        if (displ_old) {
            displ_old.setProperty('color', null);
        }

        if (mode !== 'none') {
    
            let notsel = displ.xor(sel);

            const data = sel.map((a) => [a.getArrayValue(name), a.isotopeData]);
            const nmrdata = _getNMRData(data, mode);
            const values = nmrdata[1];

            let minv = _.min(values);
            let maxv = _.max(values);
            let cs = getColorScale(minv, maxv, 'portland');
            let colors = values.map((v) => cs.getColor(v).toHexString());

            sel.setProperty('color', colors);
            notsel.setProperty('color', 0x888888);
        }

        return {
            [_addPrefix(name, 'view')]: sel,
            [_addPrefix(name, 'cscale_displ')]: displ,
            ...options_new
        };
    }    

    return displayfunc;
}

function _getLinkLabel(a1, a2, linktype) {

    switch (linktype) {
        case 'dip':
            const D = dipolarCoupling(a1, a2)[0];
            return (D/1e3).toFixed(2) + ' kHz';
        default:
            return '';
    }
}

function makeDisplayLinks(name, color) {

    // Factory for a function that will be used for both DIP and JCOUP with
    // minimal differences
    
    function displayfunc(state, parameters={}) {

        let app = state.app_viewer;
        let sel_old = state[_addPrefix(name, 'view')];
        let atom_old = state[_addPrefix(name, 'central_atom')];
        let links_old = state[_addPrefix(name, 'link_names')];

        let displ = app.displayed;

        const defaults = {
            [_addPrefix(name, 'links_on')]: false,
            [_addPrefix(name, 'central_atom')]: null,
            [_addPrefix(name, 'radius')]: 1.0,
            [_addPrefix(name, 'sphere_show')]: false
        };

        // Update: first, use the current state values as defaults. Then,
        // change them with the passed parameters
        
        const options_old = mergeOnly(defaults, state);
        const options_new = mergeOnly(options_old, parameters);

        console.log(options_new);

        let sel = _getSel(app);
        let model = app.model;
        //let sphc = model._querySphere(atom, radius);
        
        const atom = options_new[_addPrefix(name, 'central_atom')];
        const on = options_new[_addPrefix(name, 'links_on')];

        // First, cleaning up old visualisation
        links_old.forEach((name) => { model.removeGraphics(name); });

        // Now creating a new one
        let links = [];
        if (on && atom && sel) {
            sel.atoms.forEach((a2, i) => {

                if (a2 === atom)
                    return;

                const lname = name + '_link_' + i;
                const label = _getLinkLabel(atom, a2, name);
                model.addLink(atom, a2, lname, label, {
                    color: color,
                    dashed: true,
                    onOverlay: true
                });
                links.push(lname);
            });
        }

        return {
            [_addPrefix(name, 'view')]: sel,
            [_addPrefix(name, 'link_names')]: links,
            ...options_new
        };
    }

    return displayfunc;

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
    makeDisplayEllipsoids, 
    makeDisplayLabels, 
    makeDisplayCScales, 
    makeDisplayLinks,
    BaseInterface 
};