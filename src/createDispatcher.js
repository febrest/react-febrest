'use strict'
import Febrest from 'febrest';

var {
    subscribe,
    unsubscribe
} = Febrest;

function createDispatcher(componentInst, onData) {
    var idMap = {};
    function _onData(data) {
        if (onData) {
            return onData.call(componentInst, data);
        } else {
            return false;
        }
    }
    function dispatch(key,payload) {
        var id = Febrest.dispatch(key,payload);
        idMap[id] = true;
    }
    function listener(data) {
        var result = _onData(data);
        if(!result && idMap[data.id]){
            componentInst.setState(data.state);
        }
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