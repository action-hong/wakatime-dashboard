<script lang="ts" setup>
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
const myChart = ref<ECharts | null>(null)
const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (chartRef.value)
    myChart.value = echarts.init(chartRef.value)
})

useResizeObserver(window, () => {
  if (myChart.value)
    myChart.value.resize()
})

</script>

<template>
  <div ref="chartRef" />
</template>
