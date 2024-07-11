import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SquareConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  radius: 18,
  opacity: 1.0,
  backgroundColor: '#000044'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SquareConfig.key
  public chartConfig = cloneDeep(SquareConfig)
  public option = cloneDeep(option)
}