
// import GameControl from "./GameControl";
import GameUI from "./GameUI";
import GameRenderLoop from "./GameRenderLoop";
import GameScene, { createScene } from "./GameScene";
import * as GLOBAL from "./Global";
import { Player } from "./GamePlayer";

export var engine: BABYLON.Engine;
export var scene: BABYLON.Scene;
export var canvas: HTMLCanvasElement;
export var gameScene: GameScene;

class Game
{
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement;
  gameScene: GameScene;

  constructor(){

  }
}
export default Game;

export function getFps(){
  return engine?.getFps().toFixed(2);
}

export async function startGame(_canvas: HTMLCanvasElement){
  canvas = _canvas;
  
  engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true, stencil: true
  });
  engine.enableOfflineSupport = false;
  
  BABYLON.Animation.AllowMatricesInterpolation = true;
  
  gameScene = GameScene.createScene(engine, canvas);
  scene = gameScene.scene;


  GameUI.createUI();

  engine.runRenderLoop(function(){
    GameRenderLoop(engine, scene);
  });


  let game = new Game();
  game.engine = engine;
  game.scene = scene;
  game.gameScene = gameScene;
  game.canvas = canvas;
  GLOBAL.setGame(game);
}

window.addEventListener("resize", function(e: UIEvent){
  let rect = document.getElementsByTagName("body")[0].getBoundingClientRect();
  if(canvas){
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  engine?.resize();
});



export function keyDown(e){
  // Shift+Ctrl+Alt+I
  if (e.shiftKey && e.ctrlKey &&
      e.altKey && e.keyCode === 73) {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show();
    }
  }
}