import constants from '../global/constants';

export async function create(username: string, serverHost: string) {
    return (
        await fetch(
            `http://${serverHost}:${constants.SERVER_PORT}/create?username=${username}`
        )
    ).json();
}

export async function register(username: string, game_id: string, serverHost: string) {
    return (
        await fetch(
            `http://${serverHost}:${constants.SERVER_PORT}/register?username=${username}&game_id=${game_id}`
        )
    ).json();
}
