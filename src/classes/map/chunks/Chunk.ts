import {
  Vector2,
  TextureLoader,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

export class Chunk {
  public mesh!: Mesh;

  public async create(
    size: Vector2,
    number: Vector2,
    visual: string
  ): Promise<Chunk> {
    try {
      const texture = await new TextureLoader().loadAsync(visual);
      const geometry = new PlaneBufferGeometry(size.x, size.y, 1, 1);
      const material = new MeshBasicMaterial({ map: texture });

      this.mesh = new Mesh(geometry, material);
      this.mesh.position.set(size.x * number.x, size.y * number.y, 0);

      return this;
    } catch (e) {
      throw new Error(e);
    }
  }
}
