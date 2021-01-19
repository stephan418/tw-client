import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGlobalState } from './globalStateContext';

interface SocketContextType {
    initializeConnection: Function;
    activateRef: Function;
    connectionInitialized: boolean;
    connectionAlive: boolean;
}

const SocketContext = React.createContext<SocketContextType | undefined>(undefined);

export function useSocketConnection(): SocketContextType | undefined {
    return useContext(SocketContext);
}

export const SocketHandler: React.FC = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [connectionAlive, setConnectionAlive] = useState(false);
    const [globalState, dispatch] = useGlobalState();

    function initializeConnection(force = false) {
        if (!socket || force) {
            setSocket(io('localhost:3042'));
            setConnectionAlive(true);
        }
    }

    function updateProgress(typed: number) {
        socket?.emit('update-progress', { typed });
    }

    function activateRef(ref: string) {
        socket?.emit('activate', { ref });
    }

    function startGame() {
        if (globalState.leader) {
            socket?.emit('start');
            return true;
        }

        return false;
    }

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => console.info('Socket: SocketIO connection established'));

            socket.on('activated', console.log);

            socket.on('joined', ({ username }: { username: string }) => {
                dispatch({ type: 'addUser', payload: { username } });
            });

            socket.on('users', ({ usernames }: { usernames: string[] }) => {
                for (const username of usernames) {
                    dispatch({ type: 'addUser', payload: { username: username } });
                }
            });

            socket.on('progress-update', (update: { username: string; typed: number }) => {
                dispatch({ type: 'updateTyped', payload: { username: update.username, typed: update.typed } });
            });

            socket.on('starting', (args: { in: number }) => {
                dispatch({ type: 'nextPhase' });
            });

            socket.on('started', ({ words }: { words: string[] }) => {
                dispatch({ type: 'setText', payload: { text: words } });
                dispatch({ type: 'nextPhase' });
            });

            socket.on('error', console.log);

            socket.on('disconnect', (reason: string) => {
                setConnectionAlive(false);
                console.warn('Socket: Connection to server lost. Reason: ', reason);
            });
        }
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{ activateRef, initializeConnection, connectionInitialized: socket !== undefined, connectionAlive }}
        >
            {children}
        </SocketContext.Provider>
    );
};
