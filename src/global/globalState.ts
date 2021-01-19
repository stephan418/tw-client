import { Socket } from 'socket.io-client';

export interface User {
    typed: number;
    username?: string;
}

interface Users {
    [username: string]: User;
}

export interface GlobalState {
    game_id?: string;
    text?: string[];
    phase?: number;
    users: Users;
    client_username?: string;
    leader?: boolean;
}

export type Action =
    | {
          type: 'addUser';
          payload: {
              username: string;
          };
      }
    | {
          type: 'updateTyped';
          payload: {
              username: string;
              typed: number;
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
      };

export function reducer(state: GlobalState, action: Action): GlobalState {
    switch (action.type) {
        case 'addUser':
            return { ...state, users: { ...state.users, [action.payload.username]: { typed: 0 } } };
        case 'updateTyped':
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.username]: { typed: action.payload.typed },
                },
            };
        case 'nextPhase':
            return {
                ...state,
                phase: state.phase && state.phase + 1,
            };

        case 'setText':
            return {
                ...state,
                text: action.payload.text,
            };
    }
}
