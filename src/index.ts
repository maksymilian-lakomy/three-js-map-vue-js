import {VueConstructor} from 'vue';
import VueMap from './components/VueMap.vue';

export default {
  install(Vue: VueConstructor) {
    Vue.component("vue-map", VueMap);
  }
}