<template>
  <div class="container">
    <div class="container-top">
      <div style="display: flex; align-items: center">
        <n-icon size="28" style="cursor: pointer" @click="onBack">
          <ChevronLeftIcon />
        </n-icon>
        <span class="container-top-title">{{ data.name }}</span>
      </div>

      <n-button class="container-top-button" @click="onSearch">
        {{ $t('global.r_search') }}
      </n-button>
    </div>
    <div class="container-content">
      <a-table :columns="columns" :data-source="dataSource" bordered>
        <template #bodyCell="{ column, text, record }">
          <template v-if="['name', 'value', 'unit'].includes(column.dataIndex)">
            <div>
              <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex as keyof DataItem]"
                style="margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.key]">
                <a-typography-link @click="save(record.key)">Save</a-typography-link>
                <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                  <a>Cancel</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(record.key)">Edit</a>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { onMounted, ref, watch, reactive } from 'vue'
import type { UnwrapRef } from 'vue';
import { icon } from '@/plugins'

const { ChevronLeftIcon, EditIcon } = icon.carbon

const emit = defineEmits(['show'])
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

interface DataItem {
  key: string
  name: string
  value: number
  unit: string
}

onMounted(() => {})

watch(
  () => props.data,
  value => {
    console.log(value)
  },
  { deep: true }
)

const onBack = () => {
  emit('show', true)
}
const onSearch = () => {}

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: 'value',
    dataIndex: 'value',
    width: '15%',
  },
  {
    title: 'unit',
    dataIndex: 'unit',
    width: '40%',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
  },
];

const data: DataItem[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    value: 32,
    unit: `London Park no. ${i}`,
  });
}

const dataSource = ref<DataItem[]>(data)

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = (key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];
};
const cancel = (key: string) => {
  delete editableData[key];
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #{$--color-dark-side};
  border-radius: 18px;
  backdrop-filter: blur(50px);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;

  &-top {
    height: #{$--card-top-height};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffffed;
      font-style: normal;
      text-transform: none;
      margin-left: 8px;
    }

    &-button {
      width: 64px;
      height: 32px;
      border-radius: 2px;
      font-size: 14px;
    }
  }

  &-content {
    padding: 0 16px;
    flex: 1;
    overflow-y: auto;

    &-card {
      height: 166px;
      width: 100%;
      border-radius: 8px;
      background-color: $--color-dark-b-card;

      &-top {
        height: 122px;
        width: 100%;
        border-radius: 8px;
        background-color: $--color-dark-card-image;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      &-bottom {
        width: 100%;
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
      }
    }
  }
}
</style>
