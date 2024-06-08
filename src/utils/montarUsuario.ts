import IRepositorio from "../interfaces/IRepositorio";
import IUsuario from "../interfaces/IUsuario";

export default function montarUsuario(dadosUsuario: any, dadosRepositorio: any): IUsuario {
    const repositorios_recentes = dadosRepositorio.map( (repositorio) => {
        return {
            nome: repositorio.name,
            url: repositorio.url
        } as IRepositorio
    } )


    return {
        avatar_url: dadosUsuario.avatar_url,
        login: dadosUsuario.login,
        nome: dadosUsuario.name,
        perfil_url: dadosUsuario.html_url,
        repositorios_publicos: dadosUsuario.public_repos,
        seguidores: dadosUsuario.followers,
        repositorios_recentes: repositorios_recentes
    }
}