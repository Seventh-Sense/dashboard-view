<template>
  <suspense>
    <suspense-index v-if="JSONStringify(data) !== '{}'" :ProjectData="data"></suspense-index>
  </suspense>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import suspenseIndex from './suspenseIndex.vue'
import { readProject } from '@/api/http'
import { JSONStringify } from '@/utils'

const data = ref({})

onMounted(() => {
  getInitData()
})

const getInitData = async () => {
  console.log('Preview Index Mounted')

  try {
    const urlHash = document.location.hash
    const toPathArray = urlHash.split('/')
    const id = toPathArray && toPathArray[toPathArray.length - 1]

    const res: any = await readProject(id)

    if (res && res.content !== '') {
      data.value = res
    }
  } catch (error) {
    console.error('Error during initialization:', error)
  }
}
</script>
