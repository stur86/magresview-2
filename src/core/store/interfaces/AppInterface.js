import _ from 'lodash';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { makeSelector, BaseInterface } from '../utils';
import { CallbackMerger, ClickHandler } from '../../../utils';

import { initialSelState } from './SelInterface';
import { initialCScaleState } from './CScaleInterface';
import { initialMSState } from './MSInterface';
import { initialEFGState } from './EFGInterface';
import { initialDipState } from './DipInterface';
import { initialJCoupState } from './JCoupInterface';
import { initialEulerState } from './EulerInterface';

import { Events } from '../listeners';

import CrystVis from 'crystvis-js';


const initialAppState = {
    app_viewer: null,
    app_click_handler: null,
    app_theme: 'dark',
    app_sidebar: 'load',
    app_default_displayed: null,
    app_model_queued: null
};

// Functions meant to operate on the app alone.
// These exist outside of the AppInterface because they will be invoked
// directly from inside the reducer as special actions
function appDisplayModel(state, m) {
    let app = state.app_viewer;
    let cm = app.model;

    let data = {};
    if (cm) {
        // We turn visualizations off
        data = {
            ...initialSelState,
            ...initialCScaleState,
            ...initialMSState,
            ...initialEFGState,
            ...initialDipState,
            ...initialJCoupState,
            ...initialEulerState
        };
    }

    // Return data for dispatch
    return {
        ...data,
        app_model_queued: m,
        listen_update: [Events.SEL_LABELS, Events.CSCALE,
                        Events.MS_ELLIPSOIDS, Events.MS_LABELS,
                        Events.EFG_ELLIPSOIDS, Events.EFG_LABELS, 
                        Events.DIP_LINKS, Events.JC_LINKS]
    };
}

function appDeleteModel(state, m) {
    
    let app = state.app_viewer;
    let data = {};

    // Delete a model
    app.deleteModel(m);

    let models = app.modelList;

    if (!app.model && models.length > 0) {
        // Let's display a different one
        data = appDisplayModel(state, models[0]);
    }

    return data;
}

class AppInterface extends BaseInterface {

    get initialised() {
        return this.viewer !== null;
    }

    get viewer() {
        return this.state.app_viewer;
    }

    get models() {
        let models = [];

        if (this.initialised) {
            models = this.viewer.modelList;
        }

        return models;
    }

    get currentModel() {
        let model = null;

        if (this.initialised) {
            model = this.viewer.model;
        }

        return model;
    }

    get currentModelName() {
        let model_name = null;

        if (this.initialised) {
            model_name = this.viewer.modelName;
        }

        return model_name;
    }

    get theme() {
        return this.state.app_theme;
    }

    set theme(v) {
        this.dispatch({
            type: 'set',
            key: 'app_theme',
            value: v
        });
    }

    get sidebar() {
        return this.state.app_sidebar;
    }

    set sidebar(v) {
        this.dispatch({
            type: 'set',
            key: 'app_sidebar',
            value: v
        });
    }

    initialise(elem) {
        console.log('Initialising CrystVis app on element ' + elem);
        // Initialise app but only if it's not already there
        const vis = new CrystVis(elem);
        vis.highlightSelected = true; // Our default
                
        const handler = new ClickHandler(vis);

        if (!this.initialised) {
            this.dispatch({
                type: 'update',
                data: {
                    app_viewer: vis,
                    app_click_handler: handler
                }
            });
        }
    }

    load(files, params={}, cback=null) {

        /* Load from a list of files, running a callback with the aggregate
        dictionary that reports the success for each of them */

        if (!this.initialised) {
            return;
        }

        let cbm = new CallbackMerger(files.length, cback);
        let app = this.viewer;
        let intf = this;

        // Callback for each file after the FileReader is done
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
                intf.display(to_display);
            }

            if (cback) {
                cbm.call(success);
            }
        }

        // Function that loads each individual file
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

    display(m) {
        this.dispatch({
            type: 'call',
            function: appDisplayModel,
            arguments: [m]
        });
    }

    delete(m) {
        this.dispatch({
            type: 'call',
            function: appDeleteModel,
            arguments: [m]
        });
    }

}

// Hook for interface
function useAppInterface() {
    let state = useSelector(makeSelector('app'), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new AppInterface(state, dispatcher);

    return intf;
}

export default useAppInterface;
export { initialAppState, appDisplayModel, appDeleteModel };