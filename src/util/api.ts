export async function create(username: string) {
    return (await fetch(`http://localhost:3042/create?username=${username}`)).json();
}

export async function register(username: string, game_id: string) {
    return (await fetch(`http://localhost:3042/register?username=${username}&game_id=${game_id}`)).json();
}
