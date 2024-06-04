<template>
  <div class="card-table">
    <div>
      <div class="card-title">属性</div>
      <div>
        <!-- <n-data-table
          :key="row => row.key"
          :columns="columns"
          :data="data"
          :pagination="false"
          :on-update:page="handlePageChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, ref, nextTick, computed } from 'vue'
import { NInput } from 'naive-ui'


</script>

<style lang="scss" scoped>
@import '../../../style/table.scss';
</style>
