<script lang="ts">
	import Titulo from "./components/Titulo.svelte";
	import BarraSuperior from "./components/BarraSuperior.svelte";
	
    import type IUsuario from "./interfaces/IUsuario";

	let dateGit: IUsuario = {
		avatar_url: 'https://github.com/viniciusxsousa.png',
		login: 'viniciusxsousa',
		nome: 'Vinicius Sousa',
		perfil_url: 'https://github.com/viniciusxsousa',
		repositorios_publicos: 30,
		seguidores: 20
	}

	let user = ''

	function aoSubmeter() {
		console.log(user);
	}
</script>

<div class="app">
	<header>
		<Titulo/>

		<div class="busca-usuario">
			<form on:submit|preventDefault={aoSubmeter}>
				<input type="text" class="input" placeholder="Digite o usuário" bind:value={user}>

				<div class="botao-container">
					<button type="submit" class="botao" >Buscar</button>
				</div>
			</form>
		</div>
	</header>

	<div class="card-usuario">
		<BarraSuperior/>

		<div class="usuario">
			<div class="foto-container">
				<a href={dateGit.perfil_url} target='_blank'>
					<div
						class="foto-usuario" 
						style:background-image="url({dateGit.avatar_url})"
					>
					</div>
				</a>
			</div>

			<div class="detalhes-usuario">
				<div class="info">Nome: <span>{dateGit.nome}</span></div>
				<div class="info">Usuário: <span>{dateGit.login}</span></div>
				<div class="info">Seguidores: <span>{dateGit.seguidores}</span></div>
				<div class="info">Repositorios<span>{dateGit.repositorios_publicos}</span></div>
			</div>
		</div>
	</div>
</div>

<style>
	.app {
		max-height: 100vh;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.busca-usuario {
    position: relative;
    width: 70%;
  }

  .input {
    padding: 15px 25px;
    width: calc(100% - 8.75rem);
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #2e80fa;
    box-shadow: 0px 17px 52px rgba(222, 231, 247, 0.4);
    outline: 0;
  }

  .input::placeholder {
    font-family: "Roboto";
    font-style: italic;
    font-weight: 300;
    font-size: 19.5px;
    line-height: 26px;
    color: #6e8cba;
  }

  .botao-container {
    position: absolute;
    width: 9.625rem;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
  }

  .botao {
    padding: 15px 24px;
    border-radius: 8px;
    border: none;
    background: #2e80fa;
    line-height: 26px;
    color: #fff;
    font-size: 22px;
    cursor: pointer;

    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    gap: 13px;
  }

  .botao:hover {
    background: #4590ff;
  }

  .card-usuario {
    margin-top: 65px;
  }

  .usuario {
    padding: 28px 0;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: -12px 37px 45px rgba(133, 127, 201, 0.18);
    border-radius: 0px 0px 13px 13px;

    display: flex;
    justify-content: center;
  }

  .foto-container {
    margin-right: 81px;
  }

  .foto-usuario {
    width: 12.75rem;
    height: 12.75rem;
    border: 4.56px solid #2e80fa;
    border-radius: 50%;
    background-size: cover;
  }

  .detalhes-usuario {
    margin-right: 55px;
  }

  .detalhes-usuario > .info {
    font-weight: 600;
    font-size: 20px;
    line-height: 31px;
    color: #395278;
  }

  .detalhes-usuario > .info > span {
    color: #6781a8;
    font-weight: normal;
  }

</style>
