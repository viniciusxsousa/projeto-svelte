<script lang="ts">
	
  import type IUsuario from "./interfaces/IUsuario";
  import CardUsuario from "./components/CardUsuario.svelte";
  import Header from "./components/Header.svelte";

	let dateGit: IUsuario = null

  function definirUsuario(evento: CustomEvent) {
    dateGit = evento.detail;
  }

</script>

<div class="app">
	<Header on:aoAlterarUsuario={definirUsuario}/>

	{#if dateGit}
		<CardUsuario {dateGit} />
	{/if}

</div>

<style>
	.app {
		max-height: 100vh;
	}
</style>
