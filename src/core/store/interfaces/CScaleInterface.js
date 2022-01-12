import { Events } from '../listeners';
import { makeSelector, BaseInterface } from '../utils';

const initialCScaleState = {
    cscale_view: null,
    cscale_displ: null,
    cscale_type: 'none'
};

// A base class not meant to be used directly, but inherited by all interfaces
// that make use of color scales. 
// 
// Must be used in conjuction with makeCScaleSelector!
class CScaleInterface extends BaseInterface {

    get colorScaleType() {
        return this.state.cscale_type;
    }

    set colorScaleType(v) {
        this.dispatch({
            type: 'update',
            data: {
                cscale_type: v,
                listen_update: [Events.CSCALE]
            }
        });
    }

    get colorScalePrefix() {
        return this.colorScaleType.split('_', 2)[0];
    }

}

function makeCScaleSelector(prefix, extras=[]) {
    extras = extras.concat(Object.keys(initialCScaleState));

    return makeSelector(prefix, extras);
}

export default CScaleInterface;
export { initialCScaleState, makeCScaleSelector };