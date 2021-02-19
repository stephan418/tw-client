import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loader } from '../components/loader';
import { useGlobalState } from '../global/globalStateContext';
import { useSocketConnection } from '../global/socketHandler';
import { register } from '../util/api';
import { Page } from './page';
import './lobby.scss';
import { Button } from '../components/button';

const listItemVariants: Variants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
};

const Prerace: React.FC = () => {
    const [globalState, _] = useGlobalState();
    const socket = useSocketConnection();

    return (
        <>
            <h2>Joined:</h2>
            {globalState.users && (
                <motion.ul
                    key="prerace"
                    className="prerace"
                    initial="initial"
                    animate="in"
                >
                    {Object.entries(globalState.users).map(([n, user]) => {
                        return (
                            <motion.li
                                variants={listItemVariants}
                                className="racer"
                                key={n}
                            >
                                {n}
                            </motion.li>
                        );
                    })}
                </motion.ul>
            )}
            {globalState.leader ? (
                <Button onClick={() => socket?.startGame()}>Start game!</Button>
            ) : (
                <Loader speed={300}>Waiting for leader to start</Loader>
            )}
        </>
    );
};

export const Lobby: React.FC = () => {
    const [globalState, dispatch] = useGlobalState();
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const socket = useSocketConnection();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            history.push('/tw-client/');
        } else if (!globalState.clientUsername) {
            history.push('/tw-client/join/' + id);
        } else if (!globalState.ref) {
            register(globalState.clientUsername, id)
                .then((json: any) => {
                    if (!json || json.type === 'error' || !json.type) {
                        console.error(json?.error);
                        history.push('/tw-client/');
                    } else if (json.type === 'success') {
                        dispatch({
                            type: 'setRef',
                            payload: { ref: json.result.ref },
                        });
                    }
                })
                .catch((e) => {
                    console.error(e);
                    history.push('/tw-client/');
                });
        } else {
            console.log(globalState.users);
        }

        return () => dispatch({ type: 'setRef', payload: { ref: '' } });
    }, []);

    useEffect(() => {
        if (!socket?.connectionInitialized) {
            socket?.initializeConnection();
        }

        if (globalState.ref && socket?.connectionAlive) {
            socket?.activateRef(globalState.ref);
        }
    }, [globalState.ref, socket?.connectionAlive]);

    useEffect(() => {
        if (
            globalState.clientUsername &&
            globalState.clientUsername in globalState.users
        ) {
            setLoading(false);
        }
    }, [globalState.users]);

    let render = <Loader />;

    if (globalState.phase !== 0 && !loading) {
        render = <h2>Racetrack :D</h2>;
    } else if (!loading) {
        render = <Prerace />;
    }

    useEffect(() => {
        if (globalState.phase > 0) {
            history.push('/tw-client/race/' + id);
        }
    }, [globalState.phase]);

    return (
        <Page className="race-container">
            {!loading && <Prerace />}
            {loading && <Loader />}
        </Page>
    );
};
