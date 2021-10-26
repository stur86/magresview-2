import MVSubInterface from './MVSubInterface';

class MVSelectInterface extends MVSubInterface {

    _hlight = true

    get highlighted() {
        return this._hlight;
    }

    set highlighted(v) {
        this._hlight = v;
        this.parent.app.highlight_selected = v;
    }

}

export default MVSelectInterface;