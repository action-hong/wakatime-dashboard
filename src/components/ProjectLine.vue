<script lang="ts" setup>
import * as echarts from 'echarts'
import type { BarSeriesOption, ECharts, TooltipComponentPositionCallbackParams } from 'echarts'
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import type { Summary } from '~/hook/useWakatime'
import { isDark } from '~/composables'
const props = defineProps({
  data: {
    type: Array as PropType<Summary[]>,
    default: () => [],
  },
  type: {
    type: String as PropType<'projects' | 'categories'>,
    default: 'projects',
  },
})

// FIXME: 这里使用ref来包含charts实例，就无法显示tooltip了
// https://www.cnblogs.com/zhanglw456/p/15272452.html
// https://github.com/apache/echarts/issues?q=vue3+tooltip
let myChart: ECharts | null = null
const chartRef = ref<HTMLElement | null>(null)

const series = computed(() => {
  const len = props.data.length
  const res: BarSeriesOption[] = []
  for (let i = 0; i < len; i++) {
    const item = props.data[i]
    for (let j = 0; j < item[props.type].length; j++) {
      const project = item[props.type][j]
      const find = res.find(v => v.name === project.name)
      if (find) {
        find.data![i] = project.total_seconds / 3600
      }
      else {
        const item: BarSeriesOption = {
          type: 'bar',
          name: project.name,
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: new Array(len).fill(0),
        }
        item.data![i] = project.total_seconds / 3600
        res.push(item)
      }
    }
  }
  return res
})

function updateChart() {
  if (myChart && chartRef.value) {
    myChart.setOption({
      title: {
        text: props.type,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: TooltipComponentPositionCallbackParams) => {
          if (Array.isArray(params)) {
            const values = params.filter(params => params.data > 0)
            const result = values.map(({ seriesName, data, marker }) => {
              const value: number = data as number
              const hour = Math.floor(value)
              const min = Math.floor((value - hour) * 60)
              const sec = Math.floor(value * 3600 % 60)
              const time = `${hour}h${min}m${sec}s`
              return `
                      <div style="margin: 10px 0 0; line-height: 1">
                      <div style="margin: 0px 0 0; line-height: 1">
                        ${marker}
                        <span style="font-size: 12px; color: #6e7079; margin-left: 2px">${seriesName}</span>
                        <span
                          style="
                            float: right;
                            margin-left: 20px;
                            font-size: 14px;
                            color: #464646;
                            font-weight: 900;
                          "
                          >${time}</span>
                        <div style="clear: both"></div>
                      </div>
                      <div style="clear: both"></div>
                    </div>
                    `
            }).join('')

            return `
                  <div style="margin: 0px 0 0; line-height: 1">
                    <div style="margin: 0px 0 0; line-height: 1">
                      <div style="font-size: 12px; color: #6e7079; line-height: 1">
                        ${params[0].name}
                      </div>
                      <div style="margin: 10px 0 0; line-height: 1">
                        ${result}
                      </div>
                      <div style="clear: both"></div>
                    </div>
                    <div style="clear: both"></div>
                  </div>
                  `
          }
          return ''
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: props.data.map(v => v.range.date),
      },
      yAxis: {
        type: 'value',
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
