import {
  Object3D,
  InstancedMesh,
  Mesh,
  Geometry,
  BufferGeometry,
  PlaneBufferGeometry,
} from "three";

import { Markers3DData } from "./data/Markers3DData";

export class Markers3D {
  public readonly markers: Object3D = new Object3D();

  public setLayer(markers: Markers3DData, zoom = 1) {
    this.removeLayer(markers.id);

    const geometry = this.calculateScale(zoom);
    const material =
      markers.visual.material instanceof Array
        ? markers.visual.material[0].clone()
        : markers.visual.material.clone();

    const instancedMesh = new InstancedMesh(
      geometry,
      material,
      markers.positions.length
    );
    instancedMesh.uuid = markers.id;

    const dummy = new Object3D();

    markers.positions.forEach((position, i) => {
      const { x, y } = position;
      dummy.position.set(x, y, 1);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);
    });

    this.markers.add(instancedMesh);
  }

  public removeLayer(layerId: string): void {
    const layer = this.markers.children.find((layer) => layer.uuid === layerId);
    if (layer) this.markers.remove(layer);
  }

  public updateScales(factor: number): void {
    this.markers.children.forEach((child) => {
      console.log(factor);
      if (!(child instanceof Mesh)) return;

      child.geometry = this.calculateScale(factor);
    });
  }

  private calculateScale(factor: number): Geometry | BufferGeometry {
    console.log(factor);
    return new PlaneBufferGeometry(20 - factor, 20 - factor, 1, 1);
  }

  public clear(): void {
    while (this.markers.children.length > 0)
      this.markers.remove(this.markers.children[0]);
  }
}
