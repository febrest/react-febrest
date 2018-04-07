'use strict'
import Febrest from 'febrest';

var {
    subscribe,
    unsubscribe,
    watch,
} = Febrest;

function createDispatcher(componentInst, onDispatch) {
    var idMap = {};
    function _onDispatch(data, isThis) {
        if (onDispatch) {
            return onDispatch.call(componentInst, data, isThis);
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
        var result = _onDispatch(data, isThis);
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
        release,
        watch:Febrest.watch
    }
}



export default createDispatcher;