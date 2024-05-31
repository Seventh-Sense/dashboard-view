<template>
  <div class="go-project-items">
    <div>
        <n-grid x-gap="12" :cols="4">
            <n-gi>
                <Status/>
            </n-gi>
            <n-gi>
                <NetNum/>
            </n-gi>
            <n-gi>
                <Addr/>
            </n-gi>
            <n-gi>
                <Dnum/>
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
import { Status } from "./components/Status/index";
import { NetNum } from "./components/NetNum/index";
import { Addr } from "./components/Addr/index";
import { Dnum } from "../Home/components/Dnum/index";
import { Porperty } from "../Home/components/Porperty/index";
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
