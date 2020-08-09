
// import GameControl from "./GameControl";
import GameUI from "./GameUI";
import GameRenderLoop from "./GameRenderLoop";
import GLOBAL from "./Global";
import { TestScene } from "./scenes/TestScene";
import { SimpleFightScene } from "./scenes/SimpleFightScene";
import GameInput from "./GameInput";

class Game
{
  engine: BABYLON.Engine;
  scenes: BABYLON.Scene[] = [];
  activeScene: BABYLON.Scene;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement){
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true, stencil: true,
    });
    this.engine.enableOfflineSupport = false;

    BABYLON.Animation.AllowMatricesInterpolation = true;

    
    const _this = this;
    window.addEventListener("resize", function(e: UIEvent){
      let rect = document.getElementsByTagName("body")[0].getBoundingClientRect();
      if(canvas){
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      _this.engine?.resize();
    });


  }

  async initScenes(){
    let scene1 = new SimpleFightScene(this.engine);
    // scene1.attachControl()
    await scene1.init();

    this.activeScene = scene1;
  }

  async start(){
    this.engine.runRenderLoop(() => {
      this.activeScene?.render();
    });
  }

  getFps(){
    return this.engine?.getFps().toFixed(2);
  }
}
export default Game;


export async function startGame(_canvas: HTMLCanvasElement){
  let game = new Game(_canvas);
  GLOBAL.set("game", game);
  await game.initScenes();
  game.start();

  return game;
}
