<script lang="ts">
	import Titulo from "./components/Titulo.svelte";
	
  import type IUsuario from "./interfaces/IUsuario";
  import CardUsuario from "./components/CardUsuario.svelte";
  import Formulario from "./components/Formulario.svelte";

	let dateGit: IUsuario = null

  function definirUsuario(evento: CustomEvent) {
    dateGit = evento.detail;
  }

</script>

<div class="app">
	<header>
		<Titulo/>

		<div class="busca-usuario">
			<Formulario on:aoAlterarUsuario={definirUsuario} />
		</div>
	</header>

	{#if dateGit}
		<CardUsuario {dateGit} />
	{/if}

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

</style>
