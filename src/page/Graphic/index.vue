<template>
  <GraphicEditor class="graphic-editor" v-if="graphicData !== null" :graphicData="graphicData" @onExit="onExit()"
    @onSave="onSave" @showPreview="showPreview"></GraphicEditor>
</template>

<script setup lang="ts">
import { GraphicEditor } from '@x-plateform/graphic-editor'
import { onMounted, ref } from 'vue';

const graphicData = ref<any | null>(null);

onMounted(() => {
  graphicData.value = JSON.parse('{}')
})

const onExit = () => {

}

const onSave = () => {

}

const showPreview = () => {

}
</script>

<style lang="scss" scoped>
// .graphic-editor :deep(*) {
//   box-sizing: unset !important;

//   & *,
//   & *::before,
//   & *::after {
//     box-sizing: inherit;

//   }
// }


</style>
