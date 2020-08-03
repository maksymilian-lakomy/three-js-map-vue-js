import { OrthographicCamera, Vector3, Object3D, Box3 } from 'three';
import { CameraAction } from './CameraAction';
import { Map3D } from '../Map3D';

export class CameraMovement extends CameraAction {

  constructor(map3D: Map3D) {
    super(map3D);

    addEventListener("mousedown", this.onMouseDown.bind(this));
    addEventListener("mousemove", this.onMouseMove.bind(this));
    addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private startPosition: Vector3 | null = null;

  onMouseDown(event: MouseEvent) {
    if (!this.isOnCanvas(event))
      return; 

    this.startPosition = new Vector3(-event.x, event.y, 0);
    this.map3D.events.$emit('mouse-drag-start');
  }

  onMouseMove(event: MouseEvent) {
    if (!this.startPosition)
      return;

    const mousePosition = new Vector3(-event.x, event.y, 0);
    const dragVector = mousePosition.clone().sub(this.startPosition).divideScalar(this.map3D.camera.zoom);

    this.startPosition = mousePosition;

    const destinationPosition = this.map3D.camera.position.add(dragVector);
    const clampedPoint = new Vector3(0, 0, 0);

    this.map3D.boundingBox.clampPoint(destinationPosition, clampedPoint);
    clampedPoint.z = this.map3D.camera.position.z;

    this.map3D.moveCamera(clampedPoint);
  }

  onMouseUp() {
    this.startPosition = null;
    this.map3D.events.$emit('mouse-drag-stop');
  }

  public destroy(): void {
    removeEventListener("mousedown", this.onMouseDown);
    removeEventListener("mousemove", this.onMouseMove);
    removeEventListener("mouseup", this.onMouseUp);
  }
}