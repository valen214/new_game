import type { ISceneLoader } from "./ISceneLoader";
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
implements ISceneLoader
{
  constructor(
      engine: BABYLON.Engine,
      options?: BABYLON.SceneOptions
  ){
    super(engine, options);
    
    this.getEngine();
    BABYLON.SceneLoader
  }

  async init(): Promise<TestScene> {
    const canvas = this.getEngine().getRenderingCanvas();

    this.gravity = new BABYLON.Vector3(0, -9.81, 0);
    this.collisionsEnabled = true;
    this.enablePhysics(this.gravity,
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


    Human.createHuman(this).then(human => {
      human.addShadow(shadowGenerator);
      console.log("HUMAN:", human);
      GLOABL.set("human", human);

      
    });
    
        
    var helper = this.createDefaultEnvironment({
        enableGroundShadow: true
    });
    helper.setMainColor(BABYLON.Color3.Gray());
    helper.ground.position.y += 0.01;

    
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
    // sphere.checkCollisions = true;

    
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {
      height: 20, width: 20
    }, this);
    ground.position.set(0, -5, 0);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0, friction: 0.5, restitution: 0.7,
      }, this
    );

    return this;
  }
}