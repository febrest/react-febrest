import TargetSet from './TargetSet' ;

function dispatchMiddleWare(exec){
    return function(action,payload){
        var target = payload.target||null;
        return exec(action,payload.payload||payload)
            .then(function(result){
                result.target = target;
                return result;
            });
    }
}


export default {
    dispatchMiddleWare
}