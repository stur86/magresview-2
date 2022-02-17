// Events used to trigger listeners
import { Enum } from '../../../utils';

const Events = new Enum([
    'DISPLAY',
    'VIEWS',
    'SEL_LABELS',
    'CELL',
    'CSCALE',
    'MS_ELLIPSOIDS',
    'MS_LABELS',
    'EFG_ELLIPSOIDS',
    'EFG_LABELS',
    'EUL_ANGLES',
    'DIP_LINKS',                // Links require two events, one before a VIEWS update, the other after
    'DIP_RENDER',
    'JC_LINKS',
    'JC_RENDER'
]);

// Event priority ranking. Events with higher priority fire first, and are
// followed by all the ones of lower priority. Example: a change in Views
// (priority 1) inevitably triggers all events of priority 0.
const eventPriority = {
    0: new Set([Events.DISPLAY]),                               // Called last. If we need to change displayed model
    1: new Set([Events.SEL_LABELS, Events.CELL,                 // All events having to do with rendering something that
                Events.CSCALE,                                  // is affected by displayed/selected atoms
                Events.MS_ELLIPSOIDS, Events.MS_LABELS,         
                Events.EFG_ELLIPSOIDS, Events.EFG_LABELS,
                Events.EUL_ANGLES, 
                Events.DIP_RENDER, Events.JC_RENDER]),
    2: new Set([Events.VIEWS]),                                 // Changing displayed/selected atoms
    3: new Set([Events.DIP_LINKS, Events.JC_LINKS])             // Computing links and required ghosts (which changes displayed atoms)
};

function getPriorityOfEvent(event) {

    for (let p in eventPriority) {
        let eset = eventPriority[p];
        if (eset.has(event)) {
            return p;
        }
    }

    return 0; // Default value
}

function getEventsWithPriority(priority) {
    return eventPriority[priority];
}


export default Events;
export { getPriorityOfEvent, getEventsWithPriority };