import React from 'react';
import HomePage from './pages/home';
import TestPage from './pages/testconfigpage';
import Navigation from './components/navigation';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

const App: () => JSX.Element = () => {
    return (
        <div>
            <BrowserRouter>
                <Navigation />
                <Container>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/test" exact component={TestPage} />
                    </Switch>
                </Container>
            </BrowserRouter>
        </div>
    );
};

export default App;
