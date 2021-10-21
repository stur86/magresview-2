/**
 * Here we store a singleton object that is used to refer to the main CrystVis 
 * instance used to visualise everything
 */

import CrystVis from 'crystvis-js';

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

    loadFile(f, params={}, cback=null) {
        if (f.length > 1) {
            // We don't support multiple files for now
            throw new Error('Multiple file loading is not supported');
        }

        const reader = new FileReader();
        // Extension and file name
        var name = f[0].name.split('.')[0];
        var extension = f[0].name.split('.').pop();

        reader.onload = function(e) {
            var success = _cvis_app.loadModels(reader.result, extension, name, params);
            _cvis_app.displayModel(Object.keys(success)[0]);

            if (cback) {
                cback(success);
            }
        }        
        reader.readAsText(f[0]);
    }

    get instance() {
        return _cvis_app;
    }

}

const viewerSingleton = new Viewer();
Object.freeze(viewerSingleton);

export default viewerSingleton;