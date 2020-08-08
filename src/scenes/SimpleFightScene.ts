import type { ISceneLoader } from "./ISceneLoader";
import Common from "../entities/Common";
import Human from "../entities/Human";
import Humanoid from "../entities/Humanoid";
import GLOABL from "../Global";
import { Player } from "../GamePlayer";

/*
https://stackblitz.com/edit/typescript-18twnn-immature-import?file=rollup.config.js
jsdelivr

*/


export class SimpleFightScene
extends BABYLON.Scene
implements ISceneLoader
{
  public player?: Player;

  constructor(
      engine: BABYLON.Engine,
      options?: BABYLON.SceneOptions
  ){
    super(engine, options);
    this.load();
  }

  load(){
    const canvas = this.getEngine().getRenderingCanvas();

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


    let root = BABYLON.MeshBuilder.CreateBox("ground_root",
      { width: 22, height: 10, depth: 22 }, this);
    root.position.set(0, -15, 0);
    root.physicsImpostor = new BABYLON.PhysicsImpostor(
      root, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, this
    );


    var ground = BABYLON.MeshBuilder.CreateGround("ground", {
      height: 20, width: 20
    }, this);
    ground.position.set(0, -10, 0);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
      }, this
    );


    const player = new Player(this, canvas);
    this.player = player;

    Human.createHuman(this).then(human => {
      human.addShadow(shadowGenerator);
      GLOABL.set("human", human);

      
      player.setTarget(human).useThirdPersonCamera();

      let parent = human.meshes[0].parent as BABYLON.AbstractMesh
      let self = human.meshes[0];
      parent.physicsImpostor = new BABYLON.PhysicsImpostor(
        parent, BABYLON.PhysicsImpostor.SphereImpostor, {
          mass: 1, friction: 0, restitution: 0.0,
        }, this
      );

    }).then(() => {
      let escape = false;
      canvas.addEventListener("keydown", e => {
        if(e.code === "KeyF"){
          if(player.usingFirstPersonCamera){

          } else{
            // arcCamera.position.addInPlaceFromFloats(0, 1, 0);
            // arcCamera.setPosition(new BABYLON.Vector3(0, 0, -10));
          }
        }
        if(!escape && e.code === "Escape"){
          escape = true;

          if(player.usingFirstPersonCamera){
            player.useThirdPersonCamera();
          } else{
            player.useFirstPersonCamera();
          }
        }
      });
      canvas.addEventListener("keyup", e => {
        if(e.code === "Escape"){
          escape = false;
        }
      });
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
    sphere.setParent(root);
    sphere.checkCollisions = true;
  }
}