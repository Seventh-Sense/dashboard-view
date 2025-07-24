import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SquareTitleConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  radius: 6,
  filter: 32,
  backgroundColor: '#FFFFFF12',
  isTitle: true,
  title_color: '#FFFFFF99',
  title_content: '温度',
  title_size: 16
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SquareTitleConfig.key
  public chartConfig = cloneDeep(SquareTitleConfig)
  public option = cloneDeep(option)
}
