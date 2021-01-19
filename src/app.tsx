import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GlobalStateProvider, useGlobalState } from './global/globalStateContext';
import { SocketHandler, useSocketConnection } from './global/socketHandler';

const App: React.FC = () => {
    const [globalState, dispatch] = useGlobalState();
    const socket = useSocketConnection();
    console.log(socket?.connectionInitialized);

    useEffect(() => {
        dispatch({ type: 'addUser', payload: { username: 'simon' } });

        socket?.initializeConnection();
    }, []);

    return <h1>{globalState.users['simon']?.typed}</h1>;
};

ReactDOM.render(
    <GlobalStateProvider>
        <SocketHandler>
            <App />
        </SocketHandler>
    </GlobalStateProvider>,
    document.querySelector('#root')
);
