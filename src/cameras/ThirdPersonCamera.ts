
export class ThirdPersonCamera
extends BABYLON.ArcRotateCamera
{
  public offset: BABYLON.Mesh = new BABYLON.Mesh(
      "3rd person camera offset"
  );

  public onKey: () => void;
  public onMouse: () => void;

  constructor(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    target: BABYLON.Vector3,
    scene: BABYLON.Scene,
    setActiveOnSceneIfNoneActive?: boolean
  ){
    super(
      name, alpha, beta, radius, target,
      scene, setActiveOnSceneIfNoneActive
    );

    // scene.addMesh(this.offset);
    this.setTarget(this.offset);
    
    this.zoomOnFactor = 0.01;
    this.lowerRadiusLimit = 0.001;
    this.wheelPrecision = 50;

  }
  
  attach(){
    const canvas = this.getEngine().getRenderingCanvas();
    this.attachControl(canvas, true);

    return this;
  }
  detach(){
    this.offset.parent = null;
    this.detachControl(this.getEngine().getRenderingCanvas());
    return this;
  }

  setOffset(x: number, y: number, z: number){
    this.offset.position.set(x, y, z);
    return this;
  }
}