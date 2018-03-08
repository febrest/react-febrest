(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var febrest = createCommonjsModule(function (module, exports) {
    /** @license Apache 2.0 
    * version 0.0.3
    * Febrest.js
    *
    * This source code is licensed under the Apache 2.0 license found in the
    * LICENSE file in the root directory of this source tree.
    */
    (function (global, factory) {
        module.exports = factory();
    })(commonjsGlobal, function () {

        var _typeof$$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
            return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        } : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        };

        var classCallCheck$$1 = function classCallCheck$$1(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        };

        var createClass$$1 = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        var get$$1 = function get$$1(object, property, receiver) {
            if (object === null) object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);

            if (desc === undefined) {
                var parent = Object.getPrototypeOf(object);

                if (parent === null) {
                    return undefined;
                } else {
                    return get$$1(parent, property, receiver);
                }
            } else if ("value" in desc) {
                return desc.value;
            } else {
                var getter = desc.get;

                if (getter === undefined) {
                    return undefined;
                }

                return getter.call(receiver);
            }
        };

        var inherits$$1 = function inherits$$1(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
            }

            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        };

        var possibleConstructorReturn$$1 = function possibleConstructorReturn$$1(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }

            return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
        };

        var ActionVendor = function () {
            function ActionVendor() {
                classCallCheck$$1(this, ActionVendor);

                this._actionsForKey = {};
            }

            createClass$$1(ActionVendor, [{
                key: 'putActionByKey',
                value: function putActionByKey(key, action) {
                    this._actionsForKey[key] = action;
                }
            }, {
                key: 'getActionForKey',
                value: function getActionForKey(key) {
                    return this._actionsForKey[key];
                }
            }]);
            return ActionVendor;
        }();

        var vendor = new ActionVendor();

        function createAction(config, controller) {
            /**
             * todo:需要优化
             */
            config.controller = config.controller || controller;
            if (typeof config.controller !== 'function') {
                throw new Error('illegal controller,the type of controller must be function,but got ' + _typeof$$1(config.controller));
            }
            vendor.putActionByKey(config.key, config);
        }

        function createActions(config) {
            if (Array.isArray(config)) {
                config.forEach(createAction);
            } else {
                createAction(config);
            }
        }

        function getActionForKey(key) {
            return vendor.getActionForKey(key);
        }

        function isArray(v) {
            return Array.isArray(v);
        }
        function isObject(v) {
            return Object.prototype.toString.call(v) === '[object Object]';
        }
        function isPromise(v) {
            if (typeof Promise !== 'undefined' && v instanceof Promise) {
                return true;
            } else {
                return false;
            }
        }
        function copy(v) {
            if (isArray(v)) {
                return v.slice();
            } else if (isObject(v)) {
                var dest = {};
                for (var o in v) {
                    dest[o] = copy(v[o]);
                }
                return dest;
            } else {
                return v;
            }
        }

        function toValue(v) {
            try {
                return JSON.parse(v);
            } catch (e) {
                return v;
            }
        }

        function toString(v) {
            try {
                return JSON.stringify(v);
            } catch (e) {
                return v;
            }
        }

        function then(result) {
            if (isPromise(result)) {
                return result;
            } else {
                return Promise.resolve(result);
            }
        }

        /**
         * 获取参数列表
         */
        function getArgumentList(func) {
            var argsRegExp = /\(([\s\S]*?)\)/;
            var funcS = func.toString();
            var match = funcS.match(argsRegExp);
            if (match && match[1]) {
                /**
                 * todo:可能有bug
                 */
                var args = [];
                match[1].split(',').forEach(function (arg) {
                    args.push(arg.replace(/\s/g, ''));
                });
                return args;
            }
            return [];
        }
        var util = {
            isArray: isArray,
            isObject: isObject,
            copy: copy,
            isPromise: isPromise,
            toValue: toValue,
            toString: toString,
            then: then,
            getArgumentList: getArgumentList
        };

        var then$1 = util.then;

        /**
         * 
         * 
         * @param {any} controller 
         * @param {any} args
         */

        function runAction(controller, args) {
            var state = controller.apply(null, args);
            return then$1(state);
        }

        var copy$1 = util.copy;

        var Provider = function () {
            function Provider(config) {
                classCallCheck$$1(this, Provider);

                this._value = config.value;
                this._name = config.name;
            }

            createClass$$1(Provider, [{
                key: 'get',
                value: function get$$1() {
                    return copy$1(this._value);
                }
            }, {
                key: 'set',
                value: function set$$1(value) {
                    this._value = copy$1(value);
                }
            }]);
            return Provider;
        }();

        var container = {};
        function getProvider(name) {
            return container[name];
        }
        function setProvider(name, provider) {
            container[name] = provider;
        }

        var ProviderContainer = {
            setProvider: setProvider,
            getProvider: getProvider
        };

        var providerImpls = {
            'state': Provider
        };
        function getProviderImpl(type) {
            var providerImpl = providerImpls[type];
            if (providerImpl) {
                return providerImpl;
            } else {}
        }

        function createProvider(config) {
            var ProviderImpls = getProviderImpl(config.type || 'state');
            return new ProviderImpls(config);
        }
        function use(type, providerImpl) {
            providerImpls[type] = providerImpl;
        }

        var ProviderCreator = {
            createProvider: createProvider,
            use: use
        };

        var getArgumentList$1 = util.getArgumentList;
        var then$2 = util.then;
        var createProvider$1 = ProviderCreator.createProvider;
        var getProvider$1 = ProviderContainer.getProvider;

        function dependencyLookup(list, payload) {
            var isPayloadUsed = false;
            var args = [];
            /**
             * 需要优化
            */
            if (list) {
                args = list.map(function (key) {
                    var provider = ProviderContainer.getProvider(key);
                    if (provider) {
                        return then$2(provider.get());
                    } else if (payload !== undefined && !isPayloadUsed) {

                        /**
                         * payload 确保只传给第一个没匹配到的
                         */
                        isPayloadUsed = true;
                        return then$2(payload);
                    } else {
                        return then$2(null);
                    }
                });
            }
            return Promise.all(args);
        }

        function dependencyFromProvider(list) {
            var args = [];
            if (list) {
                args = list.map(function (item) {
                    try {
                        return then$2(item.get());
                    } catch (e) {
                        return then$2(item);
                    }
                });
            }
            return Promise.all(args);
        }

        function provide(action, payload) {
            var provider = action.provider;
            var controller = action.controller;
            if (typeof provider === 'function') {
                return dependencyFromProvider(provider(payload, createProvider$1, getProvider$1));
            } else {
                return dependencyLookup(getArgumentList$1(controller), payload);
            }
        }

        var watchers = {};
        function setWatcher(providers, watcher) {
            providers.forEach(function (provide) {
                if (!watchers[provide]) {
                    watchers[provide] = [];
                }
                watchers[provide].push(watcher);
            });
        }
        function Watcher(callback) {
            var watcher = {
                callback: callback,
                dispatchTime: 0
            };
            return watcher;
        }
        function dispatchWatcher(watcher, data, timestamp) {
            //确保在一次change中只被dispatch一次；
            if (watcher.dispatchTime >= timestamp) {
                return;
            } else {
                watcher.dispatchTime = timestamp;
                watcher.callback.call(null, data);
            }
        }

        function watch(providers, callback) {
            var watcher = Watcher(callback);
            if (typeof providers === 'string') {
                providers = [providers];
            }
            setWatcher(providers, watcher);
        }

        function doWatch(changed) {
            var timestamp = Date.now();
            for (var p in changed) {
                var providerWatcher = watchers[p];
                if (providerWatcher) {
                    providerWatcher.forEach(function (watcher) {
                        dispatchWatcher(watcher, changed, timestamp);
                    });
                }
            }
        }

        var watcher$1 = {
            watch: watch,
            doWatch: doWatch
        };

        function persist(kv, state) {
            if (!kv) {
                return null;
            }
            var changed = {};
            for (var k in kv) {
                var v = state[k];

                if (v) {
                    var name = kv[k];
                    var provider = ProviderContainer.getProvider(name);
                    if (provider) {
                        provider.set(v);
                        changed[name] = v;
                    }
                }
            }
            watcher$1.doWatch(changed);
            return changed;
        }

        var RemoteProvider = function (_Provider) {
            inherits$$1(RemoteProvider, _Provider);

            function RemoteProvider(config) {
                classCallCheck$$1(this, RemoteProvider);

                var _this = possibleConstructorReturn$$1(this, (RemoteProvider.__proto__ || Object.getPrototypeOf(RemoteProvider)).call(this, config));

                _this._remote = config.remote;
                _this.method = config.method || 'get';
                _this.body = config.body;
                _this.headers = config.headers;
                return _this;
            }

            createClass$$1(RemoteProvider, [{
                key: 'get',
                value: function get$$1() {
                    var headers = undefined;
                    if (this.headers) {
                        headers = new Headers(this.headers);
                    }
                    return fetch(this._remote, {
                        body: this.body,
                        method: this.method,
                        headers: headers
                    }).then(function (response) {
                        return response.text().then(function (text) {
                            return util.toValue(text);
                        });
                    }, function () {
                        return Promise.resolve(null);
                    });
                }
            }, {
                key: 'set',
                value: function set$$1() {}
            }]);
            return RemoteProvider;
        }(Provider);

        var SessionProvider = function (_Provider) {
            inherits$$1(SessionProvider, _Provider);

            function SessionProvider() {
                classCallCheck$$1(this, SessionProvider);
                return possibleConstructorReturn$$1(this, (SessionProvider.__proto__ || Object.getPrototypeOf(SessionProvider)).apply(this, arguments));
            }

            createClass$$1(SessionProvider, [{
                key: 'get',

                /**
                 * 取完之后删除数据
                 */
                value: function get$$1() {
                    var value = get$$1(SessionProvider.prototype.__proto__ || Object.getPrototypeOf(SessionProvider.prototype), 'get', this).call(this);
                    this._value = null;
                    return value;
                }
            }]);
            return SessionProvider;
        }(Provider);

        var toString$1 = util.toString;
        var toValue$2 = util.toValue;

        var is_localstorage_support = typeof localStorage !== 'undefined';

        function stroage(key, value) {
            if (is_localstorage_support) {
                stroage = function stroage(key, value) {
                    if (value) {
                        localStorage.setItem(key, toString$1(value));
                        return Promise.resolve();
                    } else {
                        return Promise.resolve(toValue$2(localStorage.getItem(key)));
                    }
                };
                return stroage(key, value);
            } else {
                return Promise.resolve();
            }
        }

        var storageTool = {
            getter: function getter(key) {
                return stroage(key);
            },
            setter: function setter(key, value) {
                return stroage(key, value);
            }
        };

        var StorageProvider = function (_Provider) {
            inherits$$1(StorageProvider, _Provider);

            function StorageProvider(config) {
                classCallCheck$$1(this, StorageProvider);
                return possibleConstructorReturn$$1(this, (StorageProvider.__proto__ || Object.getPrototypeOf(StorageProvider)).call(this, config));
            }

            createClass$$1(StorageProvider, [{
                key: 'get',
                value: function get$$1() {
                    var _this2 = this;

                    if (!this._synced) {
                        return storageTool.getter(this._name).then(function (v) {
                            if (v) {
                                _this2._value = v.value;
                            }
                            _this2._synced = true;
                            return get$$1(StorageProvider.prototype.__proto__ || Object.getPrototypeOf(StorageProvider.prototype), 'get', _this2).call(_this2);
                        });
                    } else {
                        return get$$1(StorageProvider.prototype.__proto__ || Object.getPrototypeOf(StorageProvider.prototype), 'get', this).call(this);
                    }
                }
            }, {
                key: 'set',
                value: function set$$1(v) {
                    get$$1(StorageProvider.prototype.__proto__ || Object.getPrototypeOf(StorageProvider.prototype), 'set', this).call(this, v);
                    storageTool.setter(this._name, { timestamp: Date.now(), value: v });
                }
            }]);
            return StorageProvider;
        }(Provider);

        function setStorgaeTool(tool) {
            storageTool = tool;
        }

        StorageProvider.setStorageTool = setStorgaeTool;

        var isArray$3 = util.isArray;

        function inject(configs) {
            if (isArray$3(configs)) {
                configs.forEach(function (config) {
                    return inject(config);
                });
            } else {
                var name = configs.name;
                var value = configs.defaultValue;
                configs.value = value;
                var provider = ProviderCreator.createProvider(configs);
                ProviderContainer.setProvider(name, provider);
            }
        }

        var use$1 = ProviderCreator.use;

        use$1('storage', StorageProvider);
        use$1('remote', RemoteProvider);
        use$1('session', SessionProvider);

        var Provider$2 = {
            Provider: Provider,
            StorageProvider: StorageProvider,
            RemoteProvider: RemoteProvider,
            SessionProvider: SessionProvider,
            provide: provide,
            inject: inject,
            use: use$1,
            persist: persist,
            watch: watcher$1.watch
        };

        var constants = {
            PROVIDER_PERSIST_ACTION: 'FEBREST/PROVIDER_PERSIST_ACTION'
        };

        var PROVIDER_PERSIST_ACTION = constants.PROVIDER_PERSIST_ACTION;
        function persist$2(payload) {
            return Provider$2.persist(payload.persist, payload.state);
        }
        var innerActions = {
            actions: [{
                key: PROVIDER_PERSIST_ACTION,
                controller: persist$2
            }]
        };

        var userErrorHandler = function userErrorHandler() {
            return false;
        };

        function defaultErrorHandler(error) {
            throw error;
        }

        function handle(error) {
            if (!userErrorHandler(error)) {
                defaultErrorHandler(error);
            }
        }
        function onError(errorHandler) {
            userErrorHandler = onError;
        }
        var error = {
            onError: onError,
            handle: handle
        };

        var Observer = function () {
            function Observer() {
                classCallCheck$$1(this, Observer);

                this._callbacks = [];
            }

            createClass$$1(Observer, [{
                key: 'next',
                value: function next(data) {
                    this._callbacks.forEach(function (callback) {
                        callback(data);
                    });
                }
            }, {
                key: 'subscribe',
                value: function subscribe(callback) {
                    this._callbacks.push(callback);
                }
            }, {
                key: 'unsubscribe',
                value: function unsubscribe(callback) {
                    var callbacks = this._callbacks;
                    for (var i = callbacks.length - 1; i >= 0; i--) {
                        if (callbacks[i] === callback) {
                            callbacks.splice(i, 1);
                            return;
                        }
                    }
                }
            }]);
            return Observer;
        }();

        var observer = new Observer();

        function subscribe(callback) {
            return observer.subscribe(callback);
        }
        function unsubscribe(callback) {
            return observer.unsubscribe(callback);
        }
        function next(data) {
            return observer.next(data);
        }
        var observer$1 = {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            next: next
        };

        var errorHandle = error.handle;

        var run = function run(action, payload, id) {
            return Provider$2.provide(action, payload).then(function (args) {
                return runAction(action.controller, args);
            }).then(function (state) {
                return setResult(state, action.key, id);
            });
        };

        var id = 0;

        function IDGenerator() {
            return ++id;
        }

        function providerPersist(persist, state) {
            if (persist) {
                exec(constants.PROVIDER_PERSIST_ACTION, { persist: persist, state: state });
            }
            return state;
        }

        function setResult(state, key, id) {
            var result = {
                state: state,
                key: key,
                id: id
            };
            return result;
        }

        function pushToObserver(result) {
            observer$1.next(result);
            return result;
        }
        function exec(key, payload) {
            var action = getActionForKey(key);
            var id = IDGenerator();

            //捕获所有异常
            run(action, payload, id).then(function (result) {
                return pushToObserver(result);
            }).then(function (result) {
                return providerPersist(action.persist, result.state);
            }).catch(function (e) {
                return errorHandle(e);
            });

            return id;
        }

        function applyMiddleWare(middleWare) {
            run = middleWare(run);
        }

        var exports$1 = {
            createActions: createActions,
            getAction: getActionForKey,
            exec: exec,
            applyMiddleWare: applyMiddleWare
        };
        createActions(innerActions.actions);

        function dispatch(key, payload) {
            return exports$1.exec(key, payload);
        }
        var Dispatcher = {
            dispatch: dispatch
        };

        var dispatch$1 = Dispatcher.dispatch;
        var applyMiddleWare$1 = exports$1.applyMiddleWare;
        var createActions$2 = exports$1.createActions;
        var PROVIDER_PERSIST_ACTION$1 = constants.PROVIDER_PERSIST_ACTION;
        var Provider$3 = Provider$2.Provider;
        var StorageProvider$2 = Provider$2.StorageProvider;
        var RemoteProvider$2 = Provider$2.RemoteProvider;
        var SessionProvider$2 = Provider$2.SessionProvider;
        var inject$2 = Provider$2.inject;
        var use$2 = Provider$2.use;
        var watch$1 = Provider$2.watch;
        var subscribe$1 = observer$1.subscribe;
        var unsubscribe$1 = observer$1.unsubscribe;

        var index = {
            /**
             * @description
             * exports dispatch
             */
            dispatch: dispatch$1,

            /**
             * @description
             * exports action
             */
            createActions: createActions$2,
            applyMiddleWare: applyMiddleWare$1,

            /**
             * @description
             * exports provider
            */
            Provider: Provider$3,
            StorageProvider: StorageProvider$2,
            RemoteProvider: RemoteProvider$2,
            SessionProvider: SessionProvider$2,
            injectProvider: inject$2,
            useProvider: use$2,

            /**
             * @description
             * exports observer
            */
            subscribe: subscribe$1,
            unsubscribe: unsubscribe$1,
            watch: watch$1,
            onError: error.onError,

            /**
             * @constants
            */
            PROVIDER_PERSIST_ACTION: PROVIDER_PERSIST_ACTION$1
        };

        return index;
    });
});

var febrest$1 = febrest;

console.log(febrest$1);

}());
