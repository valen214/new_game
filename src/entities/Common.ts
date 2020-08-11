

namespace Common {

  export function createBox(scene: BABYLON.Scene, {
    name,
    height = 1,
    width = 1,
    depth = 1,
    pos = [0, 0, 0],
    physics = null
  }: {
    name: string
    height?: number
    width?: number
    depth?: number
    pos?: number[]
  
    physics?: BABYLON.PhysicsImpostorParameters & {
      type?: number
    }
  }){
    var box = BABYLON.MeshBuilder.CreateBox(name, {
      height, width, depth
    }, scene);
    box.position.set(pos[0], pos[1], pos[2]);
    if(physics){
      let type = physics.type;
      if(type === null || type === undefined){
        type = BABYLON.PhysicsImpostor.BoxImpostor
      }
      box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box, type, physics, scene
      );
    }
  
    return box;
  }

  export function createSphere(scene: BABYLON.Scene, {
    name,
    diameter = 1,
    pos = [0, 0, 0],
    physics = null
  }: {
    name: string
    diameter?: number
    pos?: number[]
  
    physics?: BABYLON.PhysicsImpostorParameters & {
      type?: number
    }
  }){
    var sphere = BABYLON.MeshBuilder.CreateSphere(name, {
      diameter
    }, scene);
    sphere.position.set(pos[0], pos[1], pos[2]);
    if(physics){
      let type = physics.type;
      if(type === null || type === undefined){
        type = BABYLON.PhysicsImpostor.SphereImpostor
      }
      sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere, type, physics, scene
      );
    }
  
    return sphere;
  }



}

export default Common;