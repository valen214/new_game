



export const GLOABL = new Map();
Object.defineProperty(window, "GLOBAL", {
  get(){
    return GLOABL;
  }
});



export var game;

export function setGame(_game){
  game = _game;
  GLOABL.set("game", game);
}

Object.defineProperty(window, "game", {
  get(){
    return game;
  }
});