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
    HashRouter,
    useHistory,
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
import { ServerChooser } from './pages/serverChooser';

const App: React.FC = () => {
    const location = useLocation();
    const [globalState, dispatch] = useGlobalState();
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let config = params.get('c');

        if (config) {
            try {
                console.log(config.replace(/-/g, '=').replace(/_/g, '+'));
                config = atob(config.replace(/-/g, '=').replace(/_/g, '+'));

                let serverHost = config.split(';')[0];
                dispatch({ type: 'setServerHost', payload: { serverHost } });
            } catch (e) {
                console.log(e);
                params.delete('c');
                history.push({ search: params.toString() });
                config = null;
            }
        } else if (!globalState.serverHost && location.pathname !== '/choose-server') {
            if (!globalState.continueTo) {
                dispatch({ type: 'setContinueTo', payload: { continueTo: location.pathname } });
            }

            history.push('/choose-server');
        } else if (globalState.serverHost) {
            params.append('c', 
                btoa(
                    `${globalState.serverHost};${Math.round(new Date().getTime())}`)
                        .replace(/\=/g, '-')
                        .replace(/\+/g, '_')
                        );

            history.replace({ pathname: location.pathname, search: params.toString() });
        }
    }, [location.pathname, location.search]);

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
                    <Route exact path="/choose-server">
                        <ServerChooser />
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
            <HashRouter>
                <App />
            </HashRouter>
        </SocketHandler>
    </GlobalStateProvider>,
    document.querySelector('#root')
);
