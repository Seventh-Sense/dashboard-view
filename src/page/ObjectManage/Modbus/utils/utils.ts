export const dataTypeOptions = ['16int', '16uint', '32int', '32uint', '32float'].map(v => ({
  label: v,
  value: v
}))

export const byteOptions = ['bool'].map(v => ({
  label: v,
  value: v
}))

export const bacnetOptions = ['None', 'AI', 'AO', 'AV', 'BI', 'BO', 'BV', 'MV'].map(v => ({
  label: v,
  value: v
}))

export const regTypeOptions = [
  {
    label: 'Coils',
    value: '0'
  },
  {
    label: 'Digital Input',
    value: '1'
  },
  {
    label: 'Input Registers',
    value: '3'
  },
  {
    label: 'Holding Registers',
    value: '4'
  }
]

export const codingOptions = [
  {
    label: 'AB',
    value: 'AB'
  },
  {
    label: 'BA',
    value: 'BA'
  },
  {
    label: 'ABCD',
    value: 'ABCD'
  },
  {
    label: 'BADC',
    value: 'BADC'
  },
  {
    label: 'CDAB',
    value: 'CDAB'
  },
  {
    label: 'DCBA',
    value: 'DCBA'
  }
]
