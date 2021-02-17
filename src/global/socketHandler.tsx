import React, { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGlobalState } from './globalStateContext';
import constants from '../global/constants';

type SocketEvent = 'roomReset';

type SocketEvents = {
    [k in SocketEvent]?: Function[];
};

interface SocketContextType {
    initializeConnection: Function;
    activateRef: Function;
    startGame: Function;
    updateProgress: Function;
    resetRoom: Function;
    on: (e: SocketEvent, f: Function) => void;
    connectionInitialized: boolean;
    connectionAlive: boolean;
}

const SocketContext = React.createContext<SocketContextType | undefined>(
    undefined
);

export function useSocketConnection(): SocketContextType | undefined {
    return useContext(SocketContext);
}

export const SocketHandler: React.FC = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [listeners, setListeners] = useState<SocketEvents>({});
    const [connectionAlive, setConnectionAlive] = useState(false);
    const [globalState, dispatch] = useGlobalState();

    function initializeConnection(force = false) {
        if (!socket || force) {
            setSocket(io(`${constants.SERVER_NAME}:${constants.SERVER_PORT}`));
            setConnectionAlive(true);
        }
    }

    function updateProgress(typed: number) {
        const startTS = globalState.startTS ?? 0;
        const timeTaken = new Date().getTime() - startTS;

        const speed = typed / (timeTaken / (200 * 60));

        socket?.emit('update-progress', { typed, speed });
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

    function resetRoom() {
        if (globalState.leader) {
            socket?.emit('reset');
            return true;
        }

        return false;
    }

    function addEventListener(e: SocketEvent, f: Function) {
        setListeners((p) => {
            return { ...p, [e]: p[e] ? p[e]?.concat(f) : [f] };
        });
    }

    const dispatchEvent = (e: SocketEvent) => {
        for (let f of listeners[e] || []) {
            f();
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('connect', () =>
                console.info('Socket: SocketIO connection established')
            );

            socket.on('activated', ({ username }: { username: string }) => {
                dispatch({ type: 'addUser', payload: { username } });
            });

            socket.on('joined', ({ username }: { username: string }) => {
                dispatch({ type: 'addUser', payload: { username } });
            });

            socket.on('users', ({ usernames }: { usernames: string[] }) => {
                for (const username of usernames) {
                    dispatch({
                        type: 'addUser',
                        payload: { username: username },
                    });
                }
            });

            socket.on(
                'progress-update',
                (update: {
                    username: string;
                    typed: number;
                    speed: number;
                }) => {
                    dispatch({
                        type: 'updateTyped',
                        payload: {
                            username: update.username,
                            typed: update.typed,
                            speed: update.speed,
                        },
                    });
                }
            );

            socket.on('starting', (args: { in: number; words: string[] }) => {
                dispatch({ type: 'setText', payload: { text: args.words } });
                dispatch({ type: 'nextPhase' });
            });

            socket.on('started', () => {
                dispatch({ type: 'nextPhase' });
                dispatch({
                    type: 'setStartTS',
                    payload: { ts: new Date().getTime() },
                });
            });

            socket.on(
                'finished-typing',
                ({
                    username,
                    position,
                }: {
                    username: string;
                    position: number;
                }) => {
                    console.log('finished', position);
                    dispatch({
                        type: 'updateFinished',
                        payload: { username, finished: true, position },
                    });
                }
            );

            socket.on('error', console.log);

            socket.on('disconnect', (reason: string) => {
                setConnectionAlive(false);
                console.warn(
                    'Socket: Connection to server lost. Reason: ',
                    reason
                );
            });
        }
    }, [socket]);

    useEffect(() => {
        socket?.on('room-reset', () => {
            if (globalState.leader) {
                startGame();
            }

            dispatch({ type: 'resetTyping' });
            dispatchEvent('roomReset');
        });
    }, [socket, listeners]);

    return (
        <SocketContext.Provider
            value={{
                activateRef,
                initializeConnection,
                startGame,
                updateProgress,
                resetRoom,
                on: addEventListener,
                connectionInitialized: socket !== undefined,
                connectionAlive,
            }}
        >
            {children}{' '}
        </SocketContext.Provider>
    );
};
