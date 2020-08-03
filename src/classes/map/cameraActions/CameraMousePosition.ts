import { Map3D } from '../Map3D';
import { CameraAction } from './CameraAction';
import { Vector2 } from 'three';

export class CameraMousePosition extends CameraAction {
  constructor(map3D: Readonly<Map3D>) {
    super(map3D);

    addEventListener("mousemove", this.calculateCoords.bind(this));
  }

  private calculateCoords(event: MouseEvent): void {
    if (!this.isOnCanvas(event))
      return; 
      
    const size = new Vector2();
    this.map3D.renderer.getSize(size);

    const screenCenter = size.clone().divideScalar(2);
    const cameraPosition = new Vector2(this.map3D.camera.position.x, this.map3D.camera.position.y);
    const mousePosition = new Vector2(size.x - event.x, event.y);

    const worldPosition =
      screenCenter.clone().
        sub(mousePosition).
        divideScalar(this.map3D.camera.zoom).
        add(cameraPosition);

    this.map3D.events.$emit('mouse-move', worldPosition);
  }

  public destroy() {
    removeEventListener("mousemove", this.calculateCoords);
  }
}