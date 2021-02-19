import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { InlineMessage } from '../components/inlineMessage';
import { TextInput } from '../components/textInput';
import { useGlobalState } from '../global/globalStateContext';
import { create } from '../util/api';
import { Page } from './page';
import './create.scss';

export const Create: React.FC = () => {
    const [username, setUsername] = useState('');
    const [unsuccessullSubmit, setUnsuccessfulSubmit] = useState(false);

    const [globalState, dispatch] = useGlobalState();

    const history = useHistory();

    function submit() {
        if (!username) {
            setUnsuccessfulSubmit(true);
        } else {
            dispatch({ type: 'setUsername', payload: { username } });
            create(username).then((json: any) => {
                if (!json || json.type !== 'success') {
                    console.error(json);
                } else {
                    dispatch({ type: 'setRef', payload: { ref: json.result.ref } });
                    dispatch({ type: 'setLeader', payload: { leader: true } });
                    history.push('/tw-client/lobby/' + json.result.game_id);
                }
            });
        }
    }

    return (
        <Page className="create-container">
            <TextInput
                uniqueKey="create-input-username"
                className="create-input-username"
                onChange={e => setUsername(e.target.value)}
                value={username}
            >
                Your name
            </TextInput>

            <Button onClick={e => submit()}>&gt;</Button>

            <AnimatePresence>
                {unsuccessullSubmit && !username && (
                    <InlineMessage className="create-inline-message">Please fill out all the filed above</InlineMessage>
                )}
            </AnimatePresence>
        </Page>
    );
};
