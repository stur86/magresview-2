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

import { msEllipsoidListener, efgEllipsoidListener } from './ellipsoids';

const initialListenerState = {
    listen_update: []
};

const listeners = {
    'ms_ellipsoids': msEllipsoidListener,
    'efg_ellipsoids': efgEllipsoidListener
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

export { initialListenerState };
export default makeMasterListener;