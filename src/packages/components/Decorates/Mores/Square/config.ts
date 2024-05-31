import {  PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { SquareConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  radius: 18,
  opacity: 0.8,
  backgroundColor: '#0004'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = SquareConfig.key
  public chartConfig = cloneDeep(SquareConfig)
  public option = cloneDeep(option)
}