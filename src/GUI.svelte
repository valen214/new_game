
<script context="module" lang="ts">
  import type Game from './Game';
  import { writable } from 'svelte/store';
  
  export const show = writable(false);

  
  export function close(){
    show.set(false);
  }

  // https://github.com/dceddia/svelte-sass-template
  // https://daveceddia.com/svelte-with-sass-in-vscode/
</script>

<script>
  export let game;


  
  $: meshes = $game?.scene.meshes;
  $: gameInfo = meshes?.map((m) => {
    return {
      id: m.id,
      name: m.name,
      pos: m.position.asArray().map(f => f.toFixed(4)).join(" ")
    };
  });

  
  $: infoHeaders = gameInfo?.length && Object.keys(gameInfo[0]);

  function printMesh(i){
    console.log($game?.scene.meshes[i]);
  }
  setInterval(() => {
    meshes = $game?.scene.meshes.slice(0);
  }, 1000);
</script>

{#if $show}
  <div class="gui-background">
    <div class="close" on:click={close}>&#x274C;</div>
    {#if gameInfo}
      <table class="mesh-info-table">
        <thead>
          <tr>
            {#each infoHeaders as header}
              <th>{ header }</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each gameInfo as info, i}
            <tr class="mesh-entry" on:click={() => printMesh(i)}>
              {#each infoHeaders as key}
                <td>{ info[key] }</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{/if}

<style>
  .gui-background {
    background-color: rgba(0, 0, 0, 0.9);
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .mesh-info-table {
    background: white;
    padding: 15px;
  }

  .mesh-entry {
    cursor: pointer;
  }
  .mesh-entry:hover {
    background:rgba(255, 255, 255, 0.7);
  }

  .close {
    height: 50px;
    width: 50px;
    margin-bottom: 15px;
    
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    background: rgba(255, 255, 255, 0.7);
    border: 1px solid white;

  }
</style>