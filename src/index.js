'use strict'
import createDispatcher from './createDispatcher';
var version;
try{
    version = VERSION;
}catch(e){

}
export default {
    createDispatcher,
    version
}
