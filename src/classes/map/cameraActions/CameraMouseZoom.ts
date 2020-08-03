import { MathUtils } from 'three';
import { CameraAction } from './CameraAction';
import { Map3D } from '../Map3D';

const p = 0.10;
const q = 0.2;

const clampMin = 0;
const clampMax = 10;

export function toZoom(x: number) {
  return p * Math.pow(x, 2) + q;
}

export function toNormal(y: number) {
  return Math.sqrt((-q + y) / p);
}

export class CameraZoom extends CameraAction {
  constructor(map3D: Map3D) {
    super(map3D);
    window.addEventListener("wheel", this.onWheel.bind(this));
  }

  private onWheel(event: WheelEvent) {
    if (!this.isOnCanvas(event))
      return; 

    const delta = -event.deltaY;

    const zoom = toZoom(MathUtils.clamp(toNormal(this.map3D.camera.zoom) + (delta / 250), clampMin, clampMax));
    this.map3D.zoomCamera(zoom);
  }

  public destroy(): void {
    removeEventListener('wheel', this.onWheel);
  }
}
