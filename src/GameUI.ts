
class GameUI
{

  static info_text: BABYLON.GUI.TextBlock;

  static createUI(){
    let uiTexture = BABYLON.GUI
        .AdvancedDynamicTexture
        .CreateFullscreenUI("UI");


    GameUI.info_text = new BABYLON.GUI.TextBlock("info_text", "");
    Object.assign(GameUI.info_text, {
      horizontalAlignment:
          BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment:
          BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
      left: 0.1,
      top: 0.1,
      width: 0.3,
      height: "40px",
      fontSize: 24,
      color: "white",
    });
    uiTexture.addControl(GameUI.info_text);

    var createRectangle = function() {
      var rect1 = new BABYLON.GUI.Rectangle();
      rect1.width = 0.2;
      rect1.height = "40px";
      rect1.cornerRadius = 20;
      rect1.color = "white";
      rect1.thickness = 4;
      rect1.background = "green";
      uiTexture.addControl(rect1);  

      return rect1;
    }


    var text = new BABYLON.GUI.TextBlock("info_text", "HELLO WORLD");
    Object.assign(text, {
      horizontalAlignment:
          BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment:
          BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
      left: 0.1,
      top: 0.1,
      width: 0.3,
      height: "40px",
      fontSize: 24,
      color: "white",
    });
    uiTexture.addControl(text);

    createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;


  }
}

export default GameUI;