/**
 * MagresView 2.0
 *
 * A web interface to visualize and interact with computed NMR data in the Magres
 * file format.
 *
 * Author: Simone Sturniolo
 *
 * Copyright 2022 Science and Technology Facilities Council
 * This software is distributed under the terms of the MIT License
 * Please refer to the file LICENSE for the text of the license
 * 
 */

import _ from 'lodash';

import { Events } from '../listeners';
import CScaleInterface, { makeCScaleSelector } from './CScaleInterface';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

const initialMSState = {
    ms_view: null,
    ms_ellipsoids_on: false,
    ms_ellipsoids_scale: 0.05,
    ms_labels_type: 'none',
    ms_references: {}
};

// Update any new references for chemical shifts
function msSetReferences(state, refs=null) {

    let new_refs = {};

    // Default behaviour if refs is null is to clear everything,
    // otherwise we update the existing table.
    if (refs) {
        new_refs = {
            ...state.ms_references,
            ...refs
        };
    }

    // We then update the state and refresh the ms labels, in case any changes
    // are needed
    return {
        ms_references: new_refs,
        listen_update: [Events.MS_LABELS, Events.CSCALE, Events.PLOTS_RECALC]
    };
}

// Action creator
const msAction = function(data, update=[]) {
    return {
        type: 'update',
        data: {
            ...data,
            listen_update: update
        }
    };
}

class MSInterface extends CScaleInterface {

    get hasData() {
        let app = this.state.app_viewer;
        return (app && app.model && (app.model.hasArray('ms')));        
    }

    get hasEllipsoids() {
        return this.state.ms_ellipsoids_on;
    }

    set hasEllipsoids(v) {
        this.dispatch(msAction({ ms_ellipsoids_on: v }, [Events.MS_ELLIPSOIDS]));
    }

    get ellipsoidScale() {
        return this.state.ms_ellipsoids_scale;
    }

    set ellipsoidScale(v) {
        this.dispatch(msAction({ ms_ellipsoids_scale: v }, [Events.MS_ELLIPSOIDS]));
    }

    get labelsMode() {
        return this.state.ms_labels_type;
    }

    set labelsMode(v) {
        this.dispatch(msAction({ 'ms_labels_type': v }, [Events.MS_LABELS]));
    }

    get colorScaleAvailable() {
        let pre = this.colorScalePrefix;
        return (pre === 'none' || pre === 'ms');
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
    let state = useSelector(makeCScaleSelector('ms', ['app_viewer', 'efg_cscale_type']), shallowEqual);
    let dispatcher = useDispatch();

    let intf = new MSInterface(state, dispatcher);

    return intf;
}

export default useMSInterface;
export { initialMSState, msSetReferences };