/**
 * A class to manage more conveniently click events sent to the CrystVis app.
 * It helps sorting out possible conflicts between different components trying
 * to each set their own handler.
 */
class ClickHandler {

    constructor(app, codes=[]) {

        this._callbacks = {};
        const handler = this;

        codes.forEach((code) => {

            handler._callbacks[code] = {};

            // Handler
            function handleClick(atom, event) {
                const cbacks = handler._callbacks[code];

                for (let n in cbacks) {
                    cbacks[n](atom, event);
                }
            }

            app.onAtomClick(handleClick, code);
        });
    }

    setCallback(name, code, cback=null) {

        if (!(code in this._callbacks)) {
            throw Error('Invalid callback code; unsupported event type');
        }

        if (!cback) {
            delete(this._callbacks[code][name]);
        }
        else {
            this._callbacks[code][name] = cback;            
        }

    }

}

export { ClickHandler };