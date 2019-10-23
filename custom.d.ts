interface DEFAULT_PARAMS {
  title?: string,
  modific?: number,
  color?: string,
}

interface MOCKUP {
  file: string
  title: string
  color: string
  modific: number
  size: { width: number, height: number }
  padding: { left: number, top: number }
}

interface MOCKUP_KEY {
  title: string
  color: string
  modific: number
}

interface MOCKUP_MAP_ITEM {
  // items: number[]
  color: string[]
  modific: number[]
  size: number[]
}