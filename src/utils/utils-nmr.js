/** 
 * Utilities that have to do with computing non-trivial NMR quantities
 */

/**
 * Dipolar coupling constant in Hz between two atoms. Takes into account both
 * distance and the properties of the isotopes.
 * 
 * @param  {AtomImage} a1 First atom
 * @param  {AtomImage} a2 Second atom
 * 
 * @return {[Number, Array]}    Dipolar coupling in Hz and unit vector connecting
 *                              the two atoms
 */
function dipolarCoupling(a1, a2) {

    const MU0_HBAR_E30 = 1.3252140307214143e-10;
    const g1 = a1.isotopeData.gamma || 0;
    const g2 = a2.isotopeData.gamma || 0;

    const r1 = a1.xyz;
    const r2 = a2.xyz;
    const r = r2.map((x, i) => x-r1[i]);
    const R = Math.sqrt(r.reduce((s, x) => s+x*x, 0));
    const rnorm = r.map((x) => x/R);

    return [-MU0_HBAR_E30*g1*g2/(8*Math.PI*Math.PI*Math.pow(R, 3)), rnorm];    
}

/**
 * J coupling constant in Hz between two atoms. Will return
 * a value only if the ISC tensor data is available
 * 
 * @param  {AtomImage} a1   First atom
 * @param  {AtomImage} a2   Second atom
 * 
 * @return {Number}         J-coupling constant in Hz
 */
function jCoupling(a1, a2) {

    let T;
    // Is it present at all?
    try {
        T = a1.getArrayValue('isc')[a2.index];
    }
    catch (e) {
        // Not found
        return null;
    }

    if (!T)
        return null;

    // Convert the tensor
    let g1 = a1.isotopeData.gamma;
    let g2 = a2.isotopeData.gamma;
    T = T.iscAtomicToHz(g1, g2);

    return T.isotropy;
}

export { dipolarCoupling, jCoupling };