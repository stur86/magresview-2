import { chainClasses } from './utils-react';
import { CallbackMerger, getColorScale } from './utils-generic';

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