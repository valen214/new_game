
/**
 * https://keycode.info/
 */

export class KEY_CODE
{
  /**
   * TODO: handle duplicate problem
   */
  static TO_KEYCODE = new Map<string | number, KEY_CODE>();


  protected constructor(
    public code?: string,
    public keyCode?: number,
    public key?: string,
    public which?: number, // deprecated
  ){
    [code, keyCode, key, which].filter(k => !!k).forEach(e => {
      KEY_CODE.TO_KEYCODE.set(e, this);
    });
  }

  static getUnknownKeyCode(e: KeyboardEvent){
    let list = [e.code, e.keyCode, e.key, e.which];
    for(let k of list){
      if(KEY_CODE.TO_KEYCODE.has(k)){
        console.warn(`KeyCode.ts: getUnknownKeyCode():`,
            `KeyCode(${k}) is found,`, "please use toKeyCode()");
        return KEY_CODE.TO_KEYCODE.get(k);
      }
    }

    let kc = new KEY_CODE(e.code, e.keyCode, e.key, e.which);
    return kc;
  }

  static A = new KEY_CODE("KeyA", 63);
  static S = new KEY_CODE("KeyS", 83, "s");
  static D = new KEY_CODE("KeyD");
  static W = new KEY_CODE("KeyW");
  static RSHIFT = new KEY_CODE("ShiftRight", 16, "Shift")
  static LSHIFT = new KEY_CODE("ShiftLeft", 16, "Shift")
  static LCTRL = new KEY_CODE("ControlLeft", 17, "Control")
  static SPACE = new KEY_CODE("Space", 32, " ");
};

export function toKeyCode(e: KeyboardEvent): KEY_CODE {
  return (
      KEY_CODE.TO_KEYCODE.get(e.code) ||
      KEY_CODE.TO_KEYCODE.get(e.keyCode) ||
      KEY_CODE.TO_KEYCODE.get(e.key) ||
      KEY_CODE.TO_KEYCODE.get(e.which)
  ) || KEY_CODE.getUnknownKeyCode(e);
}
