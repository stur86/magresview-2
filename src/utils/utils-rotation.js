import * as mjs from 'mathjs';

/**
 * Return a rotation matrix from a set of axes to another. Axes are not checked
 * and must be already orthonormal, with columns corresponding to each axis
 * 
 * @param  {Array} axes1 Starting coordinate system
 * @param  {Array} axes2 Ending coordinate system

 * @return {Array}       Rotation matrix
 */
function rotationBetween(axes1, axes2) {
    return mjs.multiply(axes2, mjs.transpose(axes1));
}

/**
 * Euler angles (in ZYZ or ZXZ convention) from a rotation matrix R
 * 
 * @param  {Array}  R           Rotation matrix
 * @param  {String} convention  Convention to use ('zyz' or 'zxz', by default 'zyz')
 * 
 * @return {Array}      Euler angles
 */
function eulerFromRotation(R, convention='zyz') {

    /*
        
        For the ZYZ convention the rotation matrix is:

        ⎡-sin(α)⋅sin(γ) + cos(α)⋅cos(β)⋅cos(γ)  sin(α)⋅cos(β)⋅cos(γ) + sin(γ)⋅cos(α)   -sin(β)⋅cos(γ)⎤
        ⎢                                                                                            ⎥
        ⎢-sin(α)⋅cos(γ) - sin(γ)⋅cos(α)⋅cos(β)  -sin(α)⋅sin(γ)⋅cos(β) + cos(α)⋅cos(γ)  sin(β)⋅sin(γ) ⎥
        ⎢                                                                                            ⎥
        ⎣            sin(β)⋅cos(α)                          sin(α)⋅sin(β)                  cos(β)    ⎦

        
        While for the ZXZ convention it is:
        
        ⎡-sin(α)⋅sin(γ)⋅cos(β) + cos(α)⋅cos(γ)  sin(α)⋅cos(γ) + sin(γ)⋅cos(α)⋅cos(β)   sin(β)⋅sin(γ)⎤
        ⎢                                                                                           ⎥
        ⎢-sin(α)⋅cos(β)⋅cos(γ) - sin(γ)⋅cos(α)  -sin(α)⋅sin(γ) + cos(α)⋅cos(β)⋅cos(γ)  sin(β)⋅cos(γ)⎥
        ⎢                                                                                           ⎥
        ⎣            sin(α)⋅sin(β)                         -sin(β)⋅cos(α)                 cos(β)    ⎦


        The math is identical for the beta angle as well as the gimbal lock case. In the general case, 
        there's some changes in signs.

     */


    let cosb = R[2][2];
    // Fix for the occasional numerical error
    cosb = Math.min(Math.max(cosb, -1), 1);

    let a;
    let b = Math.acos(cosb);
    let c;

    if (Math.abs(cosb) === 1) {
        // Special case, gimbal lock
        c = 0;
        a = Math.atan2(R[0][1], R[0][0]);
    }
    else {
        // General case
        switch (convention) {
            case 'zyz':
                a = Math.atan2(R[2][1],  R[2][0]);
                c = Math.atan2(R[1][2], -R[0][2]);
                break;
            case 'zxz':
                a = Math.atan2(R[2][0], -R[2][1]);
                c = Math.atan2(R[0][2],  R[1][2]);
                break;
            default:
                throw Error('Unrecognised Euler angles convention');
        }
    }

    return [a, b, c];
}

/**
 * Rotation matrix from ZYZ Euler angles
 * 
 * @param  {Number} alpha 
 * @param  {Number} beta 
 * @param  {Number} gamma 
 * 
 * @return {Array}   Rotation matrix
 */
function rotationMatrixFromZYZ(alpha, beta, gamma) {

    const sa = Math.sin(alpha);
    const ca = Math.cos(alpha);
    const sb = Math.sin(beta);
    const cb = Math.cos(beta);
    const sg = Math.sin(gamma);
    const cg = Math.cos(gamma);

    return [
        [ca*cb*cg-sa*sg, sa*cb*cg+ca*sg, -sb*cg], 
        [-ca*cb*sg,      -sa*cb*sg+ca*cg, sb*sg],
        [ca*sb,          sa*sb,           cb]
    ];

}

/**
 * Euler angles between the Haeberlen eigenvectors of two NMR tensors
 * 
 * @param  {CrystVis.TensorData}    T1          First tensor
 * @param  {CrystVis.TensorData}    T2          Second tensor
 * @param  {String}                 convention  Euler angles convention
 * 
 * @return {Array}                              Euler angles
 */
function eulerBetweenTensors(T1, T2, convention='zyz') {
    const ax1 = T1.haeberlen_eigenvectors;
    const ax2 = T2.haeberlen_eigenvectors;
    return eulerFromRotation(rotationBetween(ax1, ax2), convention);
}

export { rotationBetween, eulerFromRotation, eulerBetweenTensors, 
         rotationMatrixFromZYZ };