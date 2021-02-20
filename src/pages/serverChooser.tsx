import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { TextInput } from '../components/textInput';
import { useGlobalState } from '../global/globalStateContext';
import { Page } from './page';
import './serverChooser.scss';

export const ServerChooser: React.FC = () => {
    const [serverHost, setServerHost] = useState('');
    const [globalState, dispatch] = useGlobalState();
    const history = useHistory();

    function submit() {
        if (serverHost.length > 0) {
            dispatch({ type: 'setServerHost', payload: { serverHost } });
            history.push(globalState.continueTo || '/');
            dispatch({ type: 'setContinueTo', payload: { continueTo: undefined } })
        }
    }

    return (
        <Page className="server-chooser">
            <h2>Please enter the IP (Domain-Name, IP-Address, hostname, ...) of the server you want to play on!</h2>
            <div className="grid">
                <TextInput
                    uniqueKey="text-input-server-chooser"
                    className="text-input-server-chooser"
                    onChange={e => setServerHost(e.target.value)}
                    value={serverHost}
                >
                    Server IP
                </TextInput>
                <Button onClick={() => submit()}>&gt;</Button>
            </div>
        </Page>
    )
}
