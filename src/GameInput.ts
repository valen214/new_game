

/*
Object.fromEntries:
https://github.com/microsoft/TypeScript/issues/30933
*/

import { KEY_CODE, toKeyCode } from "./KeyCode";

export enum KEY_ACTION {
  LEFT,
  RIGHT,
  FORWARD,
  BACK,
  DOWN,
  UP
}


export enum EVENT_TYPE {
  KEY = "key", MOUSE = "mouse",
};
/**
 * one-type-to-do-it-all to avoid tons of
 * type definition based on corresponding event
 */
export type EVENT_LISTENER_ARGUMENT_TYPE = Partial<{
  _this: GameInput
  frameTime: number
  camera: BABYLON.Camera
  scene: BABYLON.Scene
  activeKeyAction: Set<KEY_ACTION>
}>;

class GameInput
{
  private listeners = new Map<EVENT_TYPE,
      ((arg0?: EVENT_LISTENER_ARGUMENT_TYPE) => void )[]>();

  private pressed: Set<KEY_CODE> = new Set();
  public keyMap = new Map([
    [KEY_ACTION.LEFT, new Set([ KEY_CODE.A ])],
    [KEY_ACTION.RIGHT, new Set([ KEY_CODE.D ])],
    [KEY_ACTION.FORWARD, new Set([ KEY_CODE.W ])],
    [KEY_ACTION.BACK, new Set([ KEY_CODE.S ])],
    [KEY_ACTION.DOWN, new Set([ KEY_CODE.LCTRL ])],
    [KEY_ACTION.UP, new Set([ KEY_CODE.SPACE ])],
  ])

  private attached = false;
  private detached = false;
  private noPreventDefault: boolean;
  public scene;
  public canvas: HTMLCanvasElement;

  public sensitivity = 5.0;
  constructor(){}

  registerActionManager(scene: BABYLON.Scene){
    this.attached = true;
    this.scene = scene;
    const canvas = scene.getEngine().getRenderingCanvas();

    let actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager = actionManager;

    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        e => this.onKeyDown(e.sourceEvent)
      )
    );

    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        e => this.onKeyUp(e.sourceEvent)
      )
    );

    scene.onBeforeRenderObservable.add((
      eventData: BABYLON.Scene,
      eventState: BABYLON.EventState
    ) => {
      this.checkInputs();
    });

    
    BABYLON.Tools.RegisterTopRootEvents(
      canvas as any, [
      { name: "blur", handler: this.onBlur }
    ]);

    return this;
  }
  private onKeyDown = (e: KeyboardEvent) => {
    let k = toKeyCode(e);
    if(k) this.pressed.add(k);
    if(this.attached && !this.noPreventDefault){
      e.preventDefault();
    }
  };
  private onKeyUp = (e: KeyboardEvent) => {
    let k = toKeyCode(e);
    this.pressed.delete(k);
    if(this.attached && !this.noPreventDefault){
      e.preventDefault();
    }
  };
  private onBlur = () => {
    this.pressed.clear();
  };

  addEventListeners(element: HTMLElement){
    this.attached = true;

    element.addEventListener("keydown", this.onKeyDown);
    element.addEventListener("keyup", this.onKeyUp);
    
    BABYLON.Tools.RegisterTopRootEvents(
      element as any, [
      { name: "blur", handler: this.onBlur }
    ]);

    this.listeners.clear();
    this.pressed.clear();
  }

  removeEventListeners(element: HTMLElement){
    this.attached = false;

    element.removeEventListener("keydown", this.onKeyDown);
    element.removeEventListener("keyup", this.onKeyUp);

    BABYLON.Tools.UnregisterTopRootEvents(
      element as any, [
      { name: "blur", handler: this.onBlur }
    ]);

    this.listeners.clear();
    this.pressed.clear();
  }

  add(
      type: string | EVENT_TYPE,
      listener: (arg0: EVENT_LISTENER_ARGUMENT_TYPE) => void
  ): GameInput {
    let _type: EVENT_TYPE;
    switch(type){
    case "dir":
    case "mouse":
      _type = EVENT_TYPE.MOUSE;
      break;
    case "key":
      _type = EVENT_TYPE.KEY;
      break;
    default:
      if(type in EVENT_TYPE){
        _type = type as EVENT_TYPE;
      }
      throw new Error(`unknown input event type ${type}`);
    }
    let list = this.listeners.get(_type);
    if(list){
      list.push(listener);
    } else{
      this.listeners.set(_type, [ listener ]);
    }
    return this;
  }

  private lastCheck = performance.now();
  checkInputs(){
    if(!this.attached) return;
    const camera = this.scene?.activeCamera;

    let frameTime = performance.now() - this.lastCheck;
    this.lastCheck = performance.now();

    
    let listeners = this.listeners.get(EVENT_TYPE.MOUSE);
    if(listeners?.length){
      for(let i = 0; i < listeners.length; ++i){
        listeners[i]({ camera });
      }
    }

    listeners = this.listeners.get(EVENT_TYPE.KEY);
    if(listeners?.length){

      let activeKeyAction = new Set<KEY_ACTION>();
      for(let [ key_action, key_code_set ] of this.keyMap.entries()){
        if([...key_code_set].some(k => this.pressed.has(k))){
          activeKeyAction.add(key_action);
        }
      }


      for(let i = 0; i < listeners.length; ++i){
        listeners[i]({
            frameTime,
            activeKeyAction,
            _this: this,
        });
      }
    }

  }
}
export default GameInput;


export function processMovementVector({
  activeKeyAction, frameTime, camera, _this
}: EVENT_LISTENER_ARGUMENT_TYPE){
  if(!camera){
    console.error("cannot process movement vector without camera");
    return;
  }
  let dir = camera.getForwardRay().direction;
  let normal_dir = new BABYLON.Vector2(dir.x, dir.z).normalize();
  
    
  let time_scalar = frameTime * 0.001;

  let z_movement = 0;
  let y_movement = 0;
  let x_movement = 0;

  if(activeKeyAction.has(KEY_ACTION.LEFT)){
    x_movement -= 1;
  }
  if(activeKeyAction.has(KEY_ACTION.RIGHT)){
    x_movement += 1;
  }
  if(activeKeyAction.has(KEY_ACTION.FORWARD)){
    z_movement += 1;
  }
  if(activeKeyAction.has(KEY_ACTION.BACK)){
    z_movement -= 1;
  }
  let normal_move = new BABYLON.Vector2(x_movement, z_movement
  ).normalize().scale(
    time_scalar * _this.sensitivity
  );

  
  if(activeKeyAction.has(KEY_ACTION.UP)){
    y_movement += 1;
  }
  if(activeKeyAction.has(KEY_ACTION.DOWN)){
    y_movement -= 1;
  }


  return new BABYLON.Vector3(
    normal_move.y * normal_dir.x + normal_move.x * normal_dir.y,
    y_movement * time_scalar,
    normal_move.y * normal_dir.y - normal_move.x * normal_dir.x
  );
}
