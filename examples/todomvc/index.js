import Febrest from 'febrest';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return (
            <div class="container">
                <h1 class="header">todos</h1>
                <section class="main">
                    <p class="new-todo-container">
                        <input class="new-todo" placeholder="需要做什么？" />
                    </p>
                    <ul class="list">
                    </ul>
                    <footer class="selector">
                        <p class="filters">
                            <span
                                fbclick="app.changeType('all')"
                                class="all selected">all
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

ReactDOM.render(<App />,document.getElementById('react-placeholder'));

