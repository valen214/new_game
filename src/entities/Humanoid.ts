

enum STATE {
  IDLE,
  WALK,
  RUN,
}

class Humanoid
{

  public meshes: BABYLON.AbstractMesh[];
  public skeletons: BABYLON.Skeleton[];

  private state: STATE;


  private constructor(public scene: BABYLON.Scene){
    this.meshes = Humanoid.meshes;
    this.skeletons = Humanoid.skeletons;

    var skeleton = this.skeletons[0];

    skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true;
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
    skeleton.animationPropertiesOverride.loopMode = 1;

    this.beginWalk();
  }

  beginIdle(){
    if(this.state !== STATE.IDLE){
      this.state = STATE.IDLE;

      let ag = Humanoid.animationGroups[0];
      ag.stop();
      ag.goToFrame(0);
    }
  }

  beginWalk(){
    if(this.state !== STATE.WALK){
      this.state = STATE.WALK;

      let ag = Humanoid.animationGroups[0];
      ag.stop();
      ag.start(false, 1.0, 0, 1);
      new Promise(res => {
        ag.onAnimationEndObservable.addOnce(res)
      }).then(() => {
        ag.start(true, 2.0, 1, 4);
      })

    }
  }



  addShadow(shadowGen: BABYLON.ShadowGenerator): Humanoid {
    shadowGen.addShadowCaster(this.scene.meshes[0], true);
    for (var index = 0; index < this.meshes.length; index++) {
      this.meshes[index].receiveShadows = false;
    }
    return this;
  }

  private static imported = false;
  private static meshes: BABYLON.AbstractMesh[];
  private static skeletons: BABYLON.Skeleton[];
  private static animationGroups: BABYLON.AnimationGroup[];
  public static async createHumanoid(scene: BABYLON.Scene): Promise<Humanoid> {
    if(!Humanoid.imported){
      await BABYLON.SceneLoader.ImportMeshAsync("",
        "./assets/", "humanoid.glb", scene
      ).then(({ meshes, particleSystems, skeletons, animationGroups }) => {
        Humanoid.meshes = meshes;
        Humanoid.skeletons = skeletons;
        Humanoid.animationGroups = animationGroups;

        console.log(animationGroups);
      });
    }
    return new Humanoid(scene);
  }
}


export default Humanoid;