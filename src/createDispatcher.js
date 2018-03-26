'use strict'
import Febrest from 'febrest';

var {
    subscribe,
    unsubscribe
} = Febrest;

function createDispatcher(componentInst, onData) {
    var idMap = {};
    function _onData(data, isThis) {
        if (onData) {
            return onData.call(componentInst, data, isThis);
        } else {
            return false;
        }
    }
    function dispatch(key, payload) {
        var id = Febrest.dispatch(key, payload);
        idMap[id] = true;
        return id;
    }
    function listener(data) {
        var id = data.id;
        var isThis = !!idMap[id];
        var result = _onData(data, isThis);
        if (!result && isThis) {
            componentInst.setState(data.state);
        }
        delete idMap[id];
    }
    subscribe(listener);
    function release() {
        idMap = null;
        unsubscribe(listener);
    }
    return {
        dispatch,
        release
    }
}



export default createDispatcher;