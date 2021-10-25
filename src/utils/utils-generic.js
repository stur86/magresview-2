import _ from 'lodash';

/*
 * Merges together all the outputs of multiple async processes into a single
 * argument to pass to a callback, according the outputs are in Object form.
 */
class CallbackMerger {
    
    constructor(n, callback) {
        this._callback = callback;
        this._n = n;

        this._arg = {};
    }

    call(arg) {
        
        if (this._n <= 0) {
            throw Error('CallbackMerger has completed its iterations');
        }

        _.merge(this._arg, arg);
        this._n -= 1;
        if (this._n === 0) {
            this._callback(this._arg);
        }
    }
}

export { CallbackMerger };