import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GlobalStateProvider, useGlobalState } from './global/globalStateContext';
import { SocketHandler, useSocketConnection } from './global/socketHandler';

const App: React.FC = () => {
    return <h1>Test</h1>;
};

ReactDOM.render(
    <GlobalStateProvider>
        <SocketHandler>
            <App />
        </SocketHandler>
    </GlobalStateProvider>,
    document.querySelector('#root')
);
