class MVSubInterface {

    constructor(parent) {
        this._parent = parent; // The parent interface
    }

    get parent() {
        return this._parent;
    }
}

export default MVSubInterface;