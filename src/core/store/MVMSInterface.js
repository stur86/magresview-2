import _ from 'lodash';
import MVSubInterface from './MVSubInterface';

class MVMSInterface extends MVSubInterface {

    get hasData() {
        let m = this.parent.current_model;
        return (m && (m.hasArray('ms')));
    }

    get hasEllipsoids() {
        return !(this.parent.state.ms_ellipsoid_view == null);
    }

    get ellipsoidScale() {
        return this.parent.state.ms_ellipsoid_scale;
    }

    get hasLabels() {
        return !(this.parent.state.ms_labels_view == null);
    }

    get labelsContent() {
        return this.parent.state.ms_labels_content;
    }

    update() {
        // Called when selection has changed
        if (this.hasEllipsoids) {
            this._removeEllipsoids(false);
            this._addEllipsoids(this.parent.state.ms_ellipsoid_scale);            
        }
        if (this.hasLabels) {
            this._removeLabels(false);
            this._addLabels(this.parent.state.ms_labels_content);
        }
    }

    reset() {
        // Just erases everything
        if (this.hasEllipsoids) {
            this._removeEllipsoids();
        }
        if (this.hasLabels) {
            this._removeLabels();
        }
    }

    setEllipsoids(visible=false, scale=null) {
        if (scale === null) 
            scale = this.ellipsoidScale;
        if (visible)
            this._addEllipsoids(scale);
        else
            this._removeEllipsoids();
    }

    setLabels(visible=false, content='iso') {
        if (visible)
            this._addLabels(content);
        else
            this._removeLabels();

    }

    _getTargetSelection() {
        let sel = this.parent.select.selected;        
        if (sel.length === 0) {
            sel = this.parent.select.displayed;
        }
        return sel;
    }

    _addEllipsoids(scale, dispatch=true) {

        let sel = this._getTargetSelection();
        let ev = this.parent.state.ms_ellipsoid_view;

        let ms = sel.map((a) => a.getArrayValue('ms'));

        if (scale === 0) {
            // Auto scale
            
            // Compute an average isotropic MS, then set it to 2.0 Ang size
            let ms_avg = _.sum(ms.map((t) => t.isotropy))/ms.length;
            scale = 2.0/ms_avg;
        }

        // Do we need to add or can we just edit?
        if (ev === sel) {
            sel.ellipsoidProperties('ms', 'scalingFactor', scale);
        }
        else {
            sel.addEllipsoids(ms, 'ms', {scalingFactor: scale, color: 0xff8000, opacity: 0.25});
        }
        if (dispatch)
            this.parent.dispatch({type: 'update', data: {
                ms_ellipsoid_view: sel,
                ms_ellipsoid_scale: scale
            }});
    }

    _removeEllipsoids(dispatch=true) {
        let view = this.parent.state.ms_ellipsoid_view;

        if (view !== null) {
            view.removeEllipsoids('ms');

            if (dispatch) {
                // dispatch can be set to false when we know we won't need this,
                // namely, when removeEllipsoids and addEllipsoids are called in 
                // sequence.
                this.parent.dispatch({type: 'update', data: {
                    ms_ellipsoid_view: null
                }});
            }
        }
    }

    _addLabels(content, dispatch=true) {

        let sel = this._getTargetSelection();

        let ms = sel.map((a) => a.getArrayValue('ms'));
        let values = null;
        let units = '';

        // Grab the right data based on content
        switch(content) {
            case 'iso': 
                values = ms.map((T) => T.isotropy);
                units = ' ppm';
                break;
            case 'aniso':
                values = ms.map((T) => T.anisotropy);
                units = ' ppm';
                break;            
            case 'asymm':
                values = ms.map((T) => T.asymmetry);
                break;
            default:
                // Actually nothing to display
                this._removeLabels();
                return;
        }

        values = values.map((v) => v.toFixed(2) + units);

        sel.addLabels(values, 'ms', { color: 0xff8000 });

        if (dispatch)
            this.parent.dispatch({type: 'update', data: {
                ms_labels_view: sel,
                ms_labels_content: content
            }});
    }

    _removeLabels(dispatch=true) {
        let view = this.parent.state.ms_labels_view;

        if (view !== null) {
            view.removeLabels('ms');

            if (dispatch) {
                // dispatch can be set to false when we know we won't need this,
                // namely, when removeEllipsoids and addEllipsoids are called in 
                // sequence.
                this.parent.dispatch({type: 'update', data: {
                    ms_labels_view: null,
                    ms_labels_content: 'none'
                }});
            }
        }
    }

}

export default MVMSInterface;