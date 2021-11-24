import { makeSelector, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import CrystVis from 'crystvis-js';

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
    sel_hlight: true
};

function selSetSelection(state, sel) {
    let app = state.app_viewer;

    app.selected = sel;

    // Here go any additional callbacks
    
    return {
        sel_selected_view: sel
    };
}

function selSetDisplayed(state, displ) {
    let app = state.app_viewer;

    app.displayed = displ;

    return {
        sel_displayed_view: displ
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
        }
        this.dispatch({
            type: 'call',
            function: selSetDisplayed,
            arguments: [v]
        });
    }

    get highlight_selected() {
        return this.state.sel_hlight;
    }

    set highlight_selected(v) {
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

    get selection_on() {
        return this.state.sel_on;
    }

    set selection_on(v) {
        this.set_selection(this.selection_mode, {on: v});
    }

    get selection_mode() {
        return this.state.sel_mode;
    }

    set selection_mode(v) {
        this.set_selection(v);
    }

    get selection_sphere_r() {
        return this.state.sel_sphere_r;
    }

    set selection_sphere_r(v) {
        this.set_selection(this.selection_mode, {r: v});
    }

    get selection_bond_n() {
        return this.state.sel_bond_n;
    }

    set selection_bond_n(v) {
        this.set_selection(this.selection_mode, {n: v});
    }

    set_selection(mode, options={}) {
        // Set the selection for a certain mode and options

        let app = this.state.app_viewer;
        if (!app) 
            return;

        let default_options = {
            r: this.selection_sphere_r,
            n: this.selection_bond_n,
            on: this.selection_on
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
            sel_sph_r: options.r,
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
export { initialSelState };