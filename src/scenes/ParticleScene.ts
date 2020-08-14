import type { IScene } from "./IScene";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

*/


export class ParticleScene
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
      throw new Error("scene not initialized, " +
          "cannot add event listeneres");
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

    
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this);
    particleSystem.particleTexture = new BABYLON.Texture("assets/flare.png", this);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.start();

    (this.activeCamera as BABYLON.UniversalCamera).setTarget(
      BABYLON.Vector3.Zero()
    );

    this.initialized = true;
  }
}