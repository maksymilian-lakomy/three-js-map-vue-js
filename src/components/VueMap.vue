<template>
  <div :class="[className]"></div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';

import { Map3D } from '@/classes/map/Map3D';
import { MapData } from '@/classes/map/data/MapData';
import { Prop, Watch } from 'vue-property-decorator';
import { CameraAction } from '../classes/map/cameraActions/CameraAction';
import { Object3D } from 'three';

@Component
export default class VueMap extends Vue {
  private className = 'scene-canvas-wrapper';

  private map3D!: Map3D;

  private isMoving = false;

  @Prop({ required: true, type: Object })
  public mapData!: MapData;

  @Prop({ required: false, type: Array, default: [] })
  public cameraActions!: Array<typeof CameraAction>;

  @Watch('mapData', { immediate: true })
  async onMapChange() {
    this.map3D = new Map3D(window.innerWidth, window.innerHeight);
    await this.map3D.renderMap(this.mapData, this.cameraActions);
  }

  @Prop({ required: false, type: Object })
  public object3D?: Object3D;

  @Watch('object3D', { deep: true })
  onObject3Dchange(newValue: Object3D, oldValue: Object3D) {
    if (newValue === oldValue && this.map3D.scene.children.includes(newValue))
      return;

    if (oldValue) this.map3D.scene.remove(oldValue);

    if (newValue) this.map3D.scene.add(oldValue);
  }

  mounted() {
    this.$el.appendChild(this.map3D.renderer.domElement);

    this.map3D.events.$on('mouse-drag-start', () => (this.isMoving = true));
    this.map3D.events.$on('mouse-drag-stop', () => (this.isMoving = false));
    this.map3D.events.$on('map-render', () =>
      this.$emit('map-render', this.map3D.boundingBox.clone())
    );
    this.map3D.events.$on('camera-zoom', () =>
      this.$emit('camera-zoom', this.map3D.camera.zoom)
    );

    addEventListener('resize', this.onResize.bind(this));

    requestAnimationFrame(this.animate.bind(this));
  }

  onResize() {
    this.map3D.setSize(window.innerWidth, window.innerHeight);
    this.$emit('resize', this.map3D.boundingBox.clone());
  }

  animate() {
    this.map3D.animate();
    requestAnimationFrame(this.animate.bind(this));
  }

  destroyed() {
    removeEventListener('resize', this.onResize);
  }
}
</script>

<style lang="scss" scoped>
.scene-canvas-wrapper {
  cursor: grab;

  &--moving {
    cursor: grabbing;
  }

  canvas {
    display: block;
  }
}
</style>