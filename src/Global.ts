


namespace GLOBAL {
  export function set(key: string, value: any){
    window[key] = value;
    console.log(`window[${key}]:`, value);
  }
  export function get(key: string){
    return window[key];
  }
  
  export var game;
  
  export function setGame(_game){
    game = _game;
    set("game", game);
  }
}

export default GLOBAL;