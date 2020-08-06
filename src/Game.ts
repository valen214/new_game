
// import GameControl from "./GameControl";
import GameUI from "./GameUI";
import GameRenderLoop from "./GameRenderLoop";
import GameScene, { createScene } from "./GameScene";
import GameInput, { processMovementVector } from "./GameInput";
import { setGame } from "./Global";

export var engine: BABYLON.Engine;
export var scene: BABYLON.Scene;
export var canvas: HTMLCanvasElement;
export var gameScene: GameScene;

class Game
{
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement;
  gameScene: GameScene;

  constructor(){

  }
}
export default Game;

export function getFps(){
  return engine?.getFps().toFixed(2);
}

export async function startGame(_canvas: HTMLCanvasElement){
  canvas = _canvas;
  
  engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true, stencil: true
  });
  engine.enableOfflineSupport = false;
  
  BABYLON.Animation.AllowMatricesInterpolation = true;
  
  gameScene = GameScene.createScene(engine);
  scene = gameScene.scene;

  
  let camera = new BABYLON.UniversalCamera(
    "Camera", new BABYLON.Vector3(0, 0, 0), scene
  );
  let arcCamera = new BABYLON.ArcRotateCamera("ArcCamera",
    0, 0, 10, BABYLON.Vector3.Zero(), scene
  );
  arcCamera.zoomOnFactor = 0.01;
  arcCamera.lowerRadiusLimit = 0.01;
  arcCamera.wheelPrecision = 50;

  let getGameInput = () => new GameInput<BABYLON.Camera>(
    canvas
  ).add("key", obj => {

    let vec = processMovementVector(obj);
    
    if(vec.x || vec.z){
      gameScene.mainCharacter?.beginWalk();
    } else{
      gameScene.mainCharacter?.beginIdle();
    }

    let mesh = gameScene.mainCharacter?.meshes[0];
    if(mesh){

      /*
      mesh.applyImpulse();

      mesh.position = mesh.position.add(
          new BABYLON.Vector3(vec.x, 0, vec.z));
      */
      mesh.moveWithCollisions(
        vec.multiplyByFloats(1.0, 0, 1.0)
      );

      if(usingFreeCamera){
        camera.position = mesh.position;
      } else{
        arcCamera.target = mesh.position;
      }
    }
  }).add("dir", ({ camera }) => {
    if(!camera) camera = scene.activeCamera;
    let d = camera.getForwardRay().direction;
    let a = gameScene.mainCharacter?.meshes[0];
    if(a as BABYLON.Mesh){
      a.lookAt(a.position.add(
          new BABYLON.Vector3(d.x, 0, d.z)));
    }
  });


  let usingFreeCamera: boolean = false;
  let useFreeCamera = () => {
    if(usingFreeCamera) return;
    arcCamera.detachControl(canvas);
    arcCamera.inputs.removeByType("GameInput");

    scene.activeCamera = camera;
    camera.attachControl(canvas, true);
    camera.inputs.add(getGameInput() as GameInput<BABYLON.FreeCamera>);

    camera.setTarget(arcCamera.getForwardRay().direction.add(camera.position));

    usingFreeCamera = true;
  };
  let useArcCamera = (force?: boolean) => {
    if(!usingFreeCamera && !force) return;
    camera.detachControl(canvas);
    camera.inputs.removeByType("GameInput");

    scene.activeCamera = arcCamera;
    arcCamera.attachControl(canvas, true);
    arcCamera.inputs?.add(getGameInput() as GameInput<BABYLON.ArcRotateCamera>);

    // arcCamera.position = camera.cameraDirection.scale(-arcCamera.radius);
    // arcCamera.target = camera.position;

    usingFreeCamera = false;
  }

  useArcCamera(true);

  let escape = false;
  canvas.addEventListener("keydown", e => {
    if(e.code === "KeyF"){
      if(usingFreeCamera){

      } else{
        // arcCamera.position.addInPlaceFromFloats(0, 1, 0);
        // arcCamera.setPosition(new BABYLON.Vector3(0, 0, -10));
        console.log(arcCamera.getTarget());
      }
    }
    if(!escape && e.code === "Escape"){
      escape = true;

      if(usingFreeCamera){
        useArcCamera();
      } else{
        useFreeCamera();
      }
    }
  });
  canvas.addEventListener("keyup", e => {
    if(e.code === "Escape"){
      escape = false;
    }
  });

  GameUI.createUI();

  engine.runRenderLoop(function(){
    GameRenderLoop(engine, scene, camera);
  });


  let game = new Game();
  game.engine = engine;
  game.scene = scene;
  game.gameScene = gameScene;
  game.canvas = canvas;
  setGame(game);
}

window.addEventListener("resize", function(e: UIEvent){
  let rect = document.getElementsByTagName("body")[0].getBoundingClientRect();
  if(canvas){
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  engine?.resize();
});



export function keyDown(e){
  // Shift+Ctrl+Alt+I
  if (e.shiftKey && e.ctrlKey &&
      e.altKey && e.keyCode === 73) {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show();
    }
  }
}