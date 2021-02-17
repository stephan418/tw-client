import { Socket } from 'socket.io-client';

export interface User {
    typed: number;
    speed: number;
    username?: string;
    finished?: boolean;
    position?: number;
}

export interface Users {
    [username: string]: User;
}

export interface GlobalState {
    game_id?: string;
    text?: string[];
    phase: number;
    startTS?: number;
    users: Users;
    clientUsername?: string;
    leader?: boolean;
    ref?: string;
}

export type Action =
    | {
          type: 'addUser';
          payload: {
              username: string;
          };
      }
    | {
          type: 'reset';
      }
    | {
          type: 'resetTyping';
      }
    | {
          type: 'updateTyped';
          payload: {
              username: string;
              typed: number;
              speed: number;
          };
      }
    | {
          type: 'updateFinished';
          payload: {
              username: string;
              finished: boolean;
              position: number;
          };
      }
    | {
          type: 'nextPhase';
      }
    | {
          type: 'setText';
          payload: {
              text: string[];
          };
      }
    | {
          type: 'setUsername';
          payload: {
              username: string;
          };
      }
    | {
          type: 'setRef';
          payload: {
              ref: string;
          };
      }
    | {
          type: 'setLeader';
          payload: {
              leader: boolean;
          };
      }
    | {
          type: 'setStartTS';
          payload: {
              ts: number;
          };
      };

export function reducer(state: GlobalState, action: Action): GlobalState {
    switch (action.type) {
        case 'addUser':
            return { ...state, users: { ...state.users, [action.payload.username]: { typed: 0, speed: 0 } } };

        case 'reset':
            return { users: {}, phase: 0 };

        case 'resetTyping':
            let users = {};

            for (let [username, user] of Object.entries(state.users)) {
                users = { ...users, [username]: { typed: 0, speed: 0, finished: false } };
            }

            return { ...state, startTS: undefined, text: undefined, phase: 0, users };

        case 'updateTyped':
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.username]: {
                        ...state.users[action.payload.username],
                        typed: action.payload.typed,
                        speed: action.payload.speed,
                    },
                },
            };

        case 'updateFinished':
            console.log('udpated', action.payload.username, action.payload.finished);
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.username]: {
                        ...state.users[action.payload.username],
                        finished: action.payload.finished,
                        position: action.payload.position,
                    },
                },
            };

        case 'nextPhase':
            return {
                ...state,
                phase: state.phase + 1,
            };

        case 'setText':
            return {
                ...state,
                text: action.payload.text,
            };

        case 'setUsername':
            return {
                ...state,
                clientUsername: action.payload.username,
            };

        case 'setRef':
            return {
                ...state,
                ref: action.payload.ref,
            };

        case 'setLeader':
            return {
                ...state,
                leader: action.payload.leader,
            };

        case 'setStartTS':
            return {
                ...state,
                startTS: action.payload.ts,
            };
    }
}
