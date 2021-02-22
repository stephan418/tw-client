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
import constants from '../global/constants';
import { Dropdown } from '../components/dropdown';

const listItemVariants: Variants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
};

const Prerace: React.FC = () => {
    const [globalState, dispatch] = useGlobalState();
    const socket = useSocketConnection();

    return (
        <>
            <div className="prerace-lobby">
                <h2 className="tile-title">Participants</h2>
                {globalState.users && (
                    <motion.ul key="user-list" className="user-list" initial="initial" animate="in">
                        {Object.entries(globalState.users).map(([n, user]) => (
                            <motion.li variants={listItemVariants} className="racer" key={n}>
                                {n}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </div>

            <div className="seperator-line"></div>

            <div className="prerace-settings">
                <h2 className="tile-title">Race</h2>
                {globalState.leader ? (
                    <>
                        <Button secondary onClick={() => console.log('Copy into clipboard')}>
                            Copy invite
                        </Button>
                        <Button onClick={() => socket?.startGame(globalState.wordListName)}>Start game!</Button>
                        <Dropdown
                            value={globalState.wordListName || 'default'}
                            onChange={n => dispatch({ type: 'setWordListName', payload: { wordListName: n } })}
                            name="wordListSelect"
                            options={
                                globalState.wordLists?.map(({ name, commonName }) => {
                                    return { value: name, display: commonName };
                                }) || [{ value: 'default', display: 'Default' }]
                            }
                        />
                    </>
                ) : (
                    <Loader speed={300}>Waiting for leader to start</Loader>
                )}
            </div>
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
            history.push('/');
        } else if (!globalState.clientUsername) {
            history.push('/join/' + id);
        } else if (!globalState.ref) {
            register(globalState.clientUsername, id, globalState.serverHost || constants.SERVER_NAME)
                .then((json: any) => {
                    if (!json || json.type === 'error' || !json.type) {
                        console.error(json?.error);
                        history.push('/');
                    } else if (json.type === 'success') {
                        dispatch({
                            type: 'setRef',
                            payload: { ref: json.result.ref },
                        });
                    }
                })
                .catch(e => {
                    console.error(e);
                    history.push('/');
                });
        }

        return () => dispatch({ type: 'setRef', payload: { ref: '' } });
    }, []);

    useEffect(() => {
        if (!socket?.connectionInitialized && globalState.clientUsername) {
            socket?.initializeConnection(globalState.serverHost);
        }

        if (globalState.ref && socket?.connectionAlive) {
            socket?.activateRef(globalState.ref);
        }
    }, [globalState.ref, socket?.connectionAlive]);

    useEffect(() => {
        if (globalState.clientUsername && globalState.clientUsername in globalState.users) {
            setLoading(false);
        }
    }, [globalState.users]);

    useEffect(() => {
        if (globalState.phase > 0) {
            history.push('/race/' + id);
        }
    }, [globalState.phase]);

    return (
        <Page className="lobby-container">
            {!loading && <Prerace />}
            {loading && <Loader />}
        </Page>
    );
};
