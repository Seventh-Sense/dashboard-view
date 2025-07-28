<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { readProjectList } from '@/api/http'

const flag = ref(false)

onMounted(() => {
  initTable()
})

const initTable = async () => {
  flag.value = true

  try {
    const res: any = await readProjectList()

    if (res.status !== 'OK') {
      console.warn('Non-OK response status:', res.status)
      return
    }

    if (Array.isArray(res.data) && res.data.length > 0) {
      res.data.forEach((item: any) => {
        //slides.value.push(item)
      })
    }
  } catch (e) {
    console.error('onChange:', e)
  } finally {
    flag.value = false
  }
}
</script>

<style lang="scss" scoped></style>
