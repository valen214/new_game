

/**
 * https://keycode.info/
 */

export class KEY_CODE
{
  static TO_KEYCODE = new Map<string | number, KEY_CODE>();

  constructor(...associates: (string | number)[]){
    associates.forEach(e => {
      KEY_CODE.TO_KEYCODE.set(e, this);
    });
  }

  static A = new KEY_CODE(65, "KeyA");
  static S = new KEY_CODE("KeyS", 83, "s");
  static D = new KEY_CODE("KeyD");
  static W = new KEY_CODE("KeyW");
  static LSHIFT = new KEY_CODE("ShiftLeft", 16, "Shift")
  static RSHIFT = new KEY_CODE("ShiftRight", 16, "Shift")
  static LCTRL = new KEY_CODE(17, "ControlLeft", "Control")
  static SPACE = new KEY_CODE("Space", 32, " ")
};

function toKeyCode(e: KeyboardEvent): KEY_CODE {
  return (
      KEY_CODE.TO_KEYCODE.get(e.code) ||
      KEY_CODE.TO_KEYCODE.get(e.keyCode) ||
      KEY_CODE.TO_KEYCODE.get(e.key) ||
      KEY_CODE.TO_KEYCODE.get(e.which)
  );
}

/*
Object.fromEntries:
https://github.com/microsoft/TypeScript/issues/30933
*/

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
  _this: GameInput<BABYLON.Camera>
  frameTime: number
  camera: BABYLON.Camera
  scene: BABYLON.Scene
  activeKeyAction: Set<KEY_ACTION>
}>;

/*
drop ICameraInput later
*/
class GameInput <T extends BABYLON.Camera>
implements BABYLON.ICameraInput<T>
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

  public sensitivity = 5.0;
  public camera: T;
  constructor(
    public canvas: HTMLCanvasElement,
    public processMovement?: (vec: BABYLON.Vector3) => void
  ){}

  registerActionManager(scene: BABYLON.Scene){
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
    })
  }

  getClassName(): string {
    return "GameInput";
  }

  getTypeName(){
    return "GameInput";
  }

  getSimpleName(){
    return "GameInput";
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

  attachControl(
      element: HTMLElement,
      noPreventDefault: boolean
  ){
    console.assert(element === this.canvas,
        "GameInput.ts:",
        "attachControl():",
        "attached canvas is different from given canvas",
        "\n\telem:", element,
        "\n\tthis.canvas:", this.canvas);

    if(!this.attached){
      this.attached = true;
      this.noPreventDefault = noPreventDefault;

      element.tabIndex = 1;
      element.addEventListener("keydown", this.onKeyDown, false);
      element.addEventListener("keyup", this.onKeyUp, false);
    
      this.checkInputs();

      BABYLON.Tools.RegisterTopRootEvents(
        this.canvas as any, [
        { name: "blur", handler: this.onBlur }
      ]);
    }
  };

  detachControl(element: HTMLElement){
    if(this.attached){
      element.removeEventListener("keydown", this.onKeyDown);
      element.removeEventListener("keyup", this.onKeyUp);

      BABYLON.Tools.UnregisterTopRootEvents(
        this.canvas as any, [
        { name: "blur", handler: this.onBlur }
      ]);

      this.listeners.clear();
      this.pressed.clear();
      this.attached = false;
    }
  }

  add(
      type: string | EVENT_TYPE,
      listener: (arg0: EVENT_LISTENER_ARGUMENT_TYPE) => void
  ): GameInput<T> {
    let _type: EVENT_TYPE;
    switch(type){
    case "dir":
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

    const camera = this.camera;
    
    let listeners = this.listeners.get(EVENT_TYPE.MOUSE);
    if(listeners?.length){
      for(let i = 0; i < listeners.length; ++i){
        listeners[i]({ camera });
      }
    }

    listeners = this.listeners.get(EVENT_TYPE.KEY);
    if(listeners?.length){
      let frameTime = performance.now() - this.lastCheck;

      let activeKeyAction = new Set<KEY_ACTION>();
      for(let [ key_action, key_code_set ] of this.keyMap.entries()){
        if([...key_code_set].some(k => this.pressed.has(k))){
          activeKeyAction.add(key_action);
        }
      }


      for(let i = 0; i < listeners.length; ++i){
        listeners[i]({
            camera,
            frameTime,
            activeKeyAction,
            _this: this,
        });
      }
    }

    this.lastCheck = performance.now();
  }
}
export default GameInput;


export function processMovementVector({
  activeKeyAction, frameTime, camera, _this
}: EVENT_LISTENER_ARGUMENT_TYPE){
  let dir = camera.getForwardRay().direction;
  let normal_dir = new BABYLON.Vector2(
      dir.x, dir.z).normalize();
  
    
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

  /*
  camera.position.addInPlaceFromFloats(
    normal_move.y * normal_dir.x + normal_move.x * normal_dir.y,
    y_movement * time_sens_scalar,
    normal_move.y * normal_dir.y - normal_move.x * normal_dir.x
  );

  */
  
  return new BABYLON.Vector3(
    normal_move.y * normal_dir.x + normal_move.x * normal_dir.y,
    y_movement * time_scalar,
    normal_move.y * normal_dir.y - normal_move.x * normal_dir.x
  );
}
