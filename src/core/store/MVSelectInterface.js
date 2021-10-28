import MVSubInterface from './MVSubInterface';
import CrystVis from 'crystvis-js';

const LC = CrystVis.LEFT_CLICK;
const SLC = CrystVis.LEFT_CLICK + CrystVis.SHIFT_BUTTON;
const CLC = CrystVis.LEFT_CLICK + CrystVis.CTRL_BUTTON;

class MVSelectInterface extends MVSubInterface {

    _hlight = true

    get highlighted() {
        return this._hlight;
    }

    set highlighted(v) {
        this._hlight = v;
        this.parent.app.highlight_selected = v;
    }

    set_select(mode, options={}) {

        // App
        var app = this.parent.app;
        if (!app) 
            return;

        // Set the selection callbacks for a certain mode on picking an atom
        var selFunc = null; // Selector function (defined only in some cases)
        switch(mode) {
            case 'atom':
                // We can use the CrystVis defaults
                app.onAtomClick(null, LC);
                app.onAtomClick(null, SLC);
                app.onAtomClick(null, CLC);
                break;
            case 'element':
                // Selector function
                selFunc = ((a, e) => {
                    var found = app.model._queryElements(a.element);
                    return app.model.view(found);
                });
                break;
            case 'sphere':
                const r = options.r || 2.0; // Default 2 Angstroms
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
                const n = options.n || 1;
                selFunc = ((a, e) => {
                    var found = app.model._queryBonded(a, n, false);
                    return app.model.view(found);
                });
                break;
            default:
                // No selection at all
                app.onAtomClick((a, e) => {}, LC);
                app.onAtomClick((a, e) => {}, SLC);
                app.onAtomClick((a, e) => {}, CLC);
                break;
        }

        if (selFunc) {
            app.onAtomClick((a, e) => { app.selected = selFunc(a, e); }, LC);
            app.onAtomClick((a, e) => { app.selected = app.selected.or(selFunc(a, e)); }, SLC);
            app.onAtomClick((a, e) => { app.selected = app.selected.xor(selFunc(a, e)); }, CLC);
        }
    }

    set_display(mode) {

        // App
        var app = this.parent.app;
        if (!app) 
            return;

        switch (mode) {
            case 'selected':
                app.displayed = app.selected;
                break;
            default:
                // Restore original
                let m = app.model;
                if (m)
                    app.displayed = m.view(m._queryCell([0,0,0]));
                break;
        }

    }

}

export default MVSelectInterface;