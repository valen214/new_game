<svelte:options immutable={true} />

<script context="module">
  import { writable } from "svelte/store";

  export const game = writable(null);
</script>

<script>
  export let name;

  import GUI, { show } from "./GUI.svelte";
  import { startGame } from "./Game";
  import { scriptLoadPromise } from "./BabylonJSLoader.svelte";
  import { tick } from "svelte";


  
  let started = writable(true);
  let canvas;
  let fps = "";


  let unsub_from_started = started.subscribe(async value => {
    await tick();
    unsub_from_started();
    await scriptLoadPromise;

    
    canvas.addEventListener("keydown", (e) => {
      if(e.code === "Escape"){
        $show = !$show;
        console.log("pause:", $show);
        e.preventDefault();
      }
    });

    console.log("all resource loaded, starting game");
    $game = await startGame(canvas);

    setInterval(() => {
      fps = $game.getFps() || "";
    }, 500);
  });

  show.subscribe(value => {
    if($game) $game.paused = value;
    if(value){

    } else{
      canvas?.focus();
    }
  })

</script>

<main>
  {#if $started}
    <div class="fps-box">{fps}</div>
    <canvas id="renderCanvas"
        bind:this={canvas}
        touch-action="none"></canvas>
    <GUI show={$show} game={game}/>
	{:else}
		<button on:click={() => started.update(true)}>Start</button>
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