

export interface IEntity
{
  /**
   * @param action name of the animation/action
   */
  begin(action: string): boolean | void;

  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
  rootMesh: BABYLON.AbstractMesh;

  move(vec: BABYLON.Vector3): void;
}