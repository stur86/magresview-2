import _ from 'lodash';

import { CallbackMerger } from '../../utils';
import CrystVis from 'crystvis-js';

// Secondary interfaces
import MVSelectInterface from './MVSelectInterface';

/* This and secondary Interface classes serve as a useful way to hold a lot
 * of methods that we'll use a lot. They also keep track of changes and 
 * re-run plotting and such whenever something at a higher level has changed.
 * They will be re-instanced often, so it's important that their constructor
 * methods are very light and only work by reference!
 */
class MVInterface {

    constructor(state, dispatch) {
        this._state = state;
        this._dispatch = dispatch;

        // Secondary interfaces
        this._select = new MVSelectInterface(this);
    }

    // Basic access
    get state() {
        return this._state;
    }

    get dispatch() {
        return this._dispatch;
    }

    // Properties for quick state access
    get theme() {
        return this._state.theme;
    }

    set theme(t) {
        this._dispatch({type: 'set', key: 'theme', value: t});
    }

    get panel() {
        return this._state.panel;
    }

    set panel(p) {
        this._dispatch({type: 'set', key: 'panel', value: p});        
    }

    get app() {
        return this._state.visualizer;
    }

    get models() {
        return this.app.model_list;
    }

    // Sub interfaces
    get select() {
        return this._select;
    }

    // Methods for easy dispatch
    init(elem) {
        console.log('Initialising CrystVis app on element ' + elem);
        // Initialise app but only if it's not already there
        var vis = new CrystVis(elem);

        // Some other stuff
        vis.highlight_selected = this.select.highlighted;
        if (this.app === null) {
            this._dispatch({type: 'initialise', visualizer: vis});
        }
    }

    load(files, params={}, cback=null) {

        let cbm = new CallbackMerger(files.length, cback);
        let app = this.app;

        function onLoad(contents, name, extension) {
            var success = app.loadModels(contents, extension, name, params);

            // Find a valid one to load
            var to_display = null;
            _.map(success, (v, n) => {
                if (v === 0) {
                    to_display = n;
                }
            });

            if (to_display) {
                app.displayModel(to_display);
            }

            if (cback) {
                cbm.call(success);
            }
        }

        function parseOne(f) {
            
            let reader = new FileReader();
            // Extension and file name
            let name = f.name.split('.')[0];
            let extension = f.name.split('.').pop();

            reader.onload = ((e) => { onLoad(e.target.result, name, extension) });
            reader.readAsText(f);            
        }

        _.forEach(files, parseOne);
    }

}

export default MVInterface;