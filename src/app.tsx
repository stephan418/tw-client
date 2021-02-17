import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    GlobalStateProvider,
    useGlobalState,
} from './global/globalStateContext';
import { SocketHandler, useSocketConnection } from './global/socketHandler';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Link,
    Redirect,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Logo } from './components/header';
import { ButtonLink, RouterButtonLink } from './components/button';
import { Home } from './pages/home';
import './app.scss';
import { Join } from './pages/join';
import { Lobby } from './pages/lobby';
import { Create } from './pages/create';
import { Race } from './pages/race';

const App: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <Header logo={<Logo />} />
            <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.pathname}>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/join/:id?">
                        <Join />
                    </Route>
                    <Route exact path="/create">
                        <Create />
                    </Route>
                    <Route exact path="/lobby/:id?">
                        <Lobby />
                    </Route>
                    <Route exact path="/race/:id?">
                        <Race />
                    </Route>
                    <Route>
                        <motion.div exit={{ opacity: 0 }}>
                            <Redirect to="/" />
                        </motion.div>
                    </Route>
                </Switch>
            </AnimatePresence>{' '}
        </>
    );
};

ReactDOM.render(
    <GlobalStateProvider>
        <SocketHandler>
            <Router>
                <App />
            </Router>
        </SocketHandler>
    </GlobalStateProvider>,
    document.querySelector('#root')
);
