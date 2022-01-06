import _ from 'lodash';

import { makeSelector, makeDisplayEllipsoids, makeDisplayLabels, makeDisplayCScales, BaseInterface } from '../utils';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialMSState = {
    ms_view: null,
    ms_ellipsoids_on: false,
    ms_ellipsoids_scale: 0.05,
    ms_labels_type: 'none',
    ms_cscale_type: 'none',
    ms_cscale_displ: null,
    ms_references: {}
};

const msColor = 0xff8000;

const msDisplayEllipsoids = makeDisplayEllipsoids('ms', msColor);
const msDisplayLabels = makeDisplayLabels('ms', msColor, (r) => ([1.414*r, 0.0, 0.0]));
const msDisplayCScales = makeDisplayCScales('ms');

// Update any new references for chemical shifts
function msSetReferences(state, refs=null) {

    let data = {
        ms_references: {}
    };

    // Default behaviour if refs is null is to clear everything,
    // otherwise we update the existing table.
    if (refs) {
        data.ms_references = {
            ...state.ms_references,
            ...refs
        };
    }

    // We then update the state and refresh the ms labels, in case any changes
    // are needed
    state.ms_references = data.ms_references;
    if (state.ms_labels_type === 'cs') {
        data = {
            ...data,
            ...msDisplayLabels(state, state.ms_labels_type)
        };
    }

    return data;
}

class MSInterface extends BaseInterface {

    get hasData() {
        let m = this.state.app_viewer.model;
        return (m && (m.hasArray('ms')));
    }

    get hasEllipsoids() {
        return this.state.ms_ellipsoids_on;
    }

    set hasEllipsoids(v) {
        this.dispatch({
            type: 'call',
            function: msDisplayEllipsoids,
            arguments: [v, this.state.ms_ellipsoids_scale]
        });
    }

    get ellipsoidScale() {
        return this.state.ms_ellipsoids_scale;
    }

    set ellipsoidScale(v) {
        this.dispatch({
            type: 'call',
            function: msDisplayEllipsoids,
            arguments: [this.state.ms_ellipsoids_on, v]
        });
    }

    get labelsMode() {
        return this.state.ms_labels_type;
    }

    set labelsMode(v) {
        this.dispatch({
            type: 'call', 
            function: msDisplayLabels,
            arguments: [v]
        });
    }

    get cscaleMode() {
        return this.state.ms_cscale_type;
    }

    set cscaleMode(v) {
        this.dispatch({
            type: 'call',
            function: msDisplayCScales,
            arguments: [v]
        });
    }

    get referenceTable() {

        if (!this.state.app_viewer || !this.state.app_viewer.model)
            return [];

        // Find the elements, then return the respective references as pairs
        const elements = _.uniq(this.state.app_viewer.model.symbols);
        const refs = this.state.ms_references;
        return _.fromPairs(elements.map((el) => [el, refs[el] || 0]));
    }

    updateReferenceTable(data) {
        this.dispatch({
            type: 'call',
            function: msSetReferences,
            arguments: [data]
        });
    }

    getReference(el) {
        return this.state.ms_references[el] || 0.0;
    }

}

function useMSInterface() {
    let state = useSelector(makeSelector('ms', ['app_viewer']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new MSInterface(state, dispatcher);

    return intf;
}

export default useMSInterface;
export { initialMSState, msDisplayEllipsoids, msDisplayLabels, msDisplayCScales, msSetReferences };