import { Vector2, Mesh } from 'three';

export interface Markers3DData {
  id: string;
  visual: Mesh;
  positions: Array<Vector2>;
}