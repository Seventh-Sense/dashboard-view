<template>
  <div class="go-project-items">
    <project-items-list></project-items-list>
  </div>
</template>

<script setup lang="ts">
import { ProjectItemsList } from './components/ProjectItemsList'
</script>

<style lang="scss" scoped>
@include go(project-items) {
  padding: 12px 12px;
}
</style>
