
import type { IScene } from "./IScene";

export class SkyboxScene
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

  addSkybox(){
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
      size: 100.0,
    }, this);
    skybox.infiniteDistance = true;

    /*
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    
    skybox.material = skyboxMaterial;

    skyboxMaterial.reflectionTexture =
        new BABYLON.CubeTexture("assets/skybox/skybox", this,
        ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
    skybox.renderingGroupId = -1;

    this.fogMode = BABYLON.Scene.FOGMODE_EXP;
    this.fogDensity = 0.01;
    this.fogStart = 20.0;
    this.fogEnd = 60.0;
    this.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    */

    this.createDefaultSkybox(new BABYLON.CubeTexture(
      "assets/skybox/skybox", this, [
      "_px.png", "_py.png", "_pz.png",
      "_nx.png", "_ny.png", "_nz.png"]), true, 1000)
  }


  async init(): Promise<void> {
    const canvas = this.getEngine().getRenderingCanvas();
    const camera = this.activeCamera as BABYLON.UniversalCamera;

    this.addSkybox();

    this.initialized = true;
  }
}