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
class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Header />
                <section className="main">
                    <p className="new-todo-container">
                        <input className="new-todo" placeholder="需要做什么？" />
                    </p>
                    <ul className="list">
                    </ul>
                    <footer className="selector">
                        <p className="filters">
                            <span
                                fbclick="app.changeType('all')"
                                className="all selected">all
                    </span>
                            <span
                                fbclick="app.changeType('active')">
                                active
                    </span>
                            <span
                                fbclick="app.changeType('complete')">
                                complete
                    </span>
                        </p>
                    </footer>
                </section>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-placeholder'));

