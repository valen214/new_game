

import type { IEntity } from "./IEntity";


export class Player
{
  playerEntity: IEntity;
  scene?: BABYLON.Scene;
  private pressed = new Set<string>();
  
  constructor(playerEntity: IEntity){
    this.playerEntity = playerEntity;
  }

  
  attach(scene: BABYLON.Scene){
    this.scene = scene;
    
    scene.onKeyboardObservable.add(({ type, event }) => {
      console.assert(type === BABYLON.KeyboardEventTypes.KEYDOWN);
      this.pressed.add(event.code);
    }, BABYLON.KeyboardEventTypes.KEYDOWN);
    
    scene.onKeyboardObservable.add(({ type, event }) => {
      console.assert(type === BABYLON.KeyboardEventTypes.KEYUP);
      this.pressed.delete(event.code);
    }, BABYLON.KeyboardEventTypes.KEYUP);
    
    
    let last_frame_time = performance.now();
    scene.onBeforeRenderObservable.add(() => {
      let elapsed = performance.now() - last_frame_time;
      let elapsed_sec = elapsed * 0.001;
      last_frame_time = performance.now();
      
      let c = scene.activeCamera.getForwardRay().direction;
      let norm_c = new BABYLON.Vector2(c.x, c.z).normalize();
      
      let move = BABYLON.Vector2.Zero();
      if(this.pressed.has("KeyA")){ move.x -= 1; }
      if(this.pressed.has("KeyD")){ move.x += 1; }
      if(this.pressed.has("KeyW")){ move.y += 1; }
      if(this.pressed.has("KeyS")){ move.y -= 1; }
      move.normalize().scaleInPlace(elapsed_sec * 5);
      

      let player = this.playerEntity;
      player.move(new BABYLON.Vector3(
        move.y * norm_c.x + move.x * norm_c.y,
        scene.gravity.y * elapsed_sec,
        move.y * norm_c.y - move.x * norm_c.x
      ))
      
      if(move.length()){
        player.begin("walk");
      } else{
        player.begin("idle");
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
      
      let camera = scene.activeCamera;


      let cameraOffsetX = 0.3;
      let cameraOffsetZ = -2;
      camera.position = player.position.add(new BABYLON.Vector3(
          cameraOffsetZ * norm_c.x + cameraOffsetX * norm_c.y,
          1.8,
          cameraOffsetZ * norm_c.y - cameraOffsetX * norm_c.x
      ));
    });
  }

  detach(){
    this.scene.onBeforeRenderObservable.clear();
    this.scene.onKeyboardObservable.clear();
    this.scene.onPointerObservable.clear();
    this.pressed.clear();
  }
}

export default Player;