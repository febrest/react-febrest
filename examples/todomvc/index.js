import Febrest from 'febrest';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactFebrest from './../../src';

/**
 * @constants
 */

var constants = {
    GET_ALL_TODOS: 'GET_ALL_TODOS',
    GET_COMPLETE: 'GET_COMPLETE',
    GET_ACTIVE: 'GET_ACTIVE',
    SET_COMPLETE: 'SET_COMPLETE',
    ADD_TODO: 'ADD_TODO',
    REMOVE_TODO: 'REMOVE_TODO'
}

/**
 * provider configs
 */

var providers = [
    {
        name: 'todos',
        type: 'storage',
        defaultValue: []
    },
]
/**
 * controllers
 */

var controllers = {
    addTodos: function (todos, message) {
        var todo = {
            complete: false,
            message: message
        }
        todos.push(todo);
        return {
            todos: todos
        }
    },
    removeTodos: function (todos, index) {
        todos.splice(index, 1);
        return { todos };
    },
    getAll: function (todos) {
        var complete = controllers.getComplete(todos).complete;
        var active = controllers.getActive(todos).active;
        return { todos: todos, complete, active };
    },
    getComplete: function (todos) {
        var complete = todos.filter(function (v) {
            return v.complete;
        });
        return { todos: complete };
    },
    complete: function (i, todos) {
        todos[i].complete = true;
        return {
            todos: todos,
        }
    },
    getActive: function (todos) {
        var active = todos.filter(function (v) {
            return !v.complete;
        });
        return { todos: active };
    },
}

/**
 * actions configs
 */

var actions = [
    {
        key: constants.ADD_TODO,
        controller: controllers.addTodos,
        persist: {
            'todos': 'todos'
        }
    },
    {
        key: constants.GET_ALL_TODOS,
        controller: controllers.getAll
    },
    {
        key: constants.GET_COMPLETE,
        controller: controllers.getComplete
    },
    {
        key: constants.GET_ACTIVE,
        controller: controllers.getActive
    },
    {
        key: constants.SET_COMPLETE,
        controller: controllers.complete,
        persist: {
            'todos': 'todos'
        }
    },
    {
        key: constants.REMOVE_TODO,
        controller: controllers.removeTodos,
        persist: {
            'todos': 'todos'
        }
    }
]


/**
 * config
 */

Febrest.createActions(actions);
Febrest.injectProvider(providers);

/**
 * views
 */
function Header() {
    return (
        <h1 className="header">
            todos
        </h1>
    );
}
function Input(props) {
    return (
        <p className="new-todo-container">
            <input
                className="new-todo"
                onKeyPress={props.onKeyPress}
                placeholder="需要做什么？" />
        </p>
    );
}

function CheckBox(props) {
    return (
        <span
            className={props.checked ? 'checkbox checked' : 'checkbox'}
            onClick={()=>Febrest.dispatch(constants.SET_COMPLETE,props.index)}>
        </span>
    );
}
function Item(props) {
    return (
        <li>
            {
                <CheckBox
                    checked={props.complete}
                    index={props.index} />
            }
            {props.message}
            <p className="right">
                {status}
                <span
                    className="delete"
                    onClick={()=>Febrest.dispatch(constants.REMOVE_TODO,'+index+')}>
                    x
                </span>
            </p>
        </li>
    );
}
class List extends React.Component {
    _renderItem(dataSource) {
        return dataSource.map(
            (todo, index) => {
                return <Item key={index} {...todo} index={index} />
            }
        );
    }
    render() {
        return (
            <ul className="list">
                {this._renderItem(this.props.dataSource)}
            </ul>
        );
    }
}

function Footer(props) {
    var onItemClick = props.onItemClick || function () { };
    var selected = props.selected;
    return (
        <footer className="selector">
            <p className="filters">
                <span
                    onClick={() => onItemClick(0)}
                    className={selected === 0 ? "selected" : ''}>all
                    </span>
                <span
                    className={selected === 1 ? "selected" : ''}
                    onClick={() => onItemClick(1)}>
                    active
                    </span>
                <span
                    className={selected === 2 ? "selected" : ''}
                    onClick={() => onItemClick(2)}>
                    complete
                    </span>
            </p>
        </footer>
    );
}
class App extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            selected: 0
        }
    }
    componentDidMount() {
        this.dispatcher = ReactFebrest.createDispatcher(this);
        Febrest.watch('todos',(data)=>this._onData(data));
        this._fetchBySelected(this.state.selected);
    }

    componentWillUnmount() {
        this.dispatcher.release();
    }
    _onItemClick(selected) {
        this.setState({ selected });
        this._fetchBySelected(selected);
    }
    _onData(change){
        if(change.todos){
            this._fetchBySelected(this.state.selected);
        }
    }
    _enter(e) {
        if (e.target.value == '') {
            return;
        }
        if (e.target.className === 'new-todo' && e.key === 'Enter') {
            this.dispatcher.dispatch(constants.ADD_TODO, e.target.value);
            e.target.value = '';
        }
    }
    _fetchBySelected(index) {
        switch (index) {
            case 0:
                this.dispatcher.dispatch(constants.GET_ALL_TODOS);
                break;
            case 1:
                this.dispatcher.dispatch(constants.GET_ACTIVE);
                break;
            case 2:
                this.dispatcher.dispatch(constants.GET_COMPLETE);
                break;
        }
    }
    render() {
        var dataSource = this.state.todos || [];
        return (
            <div className="container">
                <Header />
                <section className="main">
                    <Input
                        onKeyPress={(event) => this._enter(event)} />
                    <List
                        dataSource={dataSource} />
                    <Footer
                        selected={this.state.selected}
                        onItemClick={(index) => this._onItemClick(index)} />
                </section>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-placeholder'));

