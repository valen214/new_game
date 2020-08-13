import type { IScene } from "./IScene";
import Common from "../entities/Common";
import Human from "../entities/Human";
import Humanoid from "../entities/Humanoid";
import GLOABL from "../Global";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

*/


export class TestScene
extends BABYLON.Scene
implements IScene
{
  player: Human;
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

  }
  removeEventListeners(){
    this.onKeyboardObservable.clear();
    this.onPointerObservable.clear();
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


    this.player = await Human.createHuman(this).then(human => {
      human.addShadow(shadowGenerator);
      console.log("HUMAN:", human);
      GLOABL.set("human", human);

      human.meshes[0].name = "player";
      human.meshes[0].position.set(3, 3, 3);
      return human;
    });
    
        

    
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

    
    let last_frame_time = performance.now();
    this.onBeforeRenderObservable.add(() => {
      let elapsed = performance.now() - last_frame_time;
      let elapsed_sec = elapsed * 0.001;
      last_frame_time = performance.now();

      let c = this.activeCamera.getForwardRay().direction;
      let norm_c = new BABYLON.Vector2(c.x, c.z).normalize();

      let move = BABYLON.Vector2.Zero();
      if(this.pressed.has("KeyA")){ move.x -= 1; }
      if(this.pressed.has("KeyD")){ move.x += 1; }
      if(this.pressed.has("KeyW")){ move.y += 1; }
      if(this.pressed.has("KeyS")){ move.y -= 1; }
      move.normalize().scaleInPlace(elapsed_sec * 5);


      let player = this.getMeshByName("player");
      if(player){
        player.moveWithCollisions(new BABYLON.Vector3(
          move.y * norm_c.x + move.x * norm_c.y,
          this.gravity.y * elapsed_sec,
          move.y * norm_c.y - move.x * norm_c.x
        ))
        
        if(this.player){
          if(move.length()){
            this.player.beginWalk();
          } else{
            this.player.beginIdle();
          }
        }
        if(move.length()){

          let target_angle = Math.atan2(norm_c.x, norm_c.y); // orientation problem
          let delta = target_angle - player.rotation.y;

          if(delta < - Math.PI){
            delta += Math.PI * 2;
          } else if(delta > Math.PI){
            delta = Math.PI * 2 - delta;
          }

          if(Math.abs(delta) > 0.5){
            player.rotation.y = (player.rotation.y + Math.PI * 2 +
                delta * elapsed_sec * 25) % (Math.PI * 2);
          } else{
            player.rotation.y = target_angle;
          }

          /*
          player.lookAt(player.position.add(
              c.multiplyByFloats(1.0, 0.0, 1.0)));
          */
        }

        let camera = this.activeCamera;


        let cameraOffsetX = 0.3;
        let cameraOffsetZ = -2;
        camera.position = player.position.add(new BABYLON.Vector3(
            cameraOffsetZ * norm_c.x + cameraOffsetX * norm_c.y,
            1.8,
            cameraOffsetZ * norm_c.y - cameraOffsetX * norm_c.x
        ));
      }
    });

    return this;
  }
}