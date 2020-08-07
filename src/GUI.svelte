
<script context="module" lang="ts">
  import type Game from './Game';
  import { writable } from 'svelte/store';
  
  export const show = writable(false);

  let _game: Game;
  export function printGame(){
    console.table(
      _game.scene.meshes.reduce((out, m) => {
        out[m.id] = {
          name: m.name,
          pos: m.position.asArray().map(f => f.toFixed(4)).join(" ")
        };
        return out;
      }, {})
    );
  }

  export function close(){
    show.set(false);
  }

  // https://github.com/dceddia/svelte-sass-template
  // https://daveceddia.com/svelte-with-sass-in-vscode/
</script>

<script>
  export let game;
  game.subscribe(value => _game = value);
</script>

{#if $show}
  <div class="gui-background">
    <div class="close" on:click={close}>&#x274C;</div>
    <button on:click={printGame}>Print Game</button>
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