

import GameUI from "./GameUI";


export default function GameRenderLoop(
    engine: BABYLON.Engine,
    scene: BABYLON.Scene){
  let camera = scene.activeCamera;
  
  scene.render();
  GameUI.info_text.text = scene.getMeshByName("sphere")
    .position.asArray().map((x, i) => {
      return `${"xyz"[i]}: ${x.toFixed(2)}`
    }).join(", ");
}