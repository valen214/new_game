

// https://www.babylonjs-playground.com/#1WFOOA#67
// https://doc.babylonjs.com/how_to/customizing_camera_inputs#implementing-your-own-input

class GameControl
{
  _scene: BABYLON.Scene;
  inputMap = {};

  constructor(scene: BABYLON.Scene){
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
      e => {
        this.inputMap[e.sourceEvent.key] = (
            e.sourceEvent.type == "keydown");
      }
    ));
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnKeyUpTrigger,
      e => {
        this.inputMap[e.sourceEvent.key] = (
            e.sourceEvent.type == "keydown");
      }
    ));

    scene.onBeforeRenderObservable.add(() => {
      this.handleInput();
    });


    this._scene = scene;
  }

  x_movement = 0;
  z_movement = 0;
  handleInput(){
    let normalized_movement = (
      performance.now() - this.lastProcessed
    ) * 0.05;
    
    let x = 0;
    let z = 0;

    if(this.inputMap['w']){
      z += 1;
    }
    if(this.inputMap['s']){
      z -= 1;
    }
    if(this.inputMap['a']){
      x -= 1;
    }
    if(this.inputMap['d']){
      x += 1;
    }

    let dir = BABYLON.Vector2.FromArray(
        new Float32Array([
          x, z
        ])).normalize();

    this.x_movement += dir.x * normalized_movement;
    this.z_movement += dir.y * normalized_movement;

    this.lastProcessed = performance.now();
  }

  lastProcessed = performance.now();
  processMovement(camera: BABYLON.Camera){
    let dir = camera.getDirection(BABYLON.Vector3.Forward());
    let normalized_dir = BABYLON.Vector2.FromArray(
        new Float32Array([
          dir.x, dir.z
        ])).normalize();

    camera.position.addInPlaceFromFloats(
      this.z_movement * normalized_dir.x + this.x_movement * normalized_dir.y,
      0,
      this.z_movement * normalized_dir.y - this.x_movement * normalized_dir.x
    );
    

    this.x_movement = 0;
    this.z_movement = 0;
  }
}
export default GameControl;