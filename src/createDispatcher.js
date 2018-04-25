'use strict'
import Febrest from 'febrest';

var {
    subscribe,
    unsubscribe,
    watch,
    removeWatcher,
    applyMiddleWare
} = Febrest;

function createDispatcher(componentInst, onDispatch) {
    var idMap = {};
    var callbacks = [];
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
    function onWatch(change){
        callbacks.forEach((cb)=>{
            cb(change);
        });
    }
    function watchIt(callback){
        callbacks.push(callback);
    }
    function removeWatch(){
        callbacks = [];
        removeWatcher(onWatch);
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
    watch(onWatch);
    function release() {
        idMap = null;
        unsubscribe(listener);
        removeWatch();
    }
    return {
        dispatch,
        release,
        watch:watchIt
    }
}



export default createDispatcher;