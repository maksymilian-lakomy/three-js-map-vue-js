import Vue from 'vue';

import { OrthographicCamera, Scene, WebGLRenderer, Vector3, Box3 } from 'three';
import { CameraAction } from './cameraActions/CameraAction';
import { ChunkMap } from './chunks/ChunkMap';
import { MapData } from './data/MapData';

export class Map3D {
  public readonly camera: OrthographicCamera;
  public readonly scene: Scene;
  public readonly renderer: WebGLRenderer;

  private readonly cameraActions = Array<CameraAction>();
  private readonly chunkMap = new ChunkMap();

  public readonly events = new Vue();

  constructor(width: number, height: number) {

    const { left, right, top, bottom, near, far } = this.calculateCameraFrustum(width, height);
    this.camera = new OrthographicCamera(left, right, top, bottom, near, far);

    this.scene = new Scene();
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);
  }

  public async renderMap(mapData: MapData, cameraActions: Array<typeof CameraAction>) {
    // Clear old map
    this.cameraActions.forEach(action => action.destroy());
    this.chunkMap.chunkMapObject3D && this.scene.remove(this.chunkMap.chunkMapObject3D);

    try {
      await this.chunkMap.generateMap(mapData);
    } catch (e) {
      throw new Error(e);
    }

    this.cameraActions.push(...cameraActions.map(Action => new Action(this)));

    this.moveCamera(new Vector3(0, 0, 100));
    this.scene.add(this.chunkMap.chunkMapObject3D);

    this._boundingBox.setFromObject(this.chunkMap.chunkMapObject3D);

    this.events.$emit('map-render');
  }

  private _boundingBox = new Box3();

  public get boundingBox(): Box3 {
    this._boundingBox.setFromObject(this.chunkMap.chunkMapObject3D);
    return this._boundingBox;
  }

  private calculateCameraFrustum(width: number, height: number) {
    return {
      left: width / -2,
      right: width / 2,
      top: height / 2,
      bottom: height / -2,
      near: 1,
      far: 1000
    };
  }

  public setSize(width: number, height: number) {
    this.renderer.setSize(width, height);

    const { left, right, top, bottom, near, far } = this.calculateCameraFrustum(width, height);

    this.camera.left = left;
    this.camera.right = right;
    this.camera.top = top;
    this.camera.bottom = bottom;
    this.camera.near = near;
    this.camera.far = far;

    this.camera.updateProjectionMatrix();
  }

  public moveCamera({ x, y, z }: Vector3) {
    this.camera.position.set(x, y, z);
    this.events.$emit('camera-move',);
    this.camera.updateProjectionMatrix();
  }

  public zoomCamera(zoom: number) {
    this.camera.zoom = zoom;
    this.events.$emit('camera-zoom');
    this.camera.updateProjectionMatrix();
  }

  public animate() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.cameraActions.forEach(action => action.destroy());
  }
}