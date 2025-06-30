import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ImageConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import logo from '@/assets/University_logo.png'

export const option = {
  datavalue: '0',
  dataset: logo,
  // 图片路径
  pictures: [
    {
      key: 1,
      url: logo,
      value: '0'
    }
  ],
  // 适应方式
  fit: 'contain',
  // 圆角
  borderRadius: 10
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ImageConfig.key
  public chartConfig = cloneDeep(ImageConfig)
  public option = cloneDeep(option)
}
