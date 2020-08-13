

export interface IEntity
{
  begin(action: string): boolean | void;

  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;

  move(vec: BABYLON.Vector3);
}