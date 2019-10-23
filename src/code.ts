import MOCKUPS, {mockKey} from './mockups/index'

function getSelection (): any[] {
  const selections = []
  for (const node of figma.currentPage.selection) {
    console.log(node)
    selections.push(node)
  }
  return selections
}

function getByWidth (width: number, mockups): DEFAULT_PARAMS {
  const result: DEFAULT_PARAMS = {
    title: undefined,
    modific: undefined,
    color: undefined,
  }
  mockups.forEach((mockup: MOCKUP_MAP_ITEM, key: string) => {
    if (mockup.size.includes(width)) {
      const index = mockup.size.indexOf(width)
      result.title = key
      result.modific = mockup.modific[index]
      result.color = mockup.color[index]
    }
  })
  return result
}

function getSelectionWidth (selection): number | null {
  if (!selection || selection.length === 0) return null
  return selection[0].width
}

const addPropDistinct = (item: any[], prop) => {
  if (item.indexOf(prop) === -1) {
    item.push(prop)
  }
}

const getMaskLayerSize = (mock: MOCKUP): { width: number, height: number } => {
  const { size, padding } = mock
  const width = size.width - 2 * padding.left
  const height = size.height - 2 * padding.top
  return { width, height }
}

function initMockups (): Map<string, MOCKUP_MAP_ITEM> {
  const mockups: Map<string, MOCKUP_MAP_ITEM> = new Map()
  console.log(MOCKUPS)
  MOCKUPS.forEach((mockup, index) => {
    const current = mockups.get(mockup.title)
    // todo modific, color, size make distinct
    if (current) {
      // current.items.push(index)
      addPropDistinct(current.color, mockup.color)
      addPropDistinct(current.modific, mockup.modific)
      addPropDistinct(current.size, mockup.size)
    } else {
      const obj = {
        // items: [index],
        color: [mockup.color],
        modific: [mockup.modific],
        size: [mockup.size.width],
      }
      console.log(obj)
      mockups.set(mockup.title, obj)
    }
  })
  console.log([...mockups])
  return mockups
}

function main () {
  const selections = getSelection()
  const size = getSelectionWidth(selections)
  const mockups = initMockups()
  console.log(mockups.values())
  console.log(mockups.entries())
  const defaultParams = getByWidth(size, mockups)
  const initParams = {
    mockups: [...mockups],
    defaultParams,
  }
  console.log('initParams', initParams)
  figma.ui.postMessage({ type: 'INIT_PARAMS', initParams })
}

figma.showUI(__html__)

main()

figma.ui.onmessage = async msg => {
  if (msg.type === 'CREATE') {
    const mock = MOCKUPS.get(mockKey(msg.data))
    const selections = getSelection()
    const groupArray: FrameNode[] = []
    selections.forEach(selection => {
      const mockup = figma.createNodeFromSvg(mock.file)
      const maskLayer = figma.createRectangle()
      const maskLayerSize = getMaskLayerSize(mock)
      // 
      const coef = selection.width / maskLayerSize.width
      // 
      maskLayer.resize(maskLayerSize.width * coef, maskLayerSize.height * coef)
      maskLayer.x = selection.x
      maskLayer.y = selection.y
      maskLayer.isMask = true
      mockup.resize(mockup.width * coef, mockup.height * coef)
      mockup.x = selection.x - mock.padding.left * coef
      mockup.y = selection.y - mock.padding.top * coef
      const selectionGroup = figma.group([selection], figma.currentPage)
      const group = figma.group([mockup, maskLayer], figma.currentPage)
      group.appendChild(selectionGroup)
      groupArray.push(group)
    })
    if (selections.length === 0) {
      const mockup = figma.createNodeFromSvg(mock.file)
      const maskLayer = figma.createRectangle()
      const maskLayerSize = getMaskLayerSize(mock)
      maskLayer.resize(maskLayerSize.width, maskLayerSize.height)
      maskLayer.x = mock.padding.left
      maskLayer.y = mock.padding.top
      maskLayer.isMask = true
      const group = figma.group([mockup, maskLayer], figma.currentPage)
      groupArray.push(group)
    }
    figma.currentPage.selection = groupArray
    figma.closePlugin()
    // Wait for the worker's response.
    // const newBytes: Uint8Array = await new Promise((resolve, reject) => {
    //   figma.ui.onmessage = value => resolve(value)
    // })

    // Create a new paint for the new image.
    // const newPaint = {}
    // newPaint.imageHash = figma.createImage(newBytes).hash
    // newFills.push(newPaint)
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')
    // const image: HTMLImageElement = await new Promise((resolve, reject) => {
    //   const img = new Image()
    //   img.onload = () => resolve(img)
    //   img.onerror = () => reject()
    //   img.src = iphone8black
    // })
    // canvas.width = image.width
    // canvas.height = image.height
    // ctx.drawImage(image, 0, 0)
    // const imageEncoded: Uint8Array = await new Promise((resolve, reject) => {
    //   canvas.toBlob(blob => {
    //     const reader = new FileReader()
    //     reader.onload = (e) => resolve(new Uint8Array(e.target.result))
    //     reader.onerror = () => reject(new Error('Could not read from blob'))
    //     reader.readAsArrayBuffer(blob)
    //   })
    // })
    // console.log(msg)
    // const image = figma.createImage(msg.data)
    // const node = figma.createRectangle()
    // const placeholder = figma.createRectangle()
    // placeholder.resize(733, 1310)
    // placeholder.x = 60
    // placeholder.y = 194
    // node.fills = [
    //   {
    //     type: "IMAGE",
    //     imageHash: image.hash,
    //     scaleMode: "FILL"
    //   }
    // ];
    // newFills.push(node)
    // const img = new Image();
    // img.onload = function() {
      //     // figma.currentPage.appendChild(img)
      // }
      // img.src = iphone8black
      // for (let i = 0; i < msg.count; i++) {
        //   const rect = figma.createRectangle()
        //   rect.x = i * 150
        //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}]
        //   figma.currentPage.appendChild(rect)
        //   nodes.push(rect)
        // }
    // const {height, width} = msg.size
    // node.resize(width, height)
    // figma.currentPage.selection = newFills
    // figma.group([node, placeholder], figma.currentPage)
    // figma.currentPage.appendChild(node)
    // figma.viewport.scrollAndZoomIntoView(newFills)
  }
  if (msg.type === 'CANCEL') {
		figma.closePlugin()
	}

  figma.closePlugin()
}
