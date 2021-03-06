import React, { createContext, PureComponent } from 'react';
import { State } from 'febrest';
function getStates(states) {
  const data = {};

  states.forEach(s => {
    data[s] = State(s).get();
  });
  return data;
}
function copy(source) {
  const dest = {};
  for (let o in source) {
    dest[o] = source[o];
  }
  return dest;
}

export function contextForState(states, config = {}) {
  if (typeof states === 'string') {
    states = [states];
  }
  const { initialize, duration } = config;
  const defaultStates = getStates(states);
  const context = createContext(defaultStates);
  const { Provider, Consumer } = context;
  const listeners = [];
  let instCount = 0;
  let inited = false;
  let timeoutHanlder;
  function autoUpdate() {
    initialize();
    timeoutHanlder = setTimeout(autoUpdate, duration);
  }
  function startCheckUpdate() {
    instCount++;
    if (instCount >= 1 && duration && initialize) {
      timeoutHanlder = setTimeout(autoUpdate, duration);
    }
  }
  function cancelCheckUpdate() {
    instCount--;
    if (instCount <= 0) {
      clearTimeout(timeoutHanlder);
    }
  }
  State.observe(function({ key, current }) {
    if (states.indexOf(key) !== -1) {
      defaultStates[key] = current;
      listeners.forEach(l => {
        l && l._update(defaultStates);
      });
    }
  });
  class StateConsumer extends PureComponent {
    // static typ = Consumer.type;
    constructor(props) {
      super(props);
      // const {value} = props;
      //暂时不支持直接通过Provider来修改State，会有问题。
      const provider = defaultStates;
      this.state = {
        provider
      };
      this._index = 0;
    }
    componentDidMount() {
      listeners.push(this);
      if (!inited && initialize) {
        initialize(defaultStates);
        inited = false;
      }
      startCheckUpdate();
      this._index = listeners.length - 1;
    }
    componentWillUnmount() {
      delete listeners[this._index];
      cancelCheckUpdate();
    }
    _update(provider) {
      this.setState({ provider: copy(provider) });
    }
    render() {
      const { children } = this.props;
      const { provider } = this.state;
      return (
        <Provider value={provider}>
          <Consumer>{children}</Consumer>
        </Provider>
      );
    }
  }
  context.Provider = null;
  context.Consumer = StateConsumer;
  context.forceUpdate = function() {
    initialize && initialize();
  };
  return context;
}
