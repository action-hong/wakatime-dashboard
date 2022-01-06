<script setup lang="ts">
import { calcTotal, useWakatime } from '~/hook/useWakatime'
import ProjectLine from '~/components/ProjectLine.vue'
const count = ref(7)
const {
  summary,
} = useWakatime(count)
const allSummary = computed(() => calcTotal(summary.value))
const projects = computed(() => allSummary.value.projects)

// 总的时间
const totalSeconds = computed(() => projects.value.reduce((acc, project) => acc + project.total_seconds, 0))
const totalTime = computed(() => {
  const seconds = totalSeconds.value
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours} hrs ${minutes} mins`
})

function formatVal(val: number | string) {
  return (`0${val}`).slice(-2)
}
</script>

<template>
  <div>
    <h1 class="text-xl">
      <strong>{{ totalTime }}</strong> over the Last {{ count }} Days
    </h1>
    <project-line
      :data="summary"
    />
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
        <p
          class="text-ellipsis overflow-hidden whitespace-nowrap"
          :title="item.name"
        >
          {{ item.name }}
        </p>
        <p
          text="right"
        >
          总时间: {{ formatVal(item.hours) }}:{{ formatVal(item.minutes) }}:{{ formatVal(item.seconds) }}
        </p>
      </div>
    </div>
  </div>
</template>
