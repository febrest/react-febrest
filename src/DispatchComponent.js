'use strict'
import dispatchMiddleWare from './dispatchMiddleWare';
import Febrest from 'febrest';

var {
    dispatch,
    subscribe,
    unsubscribe
} = Febrest;
function dispatch() {

}
function createDispatchComponent(component) {
    class DispatchComponent extends component {
        constructor(...props) {
            super(...props);
        }
        componentDidMount() {
            super.componentDidMount();
            subscribe(this._onData);
        }
        componentWillUnmount() {
            super.componentWillUnmount();
            unsubscribe(this._onData);
        }
        _onData = (data) => {
            var result = this.onData && this.onData(data);
            if (!result && data.target == this) {
                this.setState(data.state);
            }
        }
    }
}



export default DispatchComponent;