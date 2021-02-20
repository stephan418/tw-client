import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Loader } from '../components/loader';
import { User, Users } from '../global/globalState';
import { useGlobalState } from '../global/globalStateContext';
import { useSocketConnection } from '../global/socketHandler';
import { Page } from './page';
import Eyedropper from '@/assets/eyedropper.svg';
import './race.scss';
import './userList.scss';
import { motion } from 'framer-motion';
import { Button } from '../components/button';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

interface WordPreviewProps {
    words: string[];
}

const WordPreview: React.FC<WordPreviewProps> = ({ words }) => {
    return (
        <div className="word-preview">
            <span>{words[0]}</span>&#8203; {words.slice(1).join(' ')}
        </div>
    );
};

interface WordInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    wrong?: boolean;
    waiting?: boolean;
    loading?: boolean;
}

const WordInput: React.FC<WordInputProps> = ({
    onChange,
    value,
    wrong,
    waiting,
    loading,
}) => {
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (input.current && !(waiting || loading)) {
            input.current.focus();
        }
    }, [loading, waiting]);

    return (
        <>
            <input
                type="text"
                className={
                    'word-input' +
                    (wrong ? ' wrong' : ' correct') +
                    (loading ? ' loading' : '')
                }
                onChange={onChange}
                value={value}
                disabled={loading}
                autoFocus
                ref={input}
            />
            {waiting && <Loader message="Starting in 5 seconds" />}
        </>
    );
};

interface UserListItemProps {
    username: string;
    speed: number;
    percent: number;
    operator?: boolean;
    finished?: boolean;
}

export const UserListItem: React.FC<UserListItemProps> = ({
    username,
    speed,
    percent,
    operator,
    finished,
}) => {
    return (
        <motion.li
            layout
            transition={{ type: 'spring' }}
            animate={finished ? { scale: 0.9 } : {}}
        >
            {username}{' '}
            <UserProgress speed={speed} percent={percent}></UserProgress>
        </motion.li>
    );
};

export const UserProgress: React.FC<{ speed: number; percent: number }> = ({
    percent,
    speed,
}) => {
    return (
        <div className="progress-bar">
            <div className="speed-handle" style={{ left: `${percent}%` }}>
                <Eyedropper className="eyedropper" /> <br />{' '}
                <span className="text">{Math.round(speed)} WPM</span>
            </div>
        </div>
    );
};

interface UserListProps {
    users: Users;
    textLength: number;
}

export const UserList: React.FC<UserListProps> = ({ users, textLength }) => {
    return (
        <ol>
            {Object.entries(users)
                .filter(([_, user]) => user.finished)
                .sort((a, b) => (a[1].position || 0) - (b[1].position || 0))
                .map(([username, { speed, typed, finished }]) => (
                    <UserListItem
                        key={username}
                        percent={100}
                        speed={speed}
                        username={username}
                        finished={true}
                    />
                ))}
            {Object.entries(users)
                .filter(
                    ([_, user]) => user.finished === undefined || !user.finished
                )
                .sort((a, b) => b[1].typed - a[1].typed)
                .map(([username, { speed, typed, finished }]) => (
                    <UserListItem
                        key={username}
                        percent={(typed * 100) / textLength}
                        speed={speed}
                        username={username}
                        finished={finished}
                    />
                ))}
        </ol>
    );
};

export const Race: React.FC = () => {
    const [input, setInput] = useState('');
    const [words, setWords] = useState<string[]>(['Hey']);
    const [length, setLength] = useState(200);
    const [milestone, setMilestone] = useState(0);
    const [schedule, setSchedule] = useState<NodeJS.Timeout | undefined>();
    const [hasTyped, setHasTyped] = useState(false);

    const [globalState, dispatch] = useGlobalState();
    const socket = useSocketConnection();
    const history = useHistory();

    if (
        !(
            globalState.users &&
            globalState.clientUsername &&
            socket?.connectionAlive
        )
    ) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Redirect to="/" />
            </motion.div>
        );
    }

    useEffect(() => {
        socket.on('roomReset', () => {
            resetComponent();
        });
    }, []);

    useEffect(() => {
        setWords(globalState.text || 'Hey'.split(' '));

        if (globalState.text) {
            setLength(globalState.text.join(' ').length);
        }
    }, [globalState.text]);

    useEffect(() => {
        if (input.slice(-1) === ' ' && words[0] === input.slice(0, -1)) {
            setWords(words.slice(1));
            setInput('');

            if (!hasTyped) setHasTyped(true);
        }
    }, [input]);

    function isWrong() {
        if (words.length === 0) return false;

        return !words[0].startsWith(input);
    }

    useEffect(() => {
        (window as any).words = words;

        if (
            hasTyped &&
            (length - words.join(' ').length) / length >= milestone / 100
        ) {
            socket?.updateProgress(length - words.join(' ').length);
            setMilestone((p) => p + 10);

            if (schedule) {
                clearInterval(schedule);
            }

            setSchedule(
                setInterval(() => {
                    socket?.updateProgress(
                        length - (window as any).words.join(' ').length
                    );
                }, 5000)
            );
        }
    }, [words]);

    useEffect(() => {
        if (
            globalState.clientUsername &&
            globalState.users[globalState.clientUsername].finished &&
            schedule
        ) {
            clearInterval(schedule);
        }
    }, [globalState.users[globalState.clientUsername || ''].finished]);

    // Cleanup
    useEffect(
        () => () => {
            dispatch({ type: 'reset' });
        },
        []
    );

    function resetComponent() {
        setInput('');
        setWords(['Hey']);
        setLength(200);
        setMilestone(0);
        setSchedule(undefined);
        setHasTyped(false);
    }

    return (
        <Page className="race-container">
            <WordPreview words={words} />
            <WordInput
                loading={
                    globalState.phase !== 2 ||
                    globalState.users[globalState.clientUsername || '']
                        ?.finished
                }
                waiting={globalState.phase !== 2}
                wrong={isWrong()}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <UserList users={globalState.users} textLength={length} />
            {globalState.leader &&
                globalState.users[globalState.clientUsername || '']
                    .finished && (
                    <Button
                        className="restart-button"
                        onClick={() => {
                            socket?.resetRoom();
                        }}
                    >
                        Restart
                    </Button>
                )}
        </Page>
    );
};
