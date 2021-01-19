import React, { useContext, useReducer } from 'react';
import { Action, GlobalState, reducer } from './globalState';

type GlobalStateSetter = React.Dispatch<Action>;

const GlobalStateContext = React.createContext<GlobalState>({ users: {} });
const GlobalStateSetContext = React.createContext<GlobalStateSetter>(() => undefined);

export const useGlobalState: () => [GlobalState, GlobalStateSetter] = () => [
    useContext(GlobalStateContext),
    useContext(GlobalStateSetContext),
];

export const GlobalStateProvider: React.FC = ({ children }) => {
    const [globalState, dispatch] = useReducer(reducer, { users: {}, phase: 0 });

    return (
        <GlobalStateContext.Provider value={globalState}>
            <GlobalStateSetContext.Provider value={dispatch}>{children}</GlobalStateSetContext.Provider>
        </GlobalStateContext.Provider>
    );
};
