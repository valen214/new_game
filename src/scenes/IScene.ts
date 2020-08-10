
export interface IScene
{
  init(): Promise<IScene>;
  addEventListeners(): void;
  removeEventListeners(): void;
}