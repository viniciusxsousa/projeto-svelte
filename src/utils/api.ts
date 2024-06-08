export function obterUsuario(nomeUsuario: string) {
    return fetch(`https://api.github.com/users/${nomeUsuario}`);
}

export function obterRepositorios(nomeUsuario: string) {
    return fetch(`https://api.github.com/users/${nomeUsuario}/repos?sort=created&per_page=5`);
}