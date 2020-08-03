import { Vector2 } from 'three';

export interface MapData {
  tiles: Array<string>;
  tileDimensions: Vector2;
  columns: number;
}