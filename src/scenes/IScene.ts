
export interface IScene
{
  init(): Promise<IScene | void>;
  addEventListeners(): void;
  removeEventListeners(): void;
}