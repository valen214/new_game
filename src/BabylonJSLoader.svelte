<script>
</script>

<script lang="ts" context="module">
  
  export function prefetch(href: string){
    let link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "script";
    document.head.appendChild(link);
  }

  export function injectScript(src: string, onload: (arg0: Event) => void){
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = src;
    script.onload = onload;
    head.appendChild(script);
  }


  const BABYLON_BASE = "https://preview.babylonjs.com";
  const BABYLON_SCRIPT = [
    "https://code.jquery.com/pep/0.4.2/pep.min.js",
    `${BABYLON_BASE}/ammo.js`,
    `${BABYLON_BASE}/cannon.js`,
    `${BABYLON_BASE}/Oimo.js`,
    `${BABYLON_BASE}/libktx.js`,
    `${BABYLON_BASE}/earcut.min.js`,
  ];
  const BABYLON_MAIN_SCRIPT = `${BABYLON_BASE}/babylon.js`;
  const BABYLON_DEPENDENT_SCRIPT = [
    `${BABYLON_BASE}/inspector/babylon.inspector.bundle.js`,
    `${BABYLON_BASE}/materialsLibrary/babylonjs.materials.min.js`,
    `${BABYLON_BASE}/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js`,
    `${BABYLON_BASE}/postProcessesLibrary/` +
        `babylonjs.postProcess.min.js`,
    `${BABYLON_BASE}/loaders/babylonjs.loaders.js`,
    `${BABYLON_BASE}/serializers/babylonjs.serializers.min.js`,
    `${BABYLON_BASE}/gui/babylon.gui.min.js`,
  ];

  console.log("load script");
  export const scriptLoadPromise = (async () => {
    let p1 = BABYLON_SCRIPT.map(src => (
      new Promise(res => injectScript(src, res))
    ));

    /*
    // await new Promise(res => injectScript(BABYLON_MAIN_SCRIPT, res));
    
    it's loaded in dist/index.html
    because bundle.js accessed BABYLON.Scene in
    `TestScene.ts: TestScene extends BABYLON.Scene`
    
    */

    let p2 = BABYLON_DEPENDENT_SCRIPT.map(src => (
      new Promise(res => injectScript(src, res))
    ));

    await Promise.all([...p1, ...p2]);
  })();

  declare global {
    namespace JSX {
      interface HTMLProps {
        as?: string;
      }

      interface HTMLAttributes {
        as?: string;
      }
    }
  }
</script>



<svelte:head>
	{#each [
      ...BABYLON_SCRIPT,
      BABYLON_MAIN_SCRIPT,
      ...BABYLON_DEPENDENT_SCRIPT] as src }
    <link rel="prefetch" href={src} { ...{ as:"script" } } />
  {/each}
</svelte:head>