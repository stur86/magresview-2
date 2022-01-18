/**
 * Listeners for Euler angles
 */

import { msColor, efgColor } from './colors';
import { eulerBetweenTensors } from '../../../utils';

const ctable = {
    'ms': msColor,
    'efg': efgColor
};

function eulerAngleListener(state) {

    const a1A = state.eul_atom_A;
    const a1B = state.eul_atom_B;

    const a2A = state.eul_newatom_A;
    const a2B = state.eul_newatom_B;

    const tA = state.eul_tensor_A;
    const tB = state.eul_tensor_B;

    const conv = state.eul_convention;

    let nmrA = null;
    let nmrB = null;

    if (a1A) {
        a1A.removeLabel('eulA');
    }

    if (a2A) {
        let r = a2A.radius;
        a2A.addLabel('A', 'eulA', {
            shift: [0, 0.25*r, 0],
            color: ctable[tA],
            onOverlay: true,
            height: 0.04
        });

        // Now get the tensor value
        if (a2A.model.hasArray(tA)) {
            nmrA = a2A.getArrayValue(tA);
        }
    }

    if (a1B) {
        a1B.removeLabel('eulB');
    }

    if (a2B) {
        let r = a2B.radius;
        a2B.addLabel('B', 'eulB', {
            shift: [0, -0.5*r, 0],
            color: ctable[tB],
            onOverlay: true
        });

        // Now get the tensor value
        if (a2B.model.hasArray(tB)) {
            nmrB = a2B.getArrayValue(tB);
        }
    }

    let results = null;

    if (nmrA && nmrB) {
        // Get the eigenvectors
        results = eulerBetweenTensors(nmrA, nmrB, conv);
    }

    return {
        eul_atom_A: a2A,
        eul_atom_B: a2B,
        eul_results: results
    };
}

export { eulerAngleListener };