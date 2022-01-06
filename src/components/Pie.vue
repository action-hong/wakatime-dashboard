
<script lang="ts" setup>
import * as echarts from 'echarts'
import type { ECharts, TooltipComponentPositionCallbackParams } from 'echarts'
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import type { SummaryTime } from '~/hook/useWakatime'
import { isDark } from '~/composables'
import { formatTime } from '~/utils'
const props = defineProps({
  data: {
    type: Array as PropType<SummaryTime[]>,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
})

// FIXME: 这里使用ref来包含charts实例，就无法显示tooltip了
// https://www.cnblogs.com/zhanglw456/p/15272452.html
// https://github.com/apache/echarts/issues?q=vue3+tooltip
let myChart: ECharts | null = null
const chartRef = ref<HTMLElement | null>(null)

const series = computed(() => {
  return {
    type: 'pie',
    radius: '50%',
    tooltip: {
      trigger: 'item',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    data: props.data.map(v => ({
      name: v.name,
      value: v.total_seconds,
    })),
  }
})

function updateChart() {
  if (myChart && chartRef.value) {
    myChart.setOption({
      title: {
        text: props.title,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: TooltipComponentPositionCallbackParams) => {
          if (Array.isArray(params)) {
            return ''
          }
          else {
            const {
              name,
              percent,
              value,
              marker,
            } = params
            return `${marker}${name}<br/>${formatTime(value as number)}: ${percent}%`
          }
        },
      },
      series: series.value,
    })
  }
}

onMounted(() => {
  nextTick(() => {
    if (chartRef.value) {
      myChart = echarts.init(chartRef.value, isDark.value ? 'dark' : 'light')
      updateChart()
    }
  })
})

onUnmounted(() => {
  if (myChart)
    myChart.dispose()
})

watch(series, () => {
  if (myChart)
    updateChart()
}, {
  deep: true,
})

useResizeObserver(document.documentElement, () => {
  if (myChart)
    myChart.resize()
})

</script>

<template>
  <div
    ref="chartRef"
    class="h-100"
  />
</template>
