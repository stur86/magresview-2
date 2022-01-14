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
 * Euler angles (in ZYZ convention) from a rotation matrix R
 * 
 * @param  {Array} R    Rotation matrix
 * 
 * @return {Array}      Euler angles
 */
function eulerZYZ(R) {

    /*
        In this case, the rotation matrix is:
                                    | cos(a)cos(b)cos(c)-sin(a)sin(c)       sin(a)cos(b)cos(c)+cos(a)sin(c)         -sin(b)cos(c)               |
                                    | -cos(a)cos(b)sin(c)-sin(a)cos(c)      -sin(a)cos(b)sin(c)+cos(a)cos(c)        sin(b)sin(c)                |
                                    | cos(a)sin(b)                          sin(a)sin(b)                            cos(b)                      |
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
        a = Math.atan2(R[2][1], R[2][0]);
        c = Math.atan2(R[1][2], -R[0][2]);
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

export { rotationBetween, eulerZYZ, rotationMatrixFromZYZ };