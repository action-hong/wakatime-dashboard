<script setup lang="ts">
import { calcTotal, useWakatime } from '~/hook/useWakatime'
const count = ref(10)
const {
  summary,
} = useWakatime(count)
const allSummary = computed(() => calcTotal(summary.value))
const projects = computed(() => allSummary.value.projects)

function formatVal(val: number | string) {
  return (`0${val}`).slice(-2)
}
</script>

<template>
  <div>
    hello this is Dashboard
    <h2>Projects</h2>
    <div
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(item) in projects"
        :key="item.name"
        bg="gray-200"
        border="1px solid"
        border-radius="4px"
        p="x-4 y-2"
        m="2"
        text="left"
        color="gray-700"
        shadow="md"
      >
        <p>{{ item.name }}</p>
        <p
          text="right"
        >
          总时间：{{ formatVal(item.hours) }}:{{ formatVal(item.minutes) }}:{{ formatVal(item.seconds) }}
        </p>
      </div>
    </div>
  </div>
</template>
