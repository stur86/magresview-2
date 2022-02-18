import { chainClasses } from './utils-react';
import { CallbackMerger, getColorScale, mergeOnly, Enum, averagePosition } from './utils-generic';
import { dipolarCoupling } from './utils-nmr';
import { rotationBetween, eulerFromRotation, rotationMatrixFromZYZ } from './utils-rotation';

test('chains classes', () => {
    let cc = chainClasses('this', 'that');
    expect(cc).toEqual('this that');
});

test('makes a color scale', () => {
    let cs = getColorScale(0, 1, 'greys');

    let black = cs.getColor(0);
    let white = cs.getColor(1);
    let gray = cs.getColor(0.5);

    expect(black.r).toEqual(0);
    expect(black.g).toEqual(0);
    expect(black.b).toEqual(0);

    expect(white.r).toEqual(255);
    expect(white.g).toEqual(255);
    expect(white.b).toEqual(255);

    expect(gray.r).toEqual(127);
    expect(gray.g).toEqual(127);
    expect(gray.b).toEqual(127);
});

test('merges callbacks', () => {
    // Define a callback
    let dummy = {};
    function callback(x) {
        dummy = x;
    }
    let cbm = new CallbackMerger(2, callback);
    cbm.call({x: 0});
    expect(dummy.x).toEqual(undefined);
    cbm.call({y: 1});
    expect(dummy.x).toEqual(0);
    expect(dummy.y).toEqual(1);
});

test('merges objects with only existing members', () => {

    let a = {
        x: 1,
        y: 2
    };

    let b = {
        x: 3,
        z: 4
    };

    let c = mergeOnly(a, b);

    expect(c).toEqual({ x: 3, y: 2});

});

test('creates custom immutable Enums', () => {

    const myEnum = new Enum(['THIS', 'THAT']);

    expect(myEnum.THIS).toEqual(0);
    expect(myEnum.THAT).toEqual(1);

    // Check immutability
    expect(() => { myEnum.THIS = 2 }).toThrow();

    // Version with values
    const valuedEnum = new Enum({THIS: 'one', THAT: 'two'});

    expect(valuedEnum.THIS).toEqual('one');
    expect(valuedEnum.THAT).toEqual('two');
});

test('computes dipolar couplings', () => {

    // A mock class with the same interface for our purposes 
    // as a regular AtomImage
    class MockAtomImage {

        constructor(position, gamma) {
            this.position = position;
            this.gamma = gamma;
        }

        get xyz() {
            return this.position;
        }

        get isotopeData() {
            return {
                gamma: this.gamma
            };
        }
    }

    // Water molecule with 17O
    const O = new MockAtomImage([ 0.  ,  0.      ,  0.119262], -36280800.0);
    const H1 = new MockAtomImage([ 0. ,  0.763239, -0.477047], 267522128.0);
    const H2 = new MockAtomImage([ 0. , -0.763239, -0.477047], 267522128.0);

    const [D1, r1] = dipolarCoupling(O,  H1);
    const [D2, r2] = dipolarCoupling(H1, H2);

    expect(D1).toBeCloseTo(17928.605843719663);
    expect(D2).toBeCloseTo(-33771.011222588495);

    const r1targ = [0, 0.78801008, -0.61566233];
    const r2targ = [0, -1, 0];

    for (let i = 0; i < 3; ++i) {
        expect(r1[i]).toBeCloseTo(r1targ[i]);
        expect(r2[i]).toBeCloseTo(r2targ[i]);
    }
});

test('calculates rotation matrices and Euler angles', () => {

    const c30 = Math.sqrt(3)/2;
    const c45 = Math.sqrt(2)/2;
    const c60 = 0.5;

    // Gimbal lock example
    let axes1 = [
        [ c30, c60, 0],
        [-c60, c30, 0],
        [   0,   0, 1]
    ];

    let axes2 = [
        [ c45, c45, 0],
        [-c45, c45, 0],
        [   0,   0, 1]
    ];

    let R = rotationBetween(axes1, axes2);
    let [a, b, c] = eulerFromRotation(R);

    expect(a).toBeCloseTo(Math.PI*15/180);
    expect(b).toBeCloseTo(0);
    expect(c).toBeCloseTo(0);

    // General examples
    axes1 = [[ 0.93869474,  0.33129348, -0.09537721],
             [ 0.33771007, -0.93925902,  0.06119153],
             [-0.06931155, -0.08965002, -0.99355865]];

    axes2 = [[-0.52412461,  0.49126909, -0.69566377],
             [-0.56320663,  0.41277966,  0.71582906],
             [ 0.63882054,  0.76698607,  0.06033803]];

    R = rotationBetween(axes1, axes2);
    [a, b, c] = eulerFromRotation(R);

    expect(a).toBeCloseTo(-0.5336027024819012);
    expect(b).toBeCloseTo(1.7446582433680782);
    expect(c).toBeCloseTo(-2.337729151937854);

    // ZXZ test

    axes1 = [[-0.62582956, 0.50160365,-0.59726974],
             [-0.57465297, 0.22123184, 0.78792794],
             [ 0.52736261, 0.83633143, 0.1497946 ]];

    axes2 = [[-0.61565571, 0.62168499, 0.48422704],
             [ 0.64838422, 0.74886978,-0.13708373],
             [-0.44784589, 0.22956879,-0.86413669]];

    R = rotationBetween(axes1, axes2);
    [a, b, c] = eulerFromRotation(R, 'zxz');

    expect(a).toBeCloseTo(1.1826406253627681);
    expect(b).toBeCloseTo(1.7453053098731386);
    expect(c).toBeCloseTo(0.2753933761154593);

});

test('averages properly a list of positions', () => {

    const fakeMview = [
        {xyz: [1, 2, 4]},
        {xyz: [3, 1, 2]}
    ];

    const out = averagePosition(fakeMview);

    expect(out).toEqual([2, 1.5, 3]);
});