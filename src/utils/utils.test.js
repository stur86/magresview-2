import { chainClasses } from './utils-react';

test('chains classes', () => {
    var cc = chainClasses('this', 'that');
    expect(cc).toEqual('this that');
});