import type { IScene } from "./IScene";
import Common from "../entities/Common";
import Human from "../entities/Human";
import Humanoid from "../entities/Humanoid";
import GLOABL from "../Global";
import { ThirdPersonCamera } from "../cameras/ThirdPersonCamera";
import GameInput, { processMovementVector } from "../GameInput";
import type Game from "../Game";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

  // Shift+Ctrl+Alt+I
  if (e.shiftKey && e.ctrlKey &&
      e.altKey && e.keyCode === 73) {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show();
    }
  }
*/


export class SimpleFightScene
extends BABYLON.Scene
implements IScene
{
  public canvas: HTMLCanvasElement;
  public gameInput: GameInput = new GameInput();
  public thirdPersonCamera: ThirdPersonCamera;
  constructor(
      engine: BABYLON.Engine,
      options?: BABYLON.SceneOptions,
  ){
    super(engine, options);

    console.log("post super");

    this.canvas = this.getEngine().getRenderingCanvas();

    
    this.thirdPersonCamera = new ThirdPersonCamera(
      "3rd person camera", 0, 1.1123, 5, null, this);
    this.thirdPersonCamera.attach().setOffset(0.5, 1.5, -0.2);
  }

  addEventListeners(){
    console.log("SimpleFightScene attach control", this);
    this.gameInput.addEventListeners(this.canvas);
  }

  removeEventListeners(){
    this.gameInput.removeEventListeners(this.canvas);
  }

  render(){
    this.gameInput.checkInputs();
    
    const camera = this.thirdPersonCamera;  
    let d = camera.getForwardRay().direction;
    let cameraOffsetX = 0.3;
    let cameraOffsetZ = 0.0;
    d = d.multiplyByFloats(1.0, 0, 1.0).normalize();
    if(camera instanceof ThirdPersonCamera){
      camera.setOffset(
        cameraOffsetZ * d.x + cameraOffsetX * d.z,
        1.8,
        cameraOffsetZ * d.z - cameraOffsetX * d.x
      );
    }

    BABYLON.Scene.prototype.render.call(this);
  }

  setUpCamera(
    human: Human
  ){
    const mesh = human.meshes[0];
    const parent = mesh.parent as BABYLON.Mesh;
    const camera = this.thirdPersonCamera;
    this.thirdPersonCamera.offset.parent = parent;
    parent.showBoundingBox = true;
    mesh.showBoundingBox = true;

    let indicator =  Common.createSphere(this, {
      name: "human root indicator",
      diameter: 0.5,
    });
    indicator.parent = parent;

    this.gameInput.add("key", obj => {
      if(!obj.camera) obj.camera = camera;
      let vec = processMovementVector(obj);
      
      if(vec.x || vec.z){
        vec = vec.multiplyByFloats(100.0, 0, 100.0);
        // parent.physicsImpostor.setLinearVelocity(vec);

        parent.physicsImpostor.setLinearVelocity(vec);
        let vel = parent.physicsImpostor.getLinearVelocity();
        if(vel.length() < 3){
          human.beginWalk();
          // vel = vel.multiplyByFloats(-1.0, 0, -1.0);
          // parent.applyImpulse(vec, BABYLON.Vector3.Zero());
        } else if(vel.length() < 6){
          human.beginRun();
          // parent.applyImpulse(vec, BABYLON.Vector3.Zero());
        }
      } else{
        let vel = parent.physicsImpostor.getLinearVelocity();
        human.beginIdle();
        parent.applyImpulse(
          vel.multiplyByFloats(-1.0, 0, -1.0),
          BABYLON.Vector3.Zero()
        );
      }
      

      //parent.position.addInPlace(vec);
      // this.thirdPersonCamera.offset.position.addInPlace(vec);
      // parent.physicsImpostor.setLinearVelocity(vec);
    })
    
    this.onBeforeRenderObservable.add(() => {
      let d = camera.getForwardRay().direction;
      let mesh = human.meshes[0];
      mesh.lookAt(new BABYLON.Vector3(d.x, 0, d.z));
    })
  }

  async init(): Promise<SimpleFightScene>{
    this.activeCamera = this.thirdPersonCamera;

    this.collisionsEnabled = true;
    this.enablePhysics(
        new BABYLON.Vector3(0, -9.81, 0),
        new BABYLON.AmmoJSPlugin());


    Common.createBox(this, {
      name: "box1",
      physics: {
        mass: 1.0,
      }
    });

    
    Humanoid.createHumanoid(this)

    
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




    var ground = BABYLON.MeshBuilder.CreateBox("ground", {
      height: 5, width: 100, depth: 100
    }, this);
    ground.position.set(0, -10, 0);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, this
    );

    Human.createHuman(this).then(human => {
      human.addShadow(shadowGenerator);
      GLOABL.set("human", human);

      let parent = human.meshes[0].parent as BABYLON.AbstractMesh
      parent.physicsImpostor = new BABYLON.PhysicsImpostor(
        parent, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 10, friction: 0, restitution: 0.0,
        }, this
      );
      parent.position.set(3, 3, 3);

      let mesh = human.meshes[0];
      mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 10, friction: 0, restitution: 0.0,
        }, this
      );

      this.setUpCamera(human);
    });
    

    
    let sphere = Common.createSphere(this, {
      name: "sphere",
      diameter: 2,
      physics: {
        type: BABYLON.PhysicsImpostor.CylinderImpostor,
        mass: 10.0,
        friction: 1.0,
        restitution: 0,
      }
    })
    // sphere.setParent(root);
    sphere.checkCollisions = true;

    return this;
  }
}