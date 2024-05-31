<template>
  <div class="go-project-items">
    <div>
        <n-grid x-gap="12" :cols="4">
            <n-gi>
                <Health/>
            </n-gi>
            <n-gi>
                <Alarm/>
            </n-gi>
            <n-gi>
                <Dnum/>
            </n-gi>
            <n-gi>
                <Health/>
            </n-gi>
        </n-grid>
    </div>
    <div style="margin-top: 24px; flex-grow: 1;">
        <n-grid x-gap="12" :cols="2">
            <n-gi>
                <Porperty/>
            </n-gi>
            <n-gi>
                <Statics/>
            </n-gi>
        </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Health } from "./components/Health/index";
import { Alarm } from "./components/Alarm/index";
import { Dnum } from "./components/Dnum/index";
import { Porperty } from "./components/Porperty/index";
import { Statics } from "./components/Statics/index";
</script>

<style lang="scss" scoped>
@include go(project-items) {
  padding: 12px 12px;
  min-height: calc(100vh - #{$--header-height} * 2 - 2px);
  display: flex;
  flex-direction: column;
}
</style>
