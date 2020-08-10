
export class ThirdPersonCamera
extends BABYLON.ArcRotateCamera
{
  public offset: BABYLON.Mesh;

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
    this.offset  = new BABYLON.Mesh(
        "3rd person camera offset"
    );

    // scene.addMesh(this.offset);
    this.parent = this.offset;
    
    this.zoomOnFactor = 0.01;
    this.lowerRadiusLimit = 0.001;
    this.wheelPrecision = 50;

  }
  
  attach(){
    const canvas = this.getEngine().getRenderingCanvas();
    console.log("camera attach, canvas:", canvas);
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