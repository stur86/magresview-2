/**
 * This file contains the master function for controlling the listener system.
 * Listeners are subscribed to the magresStore and fire whenever the state
 * changes. Since it could get too expensive to check which parts of the state
 * have changed at any time, listeners must be invoked EXPLICITLY by a method
 * making a dispatch by adding their names to the listen_update Array.
 *
 * A listener must have the following interface:
 *
 * function exampleListener(state) {
 *
 *      // ...do something...
 *
 *      return [new_data, new_listeners];
 * 
 * }
 *
 * where new_data is a dictionary that will be directly used to update the
 * state while new_listeners is a list of any new listeners that should be
 * queued for update next. The process will stop only once that listen_update = []
 * at the end of a run through the current queue, (so be wary of creating infinite loops!).
 */

import { viewsListener } from './views';
import { msEllipsoidListener, efgEllipsoidListener } from './ellipsoids';
import { selLabelListener, msLabelListener, efgLabelListener } from './labels';
import { colorScaleListener } from './cscales';
import Events from './events';

const initialListenerState = {
    listen_update: []
};

const listeners = {
    [Events.VIEWS]:             viewsListener,
    [Events.SEL_LABELS]:        selLabelListener,
    [Events.CSCALE]:            colorScaleListener,
    [Events.MS_ELLIPSOIDS]:     msEllipsoidListener,
    [Events.MS_LABELS]:         msLabelListener,
    [Events.EFG_ELLIPSOIDS]:    efgEllipsoidListener,
    [Events.EFG_LABELS]:        efgLabelListener
};

function makeMasterListener(store) {

    function listener() {

        let state = store.getState();
        let toUpdate = state.listen_update;

        if (toUpdate && toUpdate.length > 0) {

            let data = {};
            let nextToUpdate = [];

            toUpdate.forEach((lname) => {

                if (!(lname in listeners))
                    return;

                let [d, n] = listeners[lname](state);
                
                data = {
                    ...data,
                    ...d
                };

                nextToUpdate = nextToUpdate.concat(n);
            });

            data.listen_update = nextToUpdate;

            store.dispatch({
                type: 'update',
                data: data
            });
        }
    }

    return listener;
}

export { initialListenerState, Events };
export default makeMasterListener;