import type { IScene } from "./IScene";
import { SkyboxScene } from "./SkyboxScene";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

*/


export class TerrainScene
extends BABYLON.Scene
implements IScene
{
  private initialized = false;
  pressed = new Set<string>();
  constructor(
      engine: BABYLON.Engine,
      options?: BABYLON.SceneOptions
  ){
    super(engine, options);
    
    this.getEngine();
    this.activeCamera = new BABYLON.UniversalCamera(
        "universal camera", new BABYLON.Vector3(0, 5, -10), this);
  }

  addEventListeners(){
    if(!this.initialized){
      throw new Error("scene not initialized, cannot add event listeneres");
    }
    const canvas = this.getEngine().getRenderingCanvas();
    this.activeCamera.attachControl(canvas, true);


  }
  removeEventListeners(){
    const canvas = this.getEngine().getRenderingCanvas();
    this.activeCamera.detachControl(canvas);
  }

  async init(): Promise<void> {
    const canvas = this.getEngine().getRenderingCanvas();
    const camera = this.activeCamera as BABYLON.UniversalCamera;
    
    SkyboxScene.prototype.addSkybox.call(this);

    this.initialized = true;
  }
}