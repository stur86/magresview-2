import _ from 'lodash';
import { useState } from 'react';

/**
 * Chain multiple class strings into a single string, useful when passing them
 * to React components' className property
 *
 * @param {String} name1, name2...    Name of the first class, second class, etc.
 * 
 * @return {String}                   Chained class names
 */
function chainClasses() {
    return _.join(_.flatten(arguments), ' ');
}

/**
 * Generate a memoized unique ID for an element
 * 
 * @param  {String} prefix Prefix of the id
 * 
 * @return {String}        Unique ID
 */
function useId(prefix='uid') {
    const [id] = useState(() => (_.uniqueId(prefix)));
    return id;
}

export { chainClasses, useId };