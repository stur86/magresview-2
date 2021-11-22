import _ from 'lodash';

function makeSelector(prefix) {
    // Creates and returns a selector function for a given prefix
    function _selector(state) {
        let ans = {};

        for (let key in state) {
            if (!_.startsWith(key, prefix))
                continue;
            ans[key] = state[key];
        }

        return ans;
    }

    return _selector;
}

export { makeSelector };