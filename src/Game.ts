
// import GameControl from "./GameControl";
import GLOBAL from "./Global";
import { TestScene } from "./scenes/TestScene";
import { SimpleFightScene } from "./scenes/SimpleFightScene";
import type { IScene } from "./scenes/IScene";

declare type _Scene = BABYLON.Scene & IScene;

class Game
{
  engine: BABYLON.Engine;
  scenes: BABYLON.Scene[] = [];
  private _activeScene: _Scene;
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

    canvas.addEventListener("keydown", e => {
      if(e.code === "KeyI"){
        if(this._activeScene?.debugLayer.isVisible()){
          this._activeScene?.debugLayer.hide();
        } else{
          this._activeScene?.debugLayer.show();
        }
      }
    });

  }

  get activeScene(){
    return this._activeScene;
  }
  set activeScene(value: _Scene){
    if(this._activeScene){
      this._activeScene.removeEventListeners();
    }
    this._activeScene = value;
    this._activeScene.addEventListeners();
  }
  async initScenes(){
    let scene1 = new SimpleFightScene(this.engine);
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
