export type Chartype = {
  id: number | string
  title: string // 标题
  label: string // 标签
  release: boolean // 0未发布 | 1已发布
  image?: any
  time?: any
  type?: string
}

export type ChartList = Chartype[]