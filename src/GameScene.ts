import Human from "./entities/Human";
import Humanoid from "./entities/Humanoid";
import { GLOABL } from "./Global";
import { Player } from "./GamePlayer";

class GameScene
{
  public scene: BABYLON.Scene;
  public player?: Player;


  public static createScene(
      engine: BABYLON.Engine,
      canvas: HTMLCanvasElement
  ){
    let scene = new GameScene();
    scene.scene = createScene(engine);

    var light2 = new BABYLON.DirectionalLight("dir01",
        new BABYLON.Vector3(0, -0.5, -1.0), scene.scene);
    light2.position = new BABYLON.Vector3(0, 5, 5);
  
    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
  

    let player = new Player(scene.scene, canvas);
    scene.player = player;

    Human.createHuman(scene.scene).then(human => {
      human.addShadow(shadowGenerator);
      console.log("HUMAN:", human);
      GLOABL.set("human", human);

      
      player.setTarget(human).useThirdPersonCamera();
    });

    

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

    return scene;
  };
}
export default GameScene;


export function createBox(scene: BABYLON.Scene, {
  name,
  height = 1,
  width = 1,
  pos = [0, 0, 0],
  mass = 1,
}: {
  name: string
  height?: number
  width?: number
  pos?: number[]
  mass?: number
}){

  var box = BABYLON.MeshBuilder.CreateBox(name, {
    height, width
  }, scene);
  box.position.set(pos[0], pos[1], pos[2]);
  box.physicsImpostor = new BABYLON.PhysicsImpostor(
    box, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass, friction: 0.5, restitution: 0.7,
    }, scene
  );

  return box;

}


export function createScene(engine: BABYLON.Engine){
  let scene: BABYLON.Scene = new BABYLON.Scene(engine);
  scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
  scene.collisionsEnabled = true;

  let physicsPlugin = new BABYLON.AmmoJSPlugin();
  scene.enablePhysics(scene.gravity, physicsPlugin);

  createBox(scene, {
    name: "box1"
  });


  Humanoid.createHumanoid(scene);
  
  let light = new BABYLON.HemisphericLight("light1",
      new BABYLON.Vector3(1, 1, 0), scene);
      

  var helper = scene.createDefaultEnvironment({
      enableGroundShadow: true
  });
  helper.setMainColor(BABYLON.Color3.Gray());
  helper.ground.position.y += 0.01;

  
  let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    diameter: 2
  }, scene);
  // sphere.checkCollisions = true;
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
    sphere, BABYLON.PhysicsImpostor.CylinderImpostor, {
      mass: 10.0, friction: 1.0, restitution: 0
    }, scene
  );

  var ground = BABYLON.MeshBuilder.CreateGround("ground", {
    height: 20, width: 20
  }, scene);
  ground.position.set(0, -5, 0);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 0, friction: 0.5, restitution: 0.7,
    }, scene
  );
  


  return scene;
}