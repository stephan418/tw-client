import constants from '../global/constants';

export async function create(username: string) {
    return (
        await fetch(
            `http://${constants.SERVER_NAME}:${constants.SERVER_PORT}/create?username=${username}`
        )
    ).json();
}

export async function register(username: string, game_id: string) {
    return (
        await fetch(
            `http://${constants.SERVER_NAME}:${constants.SERVER_PORT}/register?username=${username}&game_id=${game_id}`
        )
    ).json();
}
