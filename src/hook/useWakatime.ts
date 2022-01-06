import type { Ref } from 'vue'

export type SummaryTime = {
  decimal: string
  digital: string
  hours: number
  minutes: number
  name: string
  percent: number
  seconds: number
  text: string
  total_seconds: number
}

export type Summary = {
  categories: SummaryTime[]
  editors: SummaryTime[]
  languages: SummaryTime[]
  projects: SummaryTime[]
  range: {
    date: string
    end: string
    start: string
    text: string
    timezone: string
  }
}

type SummaryFile = {
  filename: string
  raw_url: string
  type: string
}

type SummaryKey = Exclude<keyof Summary, 'range'>

// 时间叠加起来
export function calcTotal(summaryies: Summary[]): Summary {
  // 根据相同name的叠加起来
  const result: Summary = {
    categories: [],
    editors: [],
    languages: [],
    projects: [],
    range: {
      date: '',
      end: '',
      start: '',
      text: '',
      timezone: '',
    },
  }
  const keys = Object.keys(result).filter(key => key !== 'range') as Array<SummaryKey>
  keys.forEach((key) => {
    summaryies.forEach((summary) => {
      const summaryTime = summary[key]
      summaryTime.forEach((st) => {
        const index = result[key].findIndex(r => r.name === st.name)
        if (index === -1) {
          result[key].push({
            ...st,
          })
        }
        else {
          result[key][index].total_seconds += st.total_seconds
          result[key][index].hours += st.hours
          result[key][index].minutes += st.minutes
          result[key][index].seconds += st.seconds
        }
      })
    })
  })
  return result
}

export function useWakatime(count: Ref<number>) {
  // 过去n天的数据
  const loading = ref(false)
  const gistId = useLocalStorage('GIST_ID', '')

  const summary = ref<Summary[]>([])

  watch(
    [gistId, count],
    ([gistId, count]: [string, number]) => {
      // console.log(gistId, count)
      // 更新
      loading.value = true
      fetch(`https://api.github.com/gists/${gistId}`)
        .then(res => res.json())
        .then((res) => {
          const {
            files,
          } = res
          const arr: SummaryFile[] = Object.values(files)
          // const filterArr = arr.filter(({ type, filename }) => type === 'application/json' && /summaries/.test(filename))
          const filterArr = arr.filter(({ type, filename }) => type === 'application/json' && filename.startsWith('summaries'))
          // const filterArr = arr.filter(({ type }) => type === 'application/json')
          const len = filterArr.length
          const startIndex = count >= len ? 0 : len - count
          const urls: string[] = []
          const filesNames = filterArr.slice(startIndex)
          filesNames.forEach((item) => {
            urls.push(item.raw_url)
          })
          return Promise.all(urls.map(url => fetch(url).then(res => res.json()).then(res => res[0])))
        }).then((res) => {
          summary.value = res
        }).finally(() => {
          loading.value = false
        })
    },
    {
      immediate: true,
    },
  )

  return {
    loading,
    summary,
  }
}
