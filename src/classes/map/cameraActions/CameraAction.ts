import { Map3D } from '../Map3D';

export class CameraAction {
  protected map3D: Readonly<Map3D>;

  constructor(map3D: Readonly<Map3D>) {
    this.map3D = map3D;
  }

  protected isOnCanvas(event: Event) {
    return event.srcElement instanceof HTMLCanvasElement;
  }

  public destroy(): void {
    console.warn('Destroy called on default CameraAction!');
  };
}