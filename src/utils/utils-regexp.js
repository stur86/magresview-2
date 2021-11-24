import { Map } from 'immutable';

// Immutable map makes these entries safe
const regularExpressions = Map({
    float: new RegExp('[0-9]*(?:[.][0-9]*)?'),
    int: new RegExp('[0-9]*'),
    alpha: new RegExp('[a-zA-Z]*'),
    alphanumeric: new RegExp('[0-9a-zA-Z]*')
});

export default regularExpressions;