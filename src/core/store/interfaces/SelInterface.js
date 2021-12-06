import { makeSelector, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import CrystVis from 'crystvis-js';

import { msDisplayEllipsoids, msDisplayLabels, msDisplayCScales } from './MSInterface';

const LC = CrystVis.LEFT_CLICK;
const SLC = CrystVis.LEFT_CLICK + CrystVis.SHIFT_BUTTON;
const CLC = CrystVis.LEFT_CLICK + CrystVis.CTRL_BUTTON;

const initialSelState = {
    sel_selected_view: null,
    sel_displayed_view: null,
    sel_on: false,
    sel_mode: 'atom',
    sel_sphere_r: 2.0,
    sel_bond_n: 1,
    sel_hlight: true,
    sel_labels_view: null,
    sel_show_labels: false
};

function selShowLabels(state, show) {

    let app = state.app_viewer;
    let sel_old = state.sel_labels_view;
    let show_old = state.sel_show_labels;

    let sel = app.displayed;

    if (sel_old && (sel_old !== sel || (show_old && !show))) {
        // Remove old labels
        sel_old.removeLabels('cryst');
    }

    if (show) {
        const label_texts = sel.map((a) => a.crystLabel);
        sel.addLabels(label_texts, 'cryst', (a, i) => ({ 
            shift: [0.1414*a.radius, 0.1414, 0]
        }));
    }

    return {
        sel_labels_view: sel,
        sel_show_labels: show
    };
}    


function selSetSelection(state, sel, set_displayed=false) {
    let app = state.app_viewer;
    let data = {};

    if (!set_displayed) {
        app.selected = sel;
        data.sel_selected_view = sel;
    }
    else {
        app.displayed = sel;
        data.sel_displayed_view = sel;
    }

    // We now update all views that may be changed as a result of this
    let msdata = {
        ...selShowLabels(state, state.sel_show_labels),
        ...msDisplayEllipsoids(state, state.ms_ellipsoids_on, state.ms_ellipsoids_scale),
        ...msDisplayLabels(state, state.ms_labels_type),
        ...msDisplayCScales(state, state.ms_cscale_type)
    };
    
    return {
        ...data,
        ...msdata
    };
}

class SelInterface extends BaseInterface {

    get selected() {
        return this.state.sel_selected_view;
    }

    set selected(v) {
        this.dispatch({
            type: 'call', 
            function: selSetSelection,
            arguments: [v]
        });
    }

    get displayed() {
        return this.state.sel_displayed_view;
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
            arguments: [v, true]
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

        app.highlight_selected = v;
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
            arguments: [v]
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
                        return app.model.view([a.img_index]); // Just the one
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
                        found = found.concat([a.img_index]); // Crystvis excludes the original atom
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

        console.log(selFunc);
        console.log(options);        

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