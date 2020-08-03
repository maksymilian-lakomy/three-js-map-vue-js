import { Vector2, Object3D, Box3, Vector3 } from "three";
import { Chunk } from "./Chunk";

import { MapData } from "@/classes/map/data/MapData";

export class ChunkMap {
  public readonly chunkMapObject3D = new Object3D();
  private chunks!: Array<Chunk>;

  async generateMap({
    tiles,
    tileDimensions,
    columns,
  }: MapData): Promise<Object3D> {
    
    const chunks = tiles.map((tileVisual, i) => {
      const tileCoords = new Vector2(
        i % columns,
        Math.floor(tiles.length / columns) - Math.floor(i / columns)
      );
      return new Chunk().create(tileDimensions, tileCoords, tileVisual);
    });

    this.chunks = await Promise.all(chunks);

    this.chunks.forEach((chunk) => this.chunkMapObject3D.add(chunk.mesh));

    const boundingBox = new Box3();
    boundingBox.expandByObject(this.chunkMapObject3D);

    const center = new Vector3(0, 0, 0);
    boundingBox.getCenter(center);

    this.chunkMapObject3D.position.set(-center.x, -center.y, 0);

    return this.chunkMapObject3D;
  }
}
