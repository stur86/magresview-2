import _ from 'lodash';

function chainClasses() {
    /* Chain multiple class strings into a single string,
    for React components className property.
    */
    return _.join(_.flatten(arguments), ' ');
}

export { chainClasses };