import Febrest from 'febrest';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactFebrest from './../../src';


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

class List extends React.Component {
    render() {
        return (
            <ul className="list">
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
                    className={selected===0?"all selected":''}>all
                    </span>
                <span
                    className={selected===1?"all selected":''}
                    onClick={() => onItemClick(1)}>
                    active
                    </span>
                <span
                    className={selected===2?"all selected":''}
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
            selected:0
        }
    }
    componentDidMount() {
        
    }
    
    componentWillUnmount() {
        
    }
    _onItemClick(selected){
        this.setState({selected})
    }
    _enter(e){
        if (e.target.value == '') {
            return;
        }
        if (e.target.className === 'new-todo' && e.key === 'Enter') {
            e.target.value = '';
        }
    }
    render() {
        return (
            <div className="container">
                <Header />
                <section className="main">
                    <Input 
                        onKeyPress = {(event)=>this._enter(event)}/>
                    <List />
                    <Footer
                        selected={this.state.selected}
                        onItemClick={(index)=>this._onItemClick(index)} />
                </section>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-placeholder'));

