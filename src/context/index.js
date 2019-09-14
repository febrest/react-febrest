import React, { createContext, PureComponent } from "react";
import { State } from "febrest";
function getStates(states) {
  const data = {};

  states.forEach(s => {
    data[s] = State(s).get();
  });
  return data;
}

export function contextForState(states, { initialize, duration }) {
  if (typeof states === "string") {
    states = [states];
  }
  const defaultStates = getStates(states);
  const context = createContext(defaultStates);
  const { Provider } = context;
  const listeners = [];
  let instCount = 0;
  let inited = false;
  let timeoutHanlder;
  function autoUpdate() {
    initialize()
    timeoutHanlder = setTimeout(autoUpdate,duration)
  }
  function startCheckUpdate() {
    instCount++;
    if(instCount>=1 && duration && initialize) {
      timeoutHanlder = setTimeout(autoUpdate,duration)
    }
  }
  function cancelCheckUpdate() {
    instCount--;
    if(instCount<=0) {
      clearTimeout(timeoutHanlder)
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
  class StateProvider extends PureComponent {
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
      this.setState({ provider:{...provider} });
    }
    render() {
      const { children } = this.props;
      const { provider } = this.state;
      return <Provider value={provider}>{children}</Provider>;
    }
  }
  context.Provider = StateProvider;

  return context;
}
