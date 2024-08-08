<template>
  <div class="go-project-items">
    <n-tabs type="line" animated justify-content="space-evenly">
      <n-tab-pane key="list" name="list" tab="List">
        <LinkObject/>
      </n-tab-pane>
      <n-tab-pane key="configuration" name="configuration" tab="Configuration">
        <ConfigCards/>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ConfigCards } from './components/ConfigCards'
import { LinkObject } from './components/LinkObject'

</script>

<style lang="scss" scoped>
@include go(project-items) {
  padding: 12px 12px;
}
</style>
