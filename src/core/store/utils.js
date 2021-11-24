import _ from 'lodash';

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

function makeDisplayEllipsoids(name, color) {
    // Factory for a function that will be used for both MS and EFG with
    // minimal differences
    
    const add_prefix = (p, n) => p + '_' + n;

    function displayfunc(state, on, scale=null) {

        let app = state.app_viewer;
        let sel_old = state[add_prefix(name, 'view')];
        let on_old = state[add_prefix(name, 'ellipsoids_on')];

        if (scale === null)
            scale = state[add_prefix(name, 'ellipsoids_scale')];

        // What would be the "new" view?
        let sel = app.selected;

        if (sel.length === 0) {
            sel = app.displayed;
        }

        if (sel_old && (sel_old !== sel || (on_old && !on))) {
            // Something's changing. Remove old ellipsoids!
            sel_old.removeEllipsoids(name);
        }

        // Now for the new view and data
        if (on) {
            if (sel_old === sel && on_old) {
                // Same view, we're just changing some properties
                sel.ellipsoidProperties(name, 'scalingFactor', scale);
            }
            else {
                // We need to create them from scratch
                let data = sel.map((a) => a.getArrayValue(name));
                sel.addEllipsoids(data, name, {scalingFactor: scale, color: color, opacity: 0.25});
            }
        }

        return {
            [add_prefix(name, 'view')]: sel,
            [add_prefix(name, 'ellipsoids_on')]: on,
            [add_prefix(name, 'ellipsoids_scale')]: scale
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

export { makeSelector, makeDisplayEllipsoids, BaseInterface };