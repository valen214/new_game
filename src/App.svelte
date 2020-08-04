<script lang="ts">
  import { startGame, getFps } from "./Game";
  import type { LoadedFunction } from "./TaskScheduler";
  import { waitFor } from "./TaskScheduler";
  
	export let name: string;
  
  const BABYLON_BASE = "https://preview.babylonjs.com";
  const BABYLON_SCRIPT = [
    "https://code.jquery.com/pep/0.4.2/pep.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/" +
        "dat-gui/0.6.2/dat.gui.min.js",
    `${BABYLON_BASE}/ammo.js`,
    `${BABYLON_BASE}/cannon.js`,
    `${BABYLON_BASE}/Oimo.js`,
    `${BABYLON_BASE}/libktx.js`,
    `${BABYLON_BASE}/earcut.min.js`,
    `${BABYLON_BASE}/babylon.js`,
    `${BABYLON_BASE}/inspector/babylon.inspector.bundle.js`,
    `${BABYLON_BASE}/materialsLibrary/babylonjs.materials.min.js`,
    `${BABYLON_BASE}/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js`,
    `${BABYLON_BASE}/postProcessesLibrary/` +
        `babylonjs.postProcess.min.js`,
        `${BABYLON_BASE}/loaders/babylonjs.loaders.js`,
    `${BABYLON_BASE}/serializers/babylonjs.serializers.min.js`,
    `${BABYLON_BASE}/gui/babylon.gui.min.js`,
  ];
  
  let started = true;
  let fps = "";
  setInterval(() => {
    fps = getFps();
  }, 500);

  let [
      loadCanvas, 
      ...babylonLoaded
  ] = waitFor(BABYLON_SCRIPT.length + 1,
  (canvas, _, _1, gui) => {
    console.log("all resource loaded, starting game");
    console.log(gui);
    startGame(canvas);
  })

  // "tick-less" approach
  let canvasContainer = Object.defineProperty({},
    "canvas", {
    set(value){
      loadCanvas(value);
    }
  });

  const BABYLON_LOADER = BABYLON_SCRIPT.map((url, i) => [
    url, babylonLoaded[i]
  ]);
  (async () => {
    function injectScript(src, onload){
      let head = document.getElementsByTagName("head")[0];
      let script = document.createElement("script");
      script.src = src;
      script.onload = onload;
      head.appendChild(script);
    }

    for(var i = 0; i < BABYLON_LOADER.length; ++i){
      await new Promise(res => {
        let [ src, onload ] = BABYLON_LOADER[i];
        injectScript(src, () => {
          (onload as LoadedFunction)();
          res();
        });
      }
      );
    }
  })();


</script>

<svelte:head>
  <!--
	{#each BABYLON_LOADER as [ src, load ]}
    <script src={src} on:load={load}></script>
  {/each}
  -->
</svelte:head>


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