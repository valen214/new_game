import App from './App.svelte';


import type * as BABYLON_TYPE from "babylonjs";
import type * as BABYLON_GUI from "babylonjs-gui"
declare global {
  interface Window {
    BABYLON: typeof BABYLON_TYPE & {
      GUI: typeof BABYLON_GUI
    };
  }
}


const app = new App({
	target: document.body,
	props: {
		name: 'World'
	}
});

export default app;