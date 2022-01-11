import { mergeOnly } from '../../../utils';
import { makeSelector, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import CrystVis from 'crystvis-js';

import { efgDisplayLabels, efgDisplayCScales } from './EFGInterface';
import { dipDisplayLinks } from './DipInterface';

import { updateViews } from '../updates';

const LC = CrystVis.LEFT_CLICK;
const SLC = CrystVis.LEFT_CLICK + CrystVis.SHIFT_BUTTON;
const CLC = CrystVis.LEFT_CLICK + CrystVis.CTRL_BUTTON;

const initialSelState = {
    sel_selected_view: null,
    sel_displayed_view: null,
    sel_ghosts_view: null,
    sel_on: false,
    sel_mode: 'atom',
    sel_sphere_r: 2.0,
    sel_bond_n: 1,
    sel_hlight: true,
    sel_labels_view: null,
    sel_show_labels: false
};

function selShowLabels(state, parameters = {}) {

    let app = state.app_viewer;
    let sel_old = state.sel_labels_view;

    const defaults = {
        sel_show_labels: false,
    };

    let options_old = mergeOnly(defaults, state);
    let options_new = mergeOnly(options_old, parameters);

    let sel = app.displayed;

    let show_old = options_old.sel_show_labels;
    let show = options_new.sel_show_labels;

    if (sel_old && (sel_old !== sel || (show_old && !show))) {
        // Remove old labels
        sel_old.removeLabels('cryst');
    }

    if (show) {
        const label_texts = sel.map((a) => a.crystLabel);
        sel.addLabels(label_texts, 'cryst', (a, i) => ({ 
            shift: [a.radius, a.radius, 0],
            height: 0.02
        }));
    }

    return {
        sel_labels_view: sel,
        sel_show_labels: show
    };
}    


function selSetSelection(state, sel, set_mode='selection') {

    let data = {};

    switch (set_mode) {
        case 'selection':
            data.sel_selected_view = sel;
            break;
        case 'displayed':
            data.sel_displayed_view = sel;
            break;
        default:
            break;        
    }

    return updateViews(state, data);

}

function selSetIsotope(state, sel, A) {

    sel.setProperty('isotope', A);

    // Now refresh all relevant visualisations
    const data = {
        ...efgDisplayLabels(state),
        ...efgDisplayCScales(state),
        ...dipDisplayLinks(state)
    };

    return data;
}

class SelInterface extends BaseInterface {

    get app() {
        return this.state.app_viewer;
    }

    get selected() {
        return this.state.sel_selected_view;
    }

    set selected(v) {
        if (!v) {
            let model = this.state.app_viewer.model;
            if (model) {
                v = model.view([]);
            }
        }

        this.dispatch({
            type: 'call', 
            function: selSetSelection,
            arguments: [v]
        });
    }

    get displayed() {
        return this.state.sel_displayed_view || this.state.app_default_displayed;
    }

    set displayed(v) {
        if (!v) {
            v = this.state.app_default_displayed;
            if (!v) {
                // Then there's just no model at all
                return;
            }
        }
        this.dispatch({
            type: 'call',
            function: selSetSelection,
            arguments: [v, 'displayed']
        });
    }

    get defaultDisplayed() {
        return this.state.app_default_displayed;
    }

    get highlightSelected() {
        return this.state.sel_hlight;
    }

    set highlightSelected(v) {
        let app = this.state.app_viewer;

        if (!app)
            return;

        app.highlightSelected = v;
        this.dispatch({
            type: 'set',
            key: 'sel_hlight',
            value: v
        });
    }

    get showCrystLabels() {
        return this.state.sel_show_labels;
    }

    set showCrystLabels(v) {
        this.dispatch({
            type: 'call',
            function: selShowLabels,
            arguments: [{ sel_show_labels: v }]
        });
    }

    get selectionOn() {
        return this.state.sel_on;
    }

    set selectionOn(v) {
        this.setSelection(this.selectionMode, {on: v});
    }

    get selectionMode() {
        return this.state.sel_mode;
    }

    set selectionMode(v) {
        this.setSelection(v);
    }

    get selectionSphereR() {
        return this.state.sel_sphere_r;
    }

    set selectionSphereR(v) {
        this.setSelection(this.selectionMode, {r: v});
    }

    get selectionBondN() {
        return this.state.sel_bond_n;
    }

    set selectionBondN(v) {
        this.setSelection(this.selectionMode, {n: v});
    }

    get isotopeChoices() {
        // Find which isotopes are available for the currently selected atoms
        let sel = this.selected;
        if (sel === null) {
            return null;
        }

        let elements = sel.map((a, i) => a.element);
        // Are they all the same?
        let el = elements[0];
        if (!elements.reduce((s, x) => (s && x === el), true)) {
            return null;
        }

        // Get the isotope information
        let eData = sel.atoms[0].elementData;

        let iKeys = Object.keys(eData.isotopes).sort();
        let iData = iKeys.map((A, i) => {
            let iso = eData.isotopes[A];
            return {
                A: A,
                is_nmr_active: iso.spin !== 0,
                is_Q_active: iso.Q !== 0,
                is_max_nmr: A === eData.maxiso_NMR,
                is_max_Q: A === eData.maxiso_Q,
                abundance: iso.abundance
            };
        });

        return iData;
    }

    setIsotope(A) {
        let sel = this.selected;
        if (sel === null) {
            return null;
        }

        this.dispatch({
            type: 'call',
            function: selSetIsotope,
            arguments: [sel, A]
        });
    }

    setSelection(mode, options={}) {
        // Set the selection for a certain mode and options

        let app = this.state.app_viewer;
        if (!app) 
            return;

        let default_options = {
            r: this.selectionSphereR,
            n: this.selectionBondN,
            on: this.selectionOn
        };

        options = {
            ...default_options,
            ...options
        };

        // Selector functions
        let selFunc = null;

        if (options.on) {
            switch(mode) {
                case 'atom':
                    selFunc = ((a, e) => {
                        return app.model.view([a.imgIndex]); // Just the one
                    });
                    break;
                case 'element':
                    // Selector function
                    selFunc = ((a, e) => {
                        var found = app.model._queryElements(a.element);
                        return app.model.view(found);
                    });
                    break;
                case 'sphere':
                    const r = options.r;
                    selFunc = ((a, e) => {
                        var found = app.model._querySphere(a, r); 
                        return app.model.view(found);
                    });
                    break;
                case 'molecule': 
                    selFunc = ((a, e) => {
                        var found = app.model._queryMolecule(a);
                        return app.model.view(found);
                    });
                    break;
                case 'bonds':
                    const n = options.n;
                    selFunc = ((a, e) => {
                        var found = app.model._queryBonded(a, n, false);
                        found = found.concat([a.imgIndex]); // Crystvis excludes the original atom
                        return app.model.view(found);
                    });
                    break;
                default:
                    // No selection at all
                    break;
            }
        }

        // We use this to guarantee that the selection still doesn't go out of
        // the default display (e.g. the main cell). Everything else remains
        // hidden or can be used as ghost for other purposes
        var dd = this.state.app_default_displayed;
        var intf = this;

        if (selFunc) {
            app.onAtomClick((a, e) => { intf.selected = dd.and(selFunc(a, e)); }, LC);
            app.onAtomClick((a, e) => { intf.selected = dd.and(app.selected.or(selFunc(a, e))); }, SLC);
            app.onAtomClick((a, e) => { intf.selected = dd.and(app.selected.xor(selFunc(a, e))); }, CLC);
        }
        else {
            app.onAtomClick((a, e) => {}, LC);
            app.onAtomClick((a, e) => {}, SLC);
            app.onAtomClick((a, e) => {}, CLC);            
        }

        this.dispatch({type: 'update', data: {
            sel_mode: mode,
            sel_sphere_r: options.r,
            sel_bond_n: options.n,
            sel_on: options.on
        }});
    }

}

// Hook for interface
function useSelInterface() {
    let state = useSelector(makeSelector('sel', ['app_viewer', 'app_default_displayed']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new SelInterface(state, dispatcher);

    return intf;
}


export default useSelInterface;
export { initialSelState, selShowLabels };