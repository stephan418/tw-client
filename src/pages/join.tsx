import React, { useEffect, useState } from 'react';
import { Button, ButtonLink } from '../components/button';
import { TextInput } from '../components/textInput';
import { Page } from './page';
import { InlineMessage } from '../components/inlineMessage';
import './join.scss';
import { AnimatePresence } from 'framer-motion';
import { useHistory, useParams } from 'react-router-dom';
import { useGlobalState } from '../global/globalStateContext';

export const Join: React.FC = () => {
    const [raceId, setRaceId] = useState('');
    const [username, setUsername] = useState('');
    const [unsuccessfulSubmit, setUnsuccessfulSubmit] = useState(false);

    const [globalState, dispatch] = useGlobalState();

    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    useEffect(() => {
        if (id) {
            setRaceId(id);
        }
    }, []);

    function submit() {
        if (!(username && raceId)) {
            setUnsuccessfulSubmit(true);
        } else {
            dispatch({ type: 'setUsername', payload: { username: username } });
            history.push('/lobby/' + raceId);
        }
    }

    return (
        <Page className="create-form-container">
            <TextInput
                uniqueKey="text-input-race-name"
                className="create-text-input-test"
                onChange={e => setRaceId(e.target.value.replace(/\s/g, ''))}
                value={raceId}
                locked={id !== undefined}
            >
                Race ID
            </TextInput>
            <TextInput
                uniqueKey="text-input-username"
                className="create-text-input-username"
                onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                value={username}
            >
                Your name
            </TextInput>

            <Button onClick={e => submit()}>&gt;</Button>

            <AnimatePresence>
                {unsuccessfulSubmit && !(username && raceId) && (
                    <InlineMessage className="join-inline-message">Please fill out all the fields above</InlineMessage>
                )}
            </AnimatePresence>
        </Page>
    );
};
