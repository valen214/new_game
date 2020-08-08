

enum STATE {
  IDLE,
  WALK,
  RUN,
}

class Human
{

  public meshes: BABYLON.AbstractMesh[];
  public skeletons: BABYLON.Skeleton[];

  private idleRange: BABYLON.AnimationRange;
  private walkRange: BABYLON.AnimationRange;
  private runRange: BABYLON.AnimationRange;

  private state: STATE;


  private constructor(public scene: BABYLON.Scene){
    this.meshes = Human.meshes;
    this.skeletons = Human.skeletons;

    var skeleton = this.skeletons[0];

    skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true;
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
    skeleton.animationPropertiesOverride.loopMode = 1;

    this.idleRange = skeleton.getAnimationRange("YBot_Idle");
    this.walkRange = skeleton.getAnimationRange("YBot_Walk");
    this.runRange = skeleton.getAnimationRange("YBot_Run");
    var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");

    this.beginIdle();

    window["a"] = this.scene;
    window["b"] = this.skeletons;
    window["c"] = this;
  }

  beginIdle(){
    if(this.idleRange && this.state !== STATE.IDLE){
      this.state = STATE.IDLE;

      this.scene.beginAnimation(
        this.skeletons[0],
        this.idleRange.from,
        this.idleRange.to,
        true
      );
    }
  }

  beginWalk(){
    if(this.walkRange && this.state !== STATE.WALK){
      console.log("BEGIN WALK");
      this.state = STATE.WALK;
      
      this.scene.beginAnimation(
        this.skeletons[0],
        this.walkRange.from,
        this.walkRange.to,
        true
      );
    }
  }
  beginRun(){
    if(this.runRange && this.state !== STATE.RUN){
      this.state = STATE.RUN;
      
      this.scene.beginAnimation(this.skeletons[0],
        this.runRange.from, this.runRange.to, true
      );
    }
  }



  addShadow(shadowGen: BABYLON.ShadowGenerator): Human {
    shadowGen.addShadowCaster(this.scene.meshes[0], true);
    for (var index = 0; index < this.meshes.length; index++) {
      this.meshes[index].receiveShadows = false;
    }
    return this;
  }

  private static imported = false;
  private static meshes: BABYLON.AbstractMesh[];
  private static skeletons: BABYLON.Skeleton[];
  public static async createHuman(scene: BABYLON.Scene): Promise<Human> {
    if(!Human.imported){
      await BABYLON.SceneLoader.ImportMeshAsync("",
        "./assets/", "dummy3.babylon", scene
      ).then(({ meshes, particleSystems, skeletons }) => {
        Human.meshes = meshes;
        Human.skeletons = skeletons;
      });
    }
    return new Human(scene);
  }
}


export default Human;