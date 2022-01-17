// Events used to trigger listeners
import { Enum } from '../../../utils';

const Events = new Enum([
    'VIEWS',
    'SEL_LABELS',
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

export default Events;