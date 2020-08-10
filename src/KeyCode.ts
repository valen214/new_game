
/**
 * https://keycode.info/
 */

export class KEY_CODE
{
  /**
   * TODO: handle duplicate problem
   */
  static STRING_TO_KEYCODE = new Map<string | number, KEY_CODE>();


  protected constructor(
    public code?: string,
    public keyCode?: number,
    public key?: string,
    public which?: number, // deprecated
  ){
    [code, keyCode, key, which].filter(k => !!k).forEach(e => {
      KEY_CODE.STRING_TO_KEYCODE.set(e, this);
    });
  }

  static getKeyCode(e: KeyboardEvent | string | number){
    let out = null;
    if(e instanceof KeyboardEvent){
      out = (
          KEY_CODE.STRING_TO_KEYCODE.get(e.code) ||
          KEY_CODE.STRING_TO_KEYCODE.get(e.keyCode) ||
          KEY_CODE.STRING_TO_KEYCODE.get(e.key) ||
          KEY_CODE.STRING_TO_KEYCODE.get(e.which)
      );
    } else{
      out = KEY_CODE.STRING_TO_KEYCODE.get(e);
    }
    if(out) return out;

    if(e instanceof KeyboardEvent){
      out = new KEY_CODE(e.code, e.keyCode, e.key, e.which);
    } else{
      return new KEY_CODE(
          typeof e === "string" ? e : null,
          typeof e === "number" ? e : null);
    }
    return out;
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

export const toKeyCode = KEY_CODE.getKeyCode;
