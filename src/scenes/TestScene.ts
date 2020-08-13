import type { IScene } from "./IScene";
import Common from "../entities/Common";
import Human from "../entities/Human";
import Humanoid from "../entities/Humanoid";
import GLOABL from "../Global";
import { Player } from "../entities/Player";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

*/


export class TestScene
extends BABYLON.Scene
implements IScene
{
  private initialized = false;
  player: Player;
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

    this.onKeyboardObservable.add(({ type, event }) => {
      console.assert(type === BABYLON.KeyboardEventTypes.KEYDOWN);
      this.pressed.add(event.code);
    }, BABYLON.KeyboardEventTypes.KEYDOWN);
    
    this.onKeyboardObservable.add(({ type, event }) => {
      console.assert(type === BABYLON.KeyboardEventTypes.KEYUP);
      this.pressed.delete(event.code);
    }, BABYLON.KeyboardEventTypes.KEYUP);

    this.onPointerObservable.add(() => {

    });
    this.player.attach(this);

  }
  removeEventListeners(){
    this.onKeyboardObservable.clear();
    this.onPointerObservable.clear();
    this.player.detach();
  }

  async init(): Promise<TestScene> {
    const canvas = this.getEngine().getRenderingCanvas();

    this.gravity = new BABYLON.Vector3(0, -9.81, 0);
    this.collisionsEnabled = true;
    
    

    this.activeCamera.attachControl(canvas, true);

    let box = Common.createBox(this, {
      name: "box1"
    });
    box.checkCollisions = true;
    
    
    Humanoid.createHumanoid(this);

    
    let light = new BABYLON.HemisphericLight(
        "hemispheric light 1",
        new BABYLON.Vector3(1, 1, 0), this);
        
    var light2 = new BABYLON.DirectionalLight(
        "directional light 1",
        new BABYLON.Vector3(0, -0.5, -1.0), this);
    light2.position = new BABYLON.Vector3(0, 5, 5);

    
    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;


    await Human.createHuman(this).then(human => {
      human.addShadow(shadowGenerator);
      console.log("HUMAN:", human);
      GLOABL.set("human", human);

      human.meshes[0].name = "player";
      human.meshes[0].position.set(3, 3, 3);
      return human;
    }).then(human => {
      this.player = new Player(human);
    })
    
        

    
    let sphere = Common.createSphere(this, {
      name: "sphere",
      diameter: 2,
    })
    sphere.checkCollisions = true;
    let done = true;
    setTimeout(() => { done = false; }, 3000);
    this.onBeforeRenderObservable.add((a, b) => {
      if(!done){
        done = true;
        console.log(b);
      }
      sphere.moveWithCollisions(this.gravity);
      box.moveWithCollisions(this.gravity);
    })

    
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {
      height: 100, width: 100
    }, this);
    ground.position.set(0, -5, 0);
    ground.checkCollisions = true;

    this.initialized = true;
    return this;
  }
}