/**
 * Here we store a singleton object that is used to refer to the main CrystVis 
 * instance used to visualise everything
 */

import CrystVis from 'crystvis-js';
import _ from 'lodash';

import { CallbackMerger } from '../../utils';

var _cvis_app = null;

class Viewer {

    initialise(element, width = 0, height = 0) {
        if (_cvis_app) {
            throw new Error('CrystVis app is already initialised');
        }

        _cvis_app = new CrystVis(element, width, height);
    }

    terminate() {
        if (!_cvis_app) {
            throw new Error('CrystVis app is not initialised');
        }

        var r = _cvis_app.renderer;
        r._div.remove(r._r.domElement); // Remove the element from canvas

        _cvis_app = null;
    }

    loadFile(files, params={}, cback=null) {

        let cbm = new CallbackMerger(files.length, cback);

        function onLoad(contents, name, extension) {
            var success = _cvis_app.loadModels(contents, extension, name, params);

            // Find a valid one to load
            var to_display = null;
            _.map(success, (v, n) => {
                if (v === 0) {
                    to_display = n;
                }
            });

            if (to_display) {
                _cvis_app.displayModel(to_display);
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

    get instance() {
        return _cvis_app;
    }

}

const viewerSingleton = new Viewer();
Object.freeze(viewerSingleton);

export default viewerSingleton;