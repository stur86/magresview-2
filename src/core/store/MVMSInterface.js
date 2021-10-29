import MVSubInterface from './MVSubInterface';

class MVMSInterface extends MVSubInterface {

    get hasData() {
        let m = this.parent.current_model;
        return (m && (m.hasArray('ms')));
    }

    get hasEllipsoids() {
        return !(this.parent.state.ms_ellipsoid_view == null);
    }

    update() {
        // Called when selection has changed
        if (this.hasEllipsoids) {
            this.removeEllipsoids(false);
            this.addEllipsoids(this.parent.state.ms_ellipsoid_scale);            
        }
    }

    addEllipsoids(scale) {
        let sel = this.parent.select.selected;
        if (sel.length === 0) {
            sel = this.parent.select.displayed;
        }
        let ms = sel.map((a) => a.getArrayValue('ms'));

        sel.addEllipsoids(ms, 'ms', {scalingFactor: scale, color: 0xff8000});
        this.parent.dispatch({type: 'ms_ellipsoids', view: sel, scale: scale});
    }

    removeEllipsoids(dispatch=true) {
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