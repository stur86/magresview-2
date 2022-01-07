import { chainClasses } from './utils-react';
import { CallbackMerger, getColorScale } from './utils-generic';
import { dipolarCoupling } from './utils-nmr';

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