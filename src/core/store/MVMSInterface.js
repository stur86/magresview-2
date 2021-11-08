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

    update() {
        // Called when selection has changed
        if (this.hasEllipsoids) {
            this._removeEllipsoids(false);
            this._addEllipsoids(this.parent.state.ms_ellipsoid_scale);            
        }
    }

    reset() {
        // Just erases everything
        if (this.hasEllipsoids) {
            this._removeEllipsoids();
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

    _addEllipsoids(scale, dispatch=true) {
        let sel = this.parent.select.selected;
        if (sel.length === 0) {
            sel = this.parent.select.displayed;
        }
        let ms = sel.map((a) => a.getArrayValue('ms'));

        sel.addEllipsoids(ms, 'ms', {scalingFactor: scale, color: 0xff8000, opacity: 0.25});
        if (dispatch)
            this.parent.dispatch({type: 'ms_ellipsoids', view: sel, scale: scale});
    }

    _removeEllipsoids(dispatch=true) {
        let view = this.parent.state.ms_ellipsoid_view;

        view.removeEllipsoids('ms');
        if (dispatch) {
            // dispatch can be set to false when we know we won't need this,
            // namely, when removeEllipsoids and addEllipsoids are called in 
            // sequence.
            this.parent.dispatch({type: 'ms_ellipsoids', view: null});
        }
    }

}

export default MVMSInterface;