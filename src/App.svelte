<script lang="ts">
  import { startGame, getFps } from "./Game";
  import { scriptLoadPromise } from "./BabylonJSLoader.svelte";
  
	export let name: string;
  
  let started = true;
  let fps = "";
  setInterval(() => {
    fps = getFps();
  }, 500);


  // "tick-less" approach
  let canvasContainer = Object.defineProperty({},
    "canvas", {
    async set(value){
      await scriptLoadPromise;
      console.log("all resource loaded, starting game");
      startGame(value);
      
    }
  });


</script>



<main>
  {#if started}
    <div class="fps-box">{fps}</div>
    <canvas id="renderCanvas"
        bind:this={canvasContainer.canvas}
        touch-action="none"></canvas>
	{:else}
		<button on:click={() => started = true}>Start</button>
		<h1>Hello {name}!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">
        Svelte tutorial</a> to learn how to build Svelte apps.</p>
	{/if}
</main>

<style>
  :global(body), main {
    margin: 0;
    border: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .fps-box {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    width: auto;
    padding: 5px;
    background: white;
  }

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}


	#renderCanvas {
		width: 100%;
		height: 100%;
		touch-action: none;
	}

	@media (min-width: 640px) {
	}
</style>