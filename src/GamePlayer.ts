import GameInput, { processMovementVector } from "./GameInput";
import Human from "./entities/Human";
import Humanoid from "./entities/Humanoid";


export class Player
{

  public scene: BABYLON.Scene;
  public canvas: HTMLCanvasElement;
  public gameInput: GameInput<BABYLON.Camera>;
  public target: any;

  public usingFirstPersonCamera: boolean = null;

  private arcCamera: BABYLON.ArcRotateCamera;
  private universalCamera: BABYLON.UniversalCamera;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement){
    this.scene = scene;
    this.canvas = canvas;

    this.universalCamera = new BABYLON.UniversalCamera(
      "PlayerUniversalCamera", new BABYLON.Vector3(0, 0, 0), scene
    );

    this.arcCamera = new BABYLON.ArcRotateCamera("PlayerArcCamera",
      0, 0, 10, BABYLON.Vector3.Zero(), scene
    );
    this.arcCamera.zoomOnFactor = 0.01;
    this.arcCamera.lowerRadiusLimit = 0.01;
    this.arcCamera.wheelPrecision = 50;
  }

  setTarget(mesh: any){
    this.target = mesh;
    if(mesh instanceof BABYLON.Mesh){
      this.universalCamera.position = mesh.position;
    }
    return this;
  }

  useFirstPersonCamera(){
    if(this.usingFirstPersonCamera) return;
    this.arcCamera.detachControl(this.canvas);
    this.arcCamera.inputs.removeByType("GameInput");

    this.scene.activeCamera = this.universalCamera;
    this.universalCamera.attachControl(this.canvas, true);
    this.universalCamera.inputs.add(
        this.getGameInput() as GameInput<BABYLON.FreeCamera>);

    this.universalCamera.setTarget(
        this.arcCamera.getForwardRay().direction.add(
        this.universalCamera.position));

    this.usingFirstPersonCamera = true;
  }

  useThirdPersonCamera(){
    if(this.usingFirstPersonCamera === false) return;
    this.universalCamera.detachControl(this.canvas);
    this.universalCamera.inputs.removeByType("GameInput");

    this.scene.activeCamera = this.arcCamera;
    this.arcCamera.attachControl(this.canvas, true);
    this.arcCamera.inputs?.add(
        this.getGameInput() as GameInput<BABYLON.ArcRotateCamera>);

    // arcCamera.position = camera.cameraDirection.scale(-arcCamera.radius);
    // arcCamera.target = camera.position;

    this.usingFirstPersonCamera = false;
  }

  private getGameInput(){
    return new GameInput<BABYLON.Camera>(
      this.canvas
    ).add("key", obj => {

      let vec = processMovementVector(obj);
      
      if(vec.x || vec.z){
        if(this.target instanceof Human
        || this.target instanceof Humanoid){

          this.target.beginWalk();
        }
      } else if(this.target instanceof Human){
        this.target.beginIdle();
      }
  
      let mesh = this.target?.meshes && this.target?.meshes[0];
      if(mesh){
  
        /*
        mesh.applyImpulse();
  
        mesh.position = mesh.position.add(
            new BABYLON.Vector3(vec.x, 0, vec.z));
        */
        mesh.moveWithCollisions(
          vec.multiplyByFloats(1.0, 0, 1.0)
        );
  
        if(this.usingFirstPersonCamera){
          this.universalCamera.position = mesh.position;
        } else{
          this.arcCamera.target = mesh.position;
        }
      }
    }).add("dir", ({ camera }) => {
      if(!camera) camera = this.scene.activeCamera;
      let d = camera.getForwardRay().direction;
      let mesh = this.target?.meshes && this.target?.meshes[0];
      if(mesh instanceof BABYLON.Mesh){
        mesh.lookAt(mesh.position.add(
            new BABYLON.Vector3(d.x, 0, d.z)));
      }
    });
  }
}