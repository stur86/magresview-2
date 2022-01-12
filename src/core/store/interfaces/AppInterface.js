import _ from 'lodash';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { makeSelector, BaseInterface } from '../utils';
import { CallbackMerger } from '../../../utils';
import { msSetReferences } from './MSInterface';
import { dipDisplayLinks } from './DipInterface';
import { Events } from '../listeners';

import CrystVis from 'crystvis-js';


const initialAppState = {
    app_viewer: null,
    app_theme: 'dark',
    app_sidebar: 'load',
    app_default_displayed: null
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
            sel_sites_labels_type: 'none',
            ms_ellipsoids_on: false,
            ms_labels_type: 'none',
            ms_cscale_type: 'none',
            efg_ellipsoids_on: false,
            efg_labels_type: 'none',
            efg_cscale_type: 'none',
            ...msSetReferences(state),
            ...dipDisplayLinks(state, { dip_links_on: false, dip_central_atom: null })
        };
    }

    app.displayModel(m);

    // Return data for dispatch
    return {
        app_default_displayed: app.displayed,
        ...data,
        listen_update: [Events.SEL_LABELS, Events.CSCALE,
                        Events.MS_ELLIPSOIDS, Events.MS_LABELS,
                        Events.EFG_ELLIPSOIDS, Events.EFG_LABELS]
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
        var vis = new CrystVis(elem);
        vis.highlightSelected = true; // Our default
                
        if (!this.initialised) {
            this.dispatch({type: 'set', key: 'app_viewer', value: vis});
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