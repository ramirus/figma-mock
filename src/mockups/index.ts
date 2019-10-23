import iphone8 from './iphone-8/index'

export const mockKey = (mock: MOCKUP_KEY) => `${mock.title}-${mock.color}-${mock.modific}`

const mockupArr: MOCKUP[] = [...iphone8]

const mockups:Map<string, MOCKUP> = new Map()

mockupArr.forEach(item => {
  mockups.set(mockKey(item), item)
})

export default mockups