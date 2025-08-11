import { readPointById } from '@/api/http'
import { getAllDataIdsSafe } from '@/views/display/util/util'

export default class DataHandleManager {
  currentSpaceRef: string = ''

  dataModels: any[] = []

  modelBindings: any[] = []

  setDataModels(list: any[]) {}

  spaceEquipmentsPromise: Promise<any[]> = Promise.resolve([])

  async setPointBindings(
    list: [
      any | undefined,
      ((value: any, type?: any, translatedText?: string) => void) | undefined
    ][]
  ): Promise<any[]> {
    const load = Array.from(
      new Set(
        list.flatMap(([point]) => {
          const pointId = point?.pointID
          return pointId ? [pointId] : [] // 有效值放入数组，无效值返回空数组
        })
      )
    )

    console.log('setPointBindings', load)

    if (load.length > 0) {
      let resData = []

      readPointById(load)
        .then((res: any) => {
          if (res.status === 'OK') {
            //挨个set
            resData = res.data || []
          } else {
            console.log('no data!')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    return []
  }

  setCurrentSpace(spaceRef?: string) {}

  async getCurrentSpaceEquipmentByName(name: string, templateRef: string) {
    return undefined
  }

  setModelBindings(list: any[]) {}

  pointTrendCache: Map<string, Promise<string>> = new Map()

  async getTrendRefByPointRef(pointRef: string) {
    return ''
  }

  async getTrendRef(list: (any | undefined)[]) {
    return []
  }

  async getTrendResult(
    list: (any | undefined)[],
    chartCondition: { jMode: number; dMode: number; startDate: Date; endDate: Date }
  ) {
    return []
  }

  subscribedPointMap: Map<string, ((value: any, type?: any, translatedText?: string) => void)[]> =
    new Map()

  async getEquipmentByDataModelBinding(binding: any) {
    return undefined
  }

  pointValidateCache = new Map<string, Promise<boolean>>()
  modelValidateCache = new Map<string, Promise<any | undefined>>()

  async validateBinding(
    binding?: any | { cpntId: number; innerName?: string; bindingType?: undefined }
  ): Promise<
    | undefined
    | 'networkPointLost'
    | 'equipmentReferenceLost'
    | 'equipmentPointUnbind'
    | 'equipmentPointBindingLost'
  > {
    return undefined
  }

  async validatePoint(pointRef: string) {
    return true
  }

  async getEquipmentByRef(modelRef: string): Promise<any | undefined> {}

  _eventCallback = new Map<String, any[]>()

  on(eventName: string, callback: any) {
    return () => {}
  }
  off(eventName: string, callback?: any) {}

  dispatch(eventName: string, event?: any, ...args: any[]) {}

  dispose() {}
}
